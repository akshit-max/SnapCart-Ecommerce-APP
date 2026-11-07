import crypto from "crypto";
import Razorpay from "razorpay";
import CircuitBreaker from "opossum";
import orderModel, { ORDER_STATUS } from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

// created on first use so the server still starts without razorpay keys (COD keeps working)
let razorpay;
const getRazorpay = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

// ============================================================================
// SYSTEM DESIGN PATTERN: CIRCUIT BREAKER (Fault-Tolerance & Resilience)
// Problem: If Razorpay API experiences latency or downtime, checkout requests
//          pile up and hang the server event loop.
// Solution: Opossum Circuit Breaker tracks gateway health:
//   - CLOSED (Normal): Requests go through to Razorpay.
//   - OPEN (Tripped): If 50% fail or timeout (>5s), trips open. Fails fast & prompts COD.
//   - HALF-OPEN (Testing): After 10s reset timeout, lets one request test if gateway recovered.
// ============================================================================
const circuitOptions = {
  timeout: 5000, // 5s timeout on external gateway
  errorThresholdPercentage: 50, // trip circuit if 50% of requests fail
  resetTimeout: 10000, // wait 10s before probing gateway (half-open)
};

const callRazorpayCreate = async (payload) => getRazorpay().orders.create(payload);

export const paymentBreaker = new CircuitBreaker(callRazorpayCreate, circuitOptions);

// Graceful fallback when payment gateway is down - shields users from waiting on broken gateway
paymentBreaker.fallback(() => {
  const err = new Error("Online payment is temporarily unavailable. Please choose Cash on Delivery.");
  err.status = 503;
  throw err;
});

// Exposes circuit health state for monitoring dashboards and automated frontend degradation
export const circuitStatusController = (req, res) => {
  res.status(200).send({
    success: true,
    circuit: {
      closed: paymentBreaker.closed,
      opened: paymentBreaker.opened,
      halfOpen: paymentBreaker.halfOpen,
      stats: paymentBreaker.stats,
    },
  });
};

const badRequest = (message) => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

const restoreStock = async (items) => {
  for (const item of items) {
    await productModel.updateOne({ _id: item.product }, { $inc: { quantity: item.qty } });
  }
};

// Takes the cart from the client ([{ _id, qty }]), looks up real prices in the db
// and takes the items out of stock. If anything is out of stock, whatever was
// already taken is put back and an error is thrown.
const reserveStock = async (cart) => {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw badRequest("Cart is empty");
  }

  // merge duplicate product entries from the client to check stock accurately
  const qtyMap = new Map();
  for (const item of cart) {
    if (!item?._id || !Number.isInteger(item.qty) || item.qty < 1) {
      throw badRequest("Invalid quantity");
    }
    const id = String(item._id);
    qtyMap.set(id, (qtyMap.get(id) || 0) + item.qty);
  }

  const items = [];
  let total = 0;

  try {
    for (const [productId, qty] of qtyMap) {
      // only decrements if enough stock is left, so two buyers can't buy the last item
      const product = await productModel
        .findOneAndUpdate(
          { _id: productId, quantity: { $gte: qty } },
          { $inc: { quantity: -qty } },
          { new: true }
        )
        .select("name price");

      if (!product) {
        const exists = await productModel.findById(productId).select("name");
        throw badRequest(
          exists ? `Only limited stock left for ${exists.name}` : "A product in your cart no longer exists"
        );
      }

      items.push({ product: product._id, name: product.name, price: product.price, qty });
      total += product.price * qty;
    }
  } catch (error) {
    await restoreStock(items);
    throw error;
  }

  return { items, total: Math.round(total * 100) / 100 };
};

const createOrder = async (userId, items, total, payment) => {
  const user = await userModel.findById(userId).select("address");
  return new orderModel({ items, total, payment, buyer: userId, address: user?.address }).save();
};

// errors thrown by reserveStock have a status and a message that is safe to show
const sendError = (res, error, fallback) => {
  if (!error.status) console.log(error);
  res.status(error.status || 500).send({ success: false, message: error.status ? error.message : fallback });
};

