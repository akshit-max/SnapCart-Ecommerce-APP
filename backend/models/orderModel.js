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
      status: { type: String, enum: ["Paid", "Pending", "Refunded", "Expired"] },
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
    // timestamp lock to prevent concurrent cancellation races
    cancellingAt: {
      type: Date,
      default: null,
    },
    // ensures inventory is restored to shelves exactly once
    stockRestored: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ============================================================================
// DATABASE INDEXING (Query Performance Optimization)
// 1. Compound Index { buyer: 1, createdAt: -1 }: O(log N) lookup of customer order history.
// 2. Status Index { "payment.status": 1, createdAt: 1 }: B-tree range scan (O(log N)) for the 15-min sweeper.
// ============================================================================
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ "payment.status": 1, createdAt: 1 });

export default mongoose.model("Order", orderSchema);
