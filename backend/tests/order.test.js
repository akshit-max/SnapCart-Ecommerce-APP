import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import request from "supertest";
import { connectTestDb, closeTestDb, clearTestDb, createUser, createProduct } from "./setup.js";
import app from "../app.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import { cleanupExpiredPendingOrders } from "../controllers/orderController.js";

const stockOf = async (id) => (await productModel.findById(id)).quantity;

describe("Order API", () => {
  let token;

  before(connectTestDb);
  after(closeTestDb);
  beforeEach(async () => {
    await clearTestDb();
    ({ token } = await createUser());
  });

  it("uses the price from the database, not from the client", async () => {
    const product = await createProduct({ price: 1000, quantity: 5 });

    const res = await request(app)
      .post("/api/v1/order/cod")
      .set("Authorization", token)
      .send({ cart: [{ _id: product._id, qty: 2, price: 1 }] });

    assert.equal(res.status, 201);
    assert.equal(res.body.order.total, 2000);
    assert.equal(await stockOf(product._id), 3);
  });

  it("does not oversell and puts back stock when one item fails", async () => {
    const shirt = await createProduct({ name: "Shirt", quantity: 5 });
    const jeans = await createProduct({ name: "Jeans", quantity: 1 });

    const res = await request(app)
      .post("/api/v1/order/cod")
      .set("Authorization", token)
      .send({ cart: [{ _id: shirt._id, qty: 2 }, { _id: jeans._id, qty: 3 }] });

    assert.equal(res.status, 400);
    // shirt was reserved first, it must be given back
    assert.equal(await stockOf(shirt._id), 5);
    assert.equal(await stockOf(jeans._id), 1);
  });

  it("restores stock when the user cancels", async () => {
    const product = await createProduct({ quantity: 5 });
    const { body } = await request(app)
      .post("/api/v1/order/cod")
      .set("Authorization", token)
      .send({ cart: [{ _id: product._id, qty: 2 }] });

    const res = await request(app)
      .put(`/api/v1/order/cancel/${body.order._id}`)
      .set("Authorization", token);

    assert.equal(res.status, 200);
    assert.equal(res.body.order.status, "Cancelled");
    assert.equal(await stockOf(product._id), 5);
  });

  it("accepts a valid razorpay signature and rejects a fake one", async () => {
    const product = await createProduct();
    const { user, token: userToken } = await createUser({ email: "buyer@test.com" });

    // order as it looks after /razorpay/create (that step calls razorpay's servers)
    const order = await orderModel.create({
      items: [{ product: product._id, name: product.name, price: 1000, qty: 1 }],
      total: 1000,
      buyer: user._id,
      payment: { method: "Razorpay", status: "Pending", razorpayOrderId: "order_test123" },
    });

    const fake = await request(app)
      .post("/api/v1/order/razorpay/verify")
      .set("Authorization", userToken)
      .send({
        orderId: order._id,
        razorpay_order_id: "order_test123",
        razorpay_payment_id: "pay_test456",
        razorpay_signature: "f".repeat(64),
      });
    assert.equal(fake.status, 400);

    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update("order_test123|pay_test456")
      .digest("hex");

    const real = await request(app)
      .post("/api/v1/order/razorpay/verify")
      .set("Authorization", userToken)
      .send({
        orderId: order._id,
        razorpay_order_id: "order_test123",
        razorpay_payment_id: "pay_test456",
        razorpay_signature: signature,
      });
    assert.equal(real.status, 200);
    assert.equal(real.body.order.payment.status, "Paid");
  });

  it("lets only admins update order status", async () => {
    const product = await createProduct();
    const { body } = await request(app)
      .post("/api/v1/order/cod")
      .set("Authorization", token)
      .send({ cart: [{ _id: product._id, qty: 1 }] });

    const asUser = await request(app)
      .put(`/api/v1/order/status/${body.order._id}`)
      .set("Authorization", token)
      .send({ status: "Shipped" });
    assert.equal(asUser.status, 403);

    const { token: adminToken } = await createUser({ role: 1, email: "admin@test.com" });
    const asAdmin = await request(app)
      .put(`/api/v1/order/status/${body.order._id}`)
      .set("Authorization", adminToken)
      .send({ status: "Shipped" });
    assert.equal(asAdmin.status, 200);
    assert.equal(asAdmin.body.order.status, "Shipped");

    const invalid = await request(app)
      .put(`/api/v1/order/status/${body.order._id}`)
      .set("Authorization", adminToken)
      .send({ status: "Teleported" });
    assert.equal(invalid.status, 400);
  });

  // System Design Test 1: Periodic sweeper recovers stock from abandoned checkouts
  it("cleans up abandoned pending orders and restores reserved stock", async () => {
    const product = await createProduct({ quantity: 5 });
    await productModel.updateOne({ _id: product._id }, { $inc: { quantity: -2 } });
    assert.equal(await stockOf(product._id), 3);

    const abandonedTime = new Date(Date.now() - 20 * 60 * 1000);
    const order = await orderModel.create({
      items: [{ product: product._id, name: product.name, price: product.price, qty: 2 }],
      total: product.price * 2,
      payment: { method: "Razorpay", status: "Pending", razorpayOrderId: "order_abandoned123" },
      createdAt: abandonedTime,
    });

    const cleanedCount = await cleanupExpiredPendingOrders(15);
    assert.equal(cleanedCount, 1);
    assert.equal(await stockOf(product._id), 5);

    const found = await orderModel.findById(order._id);
    assert.ok(found);
    assert.equal(found.status, "Cancelled");
    assert.equal(found.payment.status, "Expired");
  });

  // System Design Test 2: Server-to-server webhook payment reconciliation
  it("processes razorpay webhook event and marks order paid", async () => {
    const product = await createProduct();
    const { user } = await createUser({ email: "webhook-buyer@test.com" });

    const order = await orderModel.create({
      items: [{ product: product._id, name: product.name, price: 1000, qty: 1 }],
      total: 1000,
      buyer: user._id,
      payment: { method: "Razorpay", status: "Pending", razorpayOrderId: "order_webhook123" },
    });

    const payload = JSON.stringify({
      event: "order.paid",
      payload: {
        payment: {
          entity: {
            id: "pay_webhook456",
            order_id: "order_webhook123",
          },
        },
      },
    });

    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest("hex");

    const res = await request(app)
      .post("/api/v1/order/webhook")
      .set("x-razorpay-signature", signature)
      .set("Content-Type", "application/json")
      .send(payload);

    assert.equal(res.status, 200);
    const updated = await orderModel.findById(order._id);
    assert.equal(updated.payment.status, "Paid");
    assert.equal(updated.payment.razorpayPaymentId, "pay_webhook456");
  });

  // System Design Test 3: Infrastructure health check endpoint for load balancers
  it("checks system health status endpoint", async () => {
    const res = await request(app).get("/api/v1/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "ok");
    assert.equal(res.body.database, "connected");
  });

  // System Design Test 4: Opossum Circuit Breaker monitoring endpoint
  it("checks payment circuit breaker status", async () => {
    const res = await request(app).get("/api/v1/order/circuit-status");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(typeof res.body.circuit.closed, "boolean");
  });

  // Regression Test 1: Concurrency protection on order cancellation (prevents double stock restore)
  it("prevents double stock restoration when two cancel requests arrive concurrently", async () => {
    const product = await createProduct({ quantity: 5 });
    const { body } = await request(app)
      .post("/api/v1/order/cod")
      .set("Authorization", token)
      .send({ cart: [{ _id: product._id, qty: 2 }] });

    assert.equal(await stockOf(product._id), 3);

    // Fire two cancel requests simultaneously
    const [res1, res2] = await Promise.all([
      request(app).put(`/api/v1/order/cancel/${body.order._id}`).set("Authorization", token),
      request(app).put(`/api/v1/order/cancel/${body.order._id}`).set("Authorization", token),
    ]);

    // Exactly one succeeds with 200, the other is rejected with 409 or 400
    const hasOneSuccess =
      (res1.status === 200 && (res2.status === 400 || res2.status === 409)) ||
      (res2.status === 200 && (res1.status === 400 || res1.status === 409));
    assert.ok(hasOneSuccess, `Expected one 200 and one 400/409, got ${res1.status} and ${res2.status}`);

    // Stock must be restored exactly once (3 + 2 = 5), NEVER doubled to 7
    assert.equal(await stockOf(product._id), 5);
  });

  // Regression Test 2: Duplicate cart items consolidated before reserving stock
  it("consolidates duplicate product entries in the cart into a single stock decrement", async () => {
    const product = await createProduct({ price: 500, quantity: 10 });

    const res = await request(app)
      .post("/api/v1/order/cod")
      .set("Authorization", token)
      .send({
        cart: [
          { _id: product._id, qty: 2 },
          { _id: product._id, qty: 3 },
        ],
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.order.total, 2500); // (2 + 3) * 500
    assert.equal(res.body.order.items.length, 1); // merged into 1 line item
    assert.equal(res.body.order.items[0].qty, 5);
    assert.equal(await stockOf(product._id), 5); // 10 - 5 = 5
  });

  // Regression Test 3: Webhook Idempotency (duplicate delivery handling)
  it("handles duplicate webhook delivery idempotently without errors", async () => {
    const product = await createProduct();
    const { user } = await createUser({ email: "idempotent-buyer@test.com" });

    await orderModel.create({
      items: [{ product: product._id, name: product.name, price: 1000, qty: 1 }],
      total: 1000,
      buyer: user._id,
      payment: { method: "Razorpay", status: "Paid", razorpayOrderId: "order_dup123" },
    });

    const payload = JSON.stringify({
      event: "order.paid",
      payload: {
        payment: { entity: { id: "pay_dup456", order_id: "order_dup123" } },
      },
    });

    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest("hex");

    const res = await request(app)
      .post("/api/v1/order/webhook")
      .set("x-razorpay-signature", signature)
      .set("Content-Type", "application/json")
      .send(payload);

    assert.equal(res.status, 200);
    assert.equal(res.body.status, "ok");
  });

  // Regression Test 4: Concurrency protection on checkout (atomic $inc with $gte prevents overselling)
  it("prevents overselling when two users concurrently purchase the last available item", async () => {
    const product = await createProduct({ name: "Limited Edition", quantity: 1, price: 1000 });
    const { token: user1Token } = await createUser({ email: "buyer1@test.com" });
    const { token: user2Token } = await createUser({ email: "buyer2@test.com" });

    // Both users fire checkout for qty 1 at the exact same millisecond
    const [res1, res2] = await Promise.all([
      request(app)
        .post("/api/v1/order/cod")
        .set("Authorization", user1Token)
        .send({ cart: [{ _id: product._id, qty: 1 }] }),
      request(app)
        .post("/api/v1/order/cod")
        .set("Authorization", user2Token)
        .send({ cart: [{ _id: product._id, qty: 1 }] }),
    ]);

    // Exactly one user gets 201 Created, the other gets 400 Bad Request (insufficient stock)
    const hasOneSuccess =
      (res1.status === 201 && res2.status === 400) ||
      (res2.status === 201 && res1.status === 400);
    assert.ok(hasOneSuccess, `Expected one 201 and one 400, got ${res1.status} and ${res2.status}`);

    // Remaining stock must be exactly 0, NEVER -1
    assert.equal(await stockOf(product._id), 0);
  });

  // Regression Test 5: Late payment webhook on already-refunded expired order
  it("safely handles duplicate late-payment webhook for expired order without double refund", async () => {
    const product = await createProduct();
    const { user } = await createUser({ email: "late-buyer@test.com" });

    // Order was expired and refunded previously
    await orderModel.create({
      items: [{ product: product._id, name: product.name, price: 1000, qty: 1 }],
      total: 1000,
      buyer: user._id,
      status: "Cancelled",
      payment: { method: "Razorpay", status: "Refunded", razorpayOrderId: "order_late123" },
      stockRestored: true,
    });

    const payload = JSON.stringify({
      event: "order.paid",
      payload: {
        payment: { entity: { id: "pay_late456", order_id: "order_late123" } },
      },
    });

    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest("hex");

    const res = await request(app)
      .post("/api/v1/order/webhook")
      .set("x-razorpay-signature", signature)
      .set("Content-Type", "application/json")
      .send(payload);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, "Already refunded");
  });
});
