import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "../helpers/cloudinaryHelper.js";
import { clearCachePattern } from "../helpers/cacheHelper.js";
import fs from "fs";
import os from "os";

// ============================================================================
// DATA MIGRATION SCRIPT: MONGODB BUFFER -> CLOUDINARY CDN
// Purpose:
//   Migrates legacy product images stored as binary buffers in MongoDB
//   to Cloudinary CDN, saving database storage and speeding up asset delivery.
// Usage:
//   node backend/scripts/migrateImagesToCloudinary.js
// ============================================================================

async function migrate() {
  if (!isCloudinaryConfigured()) {
    console.error("Cloudinary credentials are not set in backend/.env!");
    process.exit(1);
  }

  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected successfully.\n");

  const products = await productModel.find({
    "photo.data": { $exists: true, $ne: null },
    $or: [{ "photo.url": { $exists: false } }, { "photo.url": "" }],
  });

  console.log(`Found ${products.length} products with legacy binary buffer images.`);

  if (products.length === 0) {
    console.log("All products already have Cloudinary CDN URLs! Nothing to migrate.");
    await mongoose.disconnect();
    return;
  }

  let migratedCount = 0;

  for (const product of products) {
    try {
      console.log(`Migrating "${product.name}" (ID: ${product._id})...`);

      const ext = product.photo.contentType?.split("/")[1] || "jpeg";
      const tempPath = path.join(os.tmpdir(), `migrate_${product._id}.${ext}`);

      fs.writeFileSync(tempPath, product.photo.data);

      const { url, public_id } = await uploadImageToCloudinary(tempPath);

      product.photo.url = url;
      product.photo.public_id = public_id;
      product.photo.data = undefined;
      product.photo.contentType = undefined;

      await product.save();
      fs.unlinkSync(tempPath);

      console.log(`  -> Successfully uploaded to: ${url}`);
      migratedCount++;
    } catch (err) {
      console.error(`  -> Failed to migrate product ${product._id}:`, err.message);
    }
  }

  await clearCachePattern("product");
  console.log(`\nMigration complete! Successfully migrated ${migratedCount}/${products.length} products.`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