//cash on delivery
export const codOrderController = async (req, res) => {
  try {
    const { items, total } = await reserveStock(req.body.cart);
    const order = await createOrder(req.user._id, items, total, {
      method: "COD",
      status: "Pending",
    });
    res.status(201).send({ success: true, message: "Order placed", order });
  } catch (error) {
    sendError(res, error, "Could not place order");
  }
};

// Online payment, step 1: reserve stock, save the order as "payment pending"
// and create a matching order on razorpay. The client opens the checkout popup with it.
export const createRazorpayOrderController = async (req, res) => {
  let items;
  try {
    const reserved = await reserveStock(req.body.cart);
    items = reserved.items;

    const razorpayOrder = await paymentBreaker.fire({
      amount: Math.round(reserved.total * 100), // razorpay wants paise
      currency: "INR",
    });

    const order = await createOrder(req.user._id, items, reserved.total, {
      method: "Razorpay",
      status: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    res.status(201).send({
      success: true,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    // razorpay failed after stock was taken, give it back
    if (items && !error.status) await restoreStock(items);
    sendError(res, error, "Online payment is unavailable right now");
  }
};

// Online payment, step 2: razorpay sends back a signature after payment.
// We recreate it with our secret key, if both match the payment is genuine.
export const verifyRazorpayPaymentController = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await orderModel.findOne({ _id: orderId, buyer: req.user._id });
    if (!order || order.payment.razorpayOrderId !== razorpay_order_id) {
      return res.status(404).send({ success: false, message: "Order not found" });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid =
      typeof razorpay_signature === "string" &&
      expected.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));

    if (!isValid) {
      return res.status(400).send({ success: false, message: "Payment verification failed" });
    }

    order.payment.status = "Paid";
    order.payment.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    res.status(200).send({ success: true, message: "Payment successful", order });
  } catch (error) {
    sendError(res, error, "Payment verification failed");
  }
};

// user closed the razorpay popup without paying: remove the pending order, return the stock
export const cancelRazorpayOrderController = async (req, res) => {
  try {
    const order = await orderModel.findOneAndDelete({
      _id: req.params.orderId,
      buyer: req.user._id,
      "payment.method": "Razorpay",
      "payment.status": "Pending",
    });
    if (order && !order.stockRestored) await restoreStock(order.items);
    res.status(200).send({ success: true });
  } catch (error) {
    sendError(res, error, "Could not cancel order");
  }
};

// ============================================================================
// SYSTEM DESIGN PATTERN: RECONCILIATION SWEEPER (Zombie Inventory Recovery)
// Problem: If a buyer begins online payment but closes the tab or loses internet,
//          the reserved stock remains decremented in a "Pending" order forever.
// Solution: Periodic background sweeper detects orders older than 15 minutes that
//          are still "Pending", returns reserved inventory, and marks the order Expired.
//          We preserve the document for financial auditing and late payment handling.
// ============================================================================
export const cleanupExpiredPendingOrders = async (maxAgeMinutes = 15) => {
  try {
    const cutoff = new Date(Date.now() - maxAgeMinutes * 60 * 1000);
    const expiredOrders = await orderModel.find({
      "payment.method": "Razorpay",
      "payment.status": "Pending",
      status: { $ne: "Cancelled" },
      createdAt: { $lte: cutoff },
    });

    for (const order of expiredOrders) {
      if (!order.stockRestored) {
        await restoreStock(order.items);
        order.stockRestored = true;
      }
      order.status = "Cancelled";
      order.payment.status = "Expired";
      await order.save();
    }
    return expiredOrders.length;
  } catch (error) {
    console.error("Error running pending order cleanup:", error);
    return 0;
  }
};

// ============================================================================
// SYSTEM DESIGN PATTERN: SERVER-TO-SERVER WEBHOOK (Zero-Loss Payment Sync)
// Problem: Client-side payment callbacks fail if user closes browser, loses mobile
//          network, or battery dies right after entering their UPI PIN.
// Solution: Razorpay sends an asynchronous server-to-server POST event.
//          We verify its HMAC-SHA256 signature using the raw payload buffer to prevent
//          JSON re-serialization key-order mismatches, then update or refund safely.
// ============================================================================
export const razorpayWebhookController = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!secret || !signature) {
      return res.status(400).send({ success: false, message: "Missing webhook secret or signature" });
    }

    // Verify against the raw buffer captured by express.json verify hook
    const rawPayload = req.rawBody || (typeof req.body === "string" ? req.body : JSON.stringify(req.body));
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawPayload)
      .digest("hex");

    const isValid =
      typeof signature === "string" &&
      expected.length === signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

    if (!isValid) {
      return res.status(400).send({ success: false, message: "Invalid webhook signature" });
    }

    const event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const paymentEntity = event.payload?.payment?.entity;
    const razorpayOrderId = paymentEntity?.order_id;

    if (razorpayOrderId) {
      const order = await orderModel.findOne({ "payment.razorpayOrderId": razorpayOrderId });
      if (order) {
        // Idempotency: Ignore duplicate webhook deliveries if already marked paid
        if (order.payment.status === "Paid") {
          return res.status(200).send({ status: "ok", message: "Already processed" });
        }

        // Late payment arriving after order was expired by the background sweeper
        if (order.payment.status === "Expired" || order.status === "Cancelled") {
          if (event.event === "order.paid" || event.event === "payment.captured") {
            // Guard: If already refunded, do not attempt second refund
            if (order.payment.status === "Refunded") {
              return res.status(200).send({ status: "ok", message: "Already refunded" });
            }
            try {
              await getRazorpay().payments.refund(paymentEntity.id);
              order.payment.status = "Refunded";
              order.payment.razorpayPaymentId = paymentEntity.id;
              await order.save();
            } catch (refundErr) {
              const msg = refundErr?.error?.description || refundErr?.message || "";
              if (msg.toLowerCase().includes("already") && msg.toLowerCase().includes("refund")) {
                order.payment.status = "Refunded";
                await order.save();
                return res.status(200).send({ status: "ok", message: "Already refunded on gateway" });
              }
              console.error("Failed to auto-refund expired late payment:", refundErr);
              return res.status(500).send({ success: false, message: "Refund processing failed, will retry" });
            }
          }
          return res.status(200).send({ status: "ok", message: "Late payment handled" });
        }

        if (order.payment.status === "Pending") {
          if (event.event === "order.paid" || event.event === "payment.captured") {
            order.payment.status = "Paid";
            order.payment.razorpayPaymentId = paymentEntity.id;
            await order.save();
          } else if (event.event === "payment.failed") {
            if (!order.stockRestored) {
              await restoreStock(order.items);
              order.stockRestored = true;
            }
            order.status = "Cancelled";
            await order.save();
          }
        }
      }
    }

    res.status(200).send({ status: "ok" });
  } catch (error) {
    console.error("Error in webhook handler:", error);
    res.status(500).send({ success: false, message: "Webhook error" });
  }
};

