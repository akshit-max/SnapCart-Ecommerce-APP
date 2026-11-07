import crypto from "crypto";
import Razorpay from "razorpay";
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

  const items = [];
  let total = 0;

  try {
    for (const { _id, qty } of cart) {
      if (!Number.isInteger(qty) || qty < 1) throw badRequest("Invalid quantity");

      // only decrements if enough stock is left, so two buyers can't buy the last item
      const product = await productModel
        .findOneAndUpdate(
          { _id, quantity: { $gte: qty } },
          { $inc: { quantity: -qty } },
          { new: true }
        )
        .select("name price");

      if (!product) {
        const exists = await productModel.findById(_id).select("name");
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

    const razorpayOrder = await getRazorpay().orders.create({
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
    if (order) await restoreStock(order.items);
    res.status(200).send({ success: true });
  } catch (error) {
    sendError(res, error, "Could not cancel order");
  }
};

// Sweeps abandoned pending checkout sessions older than maxAgeMinutes
// Restores inventory so abandoned carts never permanently lock stock
export const cleanupExpiredPendingOrders = async (maxAgeMinutes = 15) => {
  try {
    const cutoff = new Date(Date.now() - maxAgeMinutes * 60 * 1000);
    const expiredOrders = await orderModel.find({
      "payment.method": "Razorpay",
      "payment.status": "Pending",
      createdAt: { $lte: cutoff },
    });

    for (const order of expiredOrders) {
      await restoreStock(order.items);
      await orderModel.findByIdAndDelete(order._id);
    }
    return expiredOrders.length;
  } catch (error) {
    console.error("Error running pending order cleanup:", error);
    return 0;
  }
};

// Razorpay Server-to-Server Webhook handler
// Reconciles payments asynchronously if buyer disconnects or closes tab right after paying
export const razorpayWebhookController = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!secret || !signature) {
      return res.status(400).send({ success: false, message: "Missing webhook secret or signature" });
    }

    const bodyString = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const expected = crypto
      .createHmac("sha256", secret)
      .update(bodyString)
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
      if (order && order.payment.status === "Pending") {
        if (event.event === "order.paid" || event.event === "payment.captured") {
          order.payment.status = "Paid";
          order.payment.razorpayPaymentId = paymentEntity.id;
          await order.save();
        } else if (event.event === "payment.failed") {
          await restoreStock(order.items);
          order.status = "Cancelled";
          await order.save();
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
// refund happens first, so if it fails the order stays as it was
const cancelOrder = async (order) => {
  if (order.payment.method === "Razorpay" && order.payment.status === "Paid") {
    await getRazorpay().payments.refund(order.payment.razorpayPaymentId);
    order.payment.status = "Refunded";
  }
  order.status = "Cancelled";
  await order.save();
  await restoreStock(order.items);
};

//user can cancel an order until the admin starts processing it
export const cancelOrderController = async (req, res) => {
  try {
    const order = await orderModel.findOne({ _id: req.params.orderId, buyer: req.user._id });
    if (!order) return res.status(404).send({ success: false, message: "Order not found" });
    if (order.status !== "Not Processed") {
      return res.status(400).send({ success: false, message: "This order can no longer be cancelled" });
    }

    await cancelOrder(order);
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

    const order = await orderModel.findById(req.params.orderId);
    if (!order) return res.status(404).send({ success: false, message: "Order not found" });

    if (order.status === "Cancelled") {
      return res.status(400).send({ success: false, message: "Cancelled orders can't be changed" });
    }

    if (status === "Cancelled") {
      await cancelOrder(order);
    } else {
      order.status = status;
      await order.save();
    }

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
