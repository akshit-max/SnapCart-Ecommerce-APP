import { v2 as cloudinary } from "cloudinary";

// ============================================================================
// SYSTEM DESIGN PATTERN: CLOUD OBJECT STORAGE & CDN ASSET DELIVERY
// Architecture:
//   1. Offloads binary image payload from MongoDB RAM (WiredTiger cache)
//      and Node.js event loop to Cloudinary's global Content Delivery Network (CDN).
//   2. Auto-optimization: automatically converts images to modern WebP/AVIF
//      formats and applies lossy compression to minimize transfer bandwidth.
//   3. Resilient Fallback: If Cloudinary credentials are not configured
//      (e.g., in unit tests or offline environments), gracefully falls back
//      to MongoDB Buffer storage.
// ============================================================================

export const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

// Configures Cloudinary dynamically on first use to ensure dotenv has finished loading
const ensureConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

/**
 * Uploads a local temporary file to Cloudinary.
 * @param {string} filePath - Path to temporary file created by formidable
 * @param {string} folder - Target folder in Cloudinary
 * @returns {Promise<{ url: string, public_id: string }>}
 */
export const uploadImageToCloudinary = async (filePath, folder = "snapcart/products") => {
  ensureConfig();
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
    transformation: [
      { quality: "auto", fetch_format: "auto" }, // Deliver modern WebP/AVIF with optimal compression
    ],
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

/**
 * Deletes an existing image from Cloudinary by its public_id.
 * Prevents orphaned assets when products are updated or deleted.
 * @param {string} publicId - Cloudinary asset public_id
 */
export const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    ensureConfig();
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary deletion error:", err.message);
  }
};

export default cloudinary;