//orders of logged in user
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    res.status(200).send({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while getting orders" });
  }
};

// used by both user and admin cancel: refunds online payments and puts items back in stock.
// if refund fails, the lock is cleared so the order stays uncancelled and can be safely retried
const processOrderCancellation = async (order) => {
  try {
    if (order.payment.method === "Razorpay" && order.payment.status === "Paid") {
      try {
        await getRazorpay().payments.refund(order.payment.razorpayPaymentId);
        order.payment.status = "Refunded";
      } catch (refundErr) {
        // If gateway confirms payment was already refunded earlier, accept it and proceed
        const msg = refundErr?.error?.description || refundErr?.message || "";
        if (msg.toLowerCase().includes("already") && msg.toLowerCase().includes("refund")) {
          order.payment.status = "Refunded";
        } else {
          throw refundErr;
        }
      }
    }
    order.status = "Cancelled";
    order.cancellingAt = null;
    if (!order.stockRestored) {
      await restoreStock(order.items);
      order.stockRestored = true;
    }
    await order.save();
    return order;
  } catch (error) {
    // release lock so customer or admin can retry without being locked out
    await orderModel.updateOne({ _id: order._id }, { $set: { cancellingAt: null } });
    throw error;
  }
};

// user can cancel an order until the admin starts processing it
export const cancelOrderController = async (req, res) => {
  try {
    const lockCutoff = new Date(Date.now() - 60 * 1000); // 1-minute lock timeout

    // atomically claim cancellation to prevent two concurrent requests from double-restoring stock
    const order = await orderModel.findOneAndUpdate(
      {
        _id: req.params.orderId,
        buyer: req.user._id,
        status: "Not Processed",
        $or: [{ cancellingAt: null }, { cancellingAt: { $lt: lockCutoff } }],
      },
      { $set: { cancellingAt: new Date() } },
      { new: true }
    );

    if (!order) {
      const existing = await orderModel.findOne({ _id: req.params.orderId, buyer: req.user._id });
      if (!existing) return res.status(404).send({ success: false, message: "Order not found" });
      if (existing.status !== "Not Processed") {
        return res.status(400).send({ success: false, message: "This order can no longer be cancelled" });
      }
      return res.status(409).send({ success: false, message: "Cancellation already in progress" });
    }

    await processOrderCancellation(order);
    res.status(200).send({ success: true, message: "Order cancelled", order });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while cancelling order" });
  }
};

