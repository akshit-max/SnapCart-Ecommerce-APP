import mongoose from "mongoose";

export const ORDER_STATUS = ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"];

const orderSchema = new mongoose.Schema(
  {
    // name and price are copied at checkout so old orders don't change
    // when a product is edited or deleted later
    items: [
      {
        product: { type: mongoose.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        qty: Number,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    payment: {
      method: { type: String, enum: ["Razorpay", "COD"] },
      status: { type: String, enum: ["Paid", "Pending", "Refunded"] },
      razorpayOrderId: String,
      razorpayPaymentId: String,
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    address: String,
    status: {
      type: String,
      default: "Not Processed",
      enum: ORDER_STATUS,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
