import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    // stock left
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

// ============================================================================
// DATABASE INDEXING (Query Performance Optimization)
// 1. Compound Index { category: 1, price: 1 }: Fast category-filtered price sorting.
// 2. Sorting Index { createdAt: -1 }: Fast "newest arrivals" catalog sorting.
// 3. Text Index { name: "text", description: "text" }: Tokenized full-text search.
// ============================================================================
productSchema.index({ category: 1, price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);