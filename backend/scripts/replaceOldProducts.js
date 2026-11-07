import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "../helpers/cloudinaryHelper.js";
import { clearCachePattern } from "../helpers/cacheHelper.js";

// The 10 old low-quality products to remove
const OLD_PRODUCT_NAMES = [
  "Urban Edge Men's Casual Look",
  "Vintage Street Style Set",
  "Denim Shirts",
  "Navy Elite Men's Formal Suit Set",
  "Palm Avenue Chic Set",
  "Sunlit Linen Set",
  "Galaxy Explorer Hoodie Set",
  "Mini Skater Style Set",
  "City Stroll Statement Look",
  "Playful Pastel Denim Set",
];

// 10 new high-fashion, studio-quality clothing products
const NEW_CLOTHING_PRODUCTS = [
  {
    name: "Italian Wool Tailored Blazer (Charcoal)",
    categorySlug: "mens-collection",
    price: 7999,
    quantity: 14,
    shipping: true,
    description: "Impeccably tailored from 100% Italian Super 120s virgin wool. Features notch lapels, pick-stitch detailing, double back vents, and premium cupro interior lining for executive polish.",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
  },
  {
    name: "Relaxed French Terry Pullover Hoodie (Oatmeal)",
    categorySlug: "mens-collection",
    price: 2999,
    quantity: 28,
    shipping: true,
    description: "450gsm heavyweight combed French terry cotton. Drop-shoulder relaxed streetwear drape with double-lined hood, kangaroo pocket, and pre-shrunk ribbed cuffs.",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
  },
  {
    name: "Selvage Japanese Denim Trucker Jacket",
    categorySlug: "mens-collection",
    price: 4499,
    quantity: 18,
    shipping: true,
    description: "Crafted on heritage shuttle looms using 13.5oz ring-spun Japanese denim. Features custom brass hardware, dual chest flap pockets, and waist adjusters.",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
  },
  {
    name: "Pure Mulberry Silk Button-Down Shirt",
    categorySlug: "women-collection",
    price: 3999,
    quantity: 20,
    shipping: true,
    description: "100% 19-momme grade 6A Mulberry silk with a subtle lustrous sheen. Mother-of-pearl buttons, curved hemline, and breathable hypoallergenic drape.",
    imageUrl: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&q=80",
  },
  {
    name: "Cashmere Knit Turtleneck Sweater (Cream)",
    categorySlug: "women-collection",
    price: 4999,
    quantity: 16,
    shipping: true,
    description: "100% Grade-A Mongolian cashmere with featherweight softness. Ribbed folded turtleneck, raglan sleeves, and exceptional thermal insulation without bulk.",
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
  },
  {
    name: "Classic Double-Breasted Belted Trench Coat",
    categorySlug: "women-collection",
    price: 6499,
    quantity: 12,
    shipping: true,
    description: "Water-resistant cotton-gabardine trench featuring a detachable storm collar, horn buttons, waist buckle belt, and vintage epaulettes for timeless elegance.",
    imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce667883?w=800&q=80",
  },
  {
    name: "High-Waisted Tailored Pleated Trousers",
    categorySlug: "women-collection",
    price: 2299,
    quantity: 32,
    shipping: true,
    description: "Fluid silhouette with double front pleats, slash pockets, and an extended tab waistband. Wrinkle-resistant poly-viscose blend perfect for office to evening wear.",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
  },
  {
    name: "Kids Organic Cotton Colourblock Sweatshirt",
    categorySlug: "kids-collection",
    price: 1499,
    quantity: 25,
    shipping: true,
    description: "GOTS-certified 100% organic cotton fleece with brushed interior. Playful contemporary colourblock aesthetic with stretchy neckband for easy dressing.",
    imageUrl: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80",
  },
  {
    name: "Kids Classic Denim Overalls & Striped Tee Set",
    categorySlug: "kids-collection",
    price: 1899,
    quantity: 20,
    shipping: true,
    description: "Durable washed cotton denim dungarees with adjustable buckles and side brass buttons, paired with a soft breathable nautical striped cotton crewneck tee.",
    imageUrl: "https://images.unsplash.com/photo-1503944571-89a19859f77f?w=800&q=80",
  },
  {
    name: "Linen Resort Camp-Collar Vacation Shirt",
    categorySlug: "mens-collection",
    price: 2499,
    quantity: 35,
    shipping: true,
    description: "100% French flax linen garment-washed for relaxed softness. Retro camp open collar, straight hem with side vents, and breathable airy comfort for warm weather.",
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
  },
];

async function replace() {
  console.log("=================================================");
  console.log("   Replacing Old Low-Quality Products with Studio Fashion");
  console.log("=================================================\n");

  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB Atlas.\n");

  // 1. Remove old products and clean up Cloudinary assets
  console.log("--- 1. Removing 10 Old Low-Quality Products ---");
  for (const oldName of OLD_PRODUCT_NAMES) {
    const found = await productModel.findOne({ name: oldName });
    if (found) {
      if (found.photo?.public_id) {
        await deleteImageFromCloudinary(found.photo.public_id);
      }
      await productModel.findByIdAndDelete(found._id);
      console.log(`✓ Removed old product: "${oldName}" (ID: ${found._id})`);
    } else {
      console.log(`- Not found (already removed): "${oldName}"`);
    }
  }

  // 2. Fetch category map
  const categories = await categoryModel.find({});
  const categoryMap = new Map();
  for (const c of categories) {
    categoryMap.set(c.slug, c._id);
  }

  // 3. Upload and save the 10 new high-fashion products
  console.log("\n--- 2. Uploading 10 New Studio-Quality Fashion Products to Cloudinary ---");
  let added = 0;
  for (const item of NEW_CLOTHING_PRODUCTS) {
    const slug = slugify(item.name, { lower: true, strict: true });
    let existing = await productModel.findOne({ slug });
    if (existing) {
      console.log(`- Skipping "${item.name}" (already exists)`);
      continue;
    }

    const categoryId = categoryMap.get(item.categorySlug);
    if (!categoryId) {
      console.error(`! Could not find category for slug "${item.categorySlug}"`);
      continue;
    }

    console.log(`Uploading "${item.name}" to Cloudinary...`);
    try {
      const uploadRes = await uploadImageToCloudinary(item.imageUrl, "snapcart/products");
      const created = await productModel.create({
        name: item.name,
        slug,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        shipping: item.shipping,
        category: categoryId,
        photo: {
          url: uploadRes.url,
          public_id: uploadRes.public_id,
        },
      });
      console.log(`  ✓ Created "${created.name}" (ID: ${created._id})`);
      added++;
    } catch (err) {
      console.error(`  ! Failed to upload "${item.name}":`, err.message);
    }
  }

  // 4. Invalidate cache
  await clearCachePattern("product");
  console.log("\n✓ Catalog cache invalidated.");
  console.log(`\nReplacement complete! Added ${added} new high-end fashion products.`);
  await mongoose.disconnect();
}

replace().catch((err) => {
  console.error("Replacement script failed:", err);
  process.exit(1);
});

