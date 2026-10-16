import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import request from "supertest";
import { connectTestDb, closeTestDb, clearTestDb, createUser, createProduct } from "./setup.js";
import app from "../app.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

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
});