//all orders (admin)
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while getting orders" });
  }
};

//update order status (admin)
export const orderStatusController = async (req, res) => {
  try {
    const { status } = req.body;
    if (!ORDER_STATUS.includes(status)) {
      return res.status(400).send({ success: false, message: "Invalid status" });
    }

    if (status === "Cancelled") {
      const lockCutoff = new Date(Date.now() - 60 * 1000);
      const order = await orderModel.findOneAndUpdate(
        {
          _id: req.params.orderId,
          status: { $ne: "Cancelled" },
          $or: [{ cancellingAt: null }, { cancellingAt: { $lt: lockCutoff } }],
        },
        { $set: { cancellingAt: new Date() } },
        { new: true }
      );

      if (!order) {
        const existing = await orderModel.findById(req.params.orderId);
        if (!existing) return res.status(404).send({ success: false, message: "Order not found" });
        if (existing.status === "Cancelled") {
          return res.status(400).send({ success: false, message: "Cancelled orders can't be changed" });
        }
        return res.status(409).send({ success: false, message: "Cancellation already in progress" });
      }

      await processOrderCancellation(order);
      return res.status(200).send({ success: true, message: "Order status updated", order });
    }

    const order = await orderModel.findById(req.params.orderId);
    if (!order) return res.status(404).send({ success: false, message: "Order not found" });

    if (order.status === "Cancelled") {
      return res.status(400).send({ success: false, message: "Cancelled orders can't be changed" });
    }

    order.status = status;
    await order.save();

    res.status(200).send({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while updating order" });
  }
};

//numbers for the admin dashboard
export const orderStatsController = async (req, res) => {
  try {
    const [products, users, orders, revenue] = await Promise.all([
      productModel.countDocuments(),
      userModel.countDocuments(),
      orderModel.countDocuments(),
      orderModel.aggregate([
        // count paid online orders and cash on delivery, skip cancelled and unpaid ones
        {
          $match: {
            status: { $ne: "Cancelled" },
            $or: [{ "payment.status": "Paid" }, { "payment.method": "COD" }],
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    const lowStock = await productModel
      .find({ quantity: { $lte: 5 } })
      .select("name slug quantity")
      .sort({ quantity: 1 })
      .limit(5);

    res.status(200).send({
      success: true,
      stats: { products, users, orders, revenue: revenue[0]?.total || 0 },
      lowStock,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while getting stats" });
  }
};
