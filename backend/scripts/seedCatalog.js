import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

// Use public DNS to resolve MongoDB Atlas SRV on Node 24
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import { uploadImageToCloudinary } from "../helpers/cloudinaryHelper.js";
import { clearCachePattern } from "../helpers/cacheHelper.js";

// ============================================================================
// COMPREHENSIVE E-COMMERCE SEEDER
// Populates modern categories and high-definition products with Cloudinary CDN
// ============================================================================

const CATEGORIES_DATA = [
  { name: "Electronics & Gadgets", slug: "electronics" },
  { name: "Footwear & Sneakers", slug: "footwear" },
  { name: "Men's Fashion", slug: "mens-collection" },
  { name: "Women's Fashion", slug: "women-collection" },
  { name: "Accessories & Watches", slug: "accessories" },
  { name: "Kids & Teens", slug: "kids-collection" },
  { name: "Home & Living", slug: "home-living" },
];

const PRODUCTS_DATA = [
  // --- Electronics & Gadgets ---
  {
    name: "Sony WH-1000XM5 Noise Cancelling Headphones",
    categorySlug: "electronics",
    price: 26990,
    quantity: 18,
    shipping: true,
    description: "Industry-leading noise canceling with two processors and eight microphones. Exceptional sound quality with Hi-Res Audio wireless, 30-hour battery life, and ultra-comfortable lightweight design.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  },
  {
    name: "Apple Watch Series 9 GPS 45mm",
    categorySlug: "electronics",
    price: 41900,
    quantity: 12,
    shipping: true,
    description: "S9 SiP chip with magical Double Tap gesture. Brighter edge-to-edge Always-On Retina display, advanced health and fitness sensors, and carbon neutral case combinations.",
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
  },
  {
    name: "Keychron K2 Pro Wireless Mechanical Keyboard",
    categorySlug: "electronics",
    price: 8499,
    quantity: 25,
    shipping: true,
    description: "QMK/VIA wireless custom mechanical keyboard with hot-swappable switches, sound-absorbing foam, double-shot PBT keycaps, and seamless Bluetooth 5.1 / Type-C connectivity.",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
  },
  {
    name: "Marshall Emberton II Portable Bluetooth Speaker",
    categorySlug: "electronics",
    price: 14999,
    quantity: 15,
    shipping: true,
    description: "Iconic Marshall heavy sound with 30+ hours of portable playtime. IP67 dust and water resistance, multi-directional 360-degree True Stereophonic audio, and Stack Mode pairing.",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
  },
  {
    name: "Logitech MX Master 3S Wireless Performance Mouse",
    categorySlug: "electronics",
    price: 8995,
    quantity: 30,
    shipping: true,
    description: "Quiet Click technology with 8,000 DPI track-on-glass optical sensor. MagSpeed electromagnetic scrolling wheel that scrolls 1,000 lines per second with ergonomic thumb rest.",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
  },

  // --- Footwear & Sneakers ---
  {
    name: "Nike Air Jordan 1 Retro High OG",
    categorySlug: "footwear",
    price: 16995,
    quantity: 8,
    shipping: true,
    description: "Timeless basketball silhouette crafted with premium tumbled leather uppers, encapsulated Air-Sole cushioning in the heel, and the iconic Wings logo on the collar.",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
  },
  {
    name: "Adidas Ultraboost Light Running Shoes",
    categorySlug: "footwear",
    price: 11999,
    quantity: 22,
    shipping: true,
    description: "Experience epic energy return with Light BOOST cushioning — 30% lighter than standard Boost. PRIMEKNIT+ textile upper hugs your foot for supportive flexibility over long miles.",
    imageUrl: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80",
  },
  {
    name: "Classic Chelsea Leather Boots (Tobacco Tan)",
    categorySlug: "footwear",
    price: 5499,
    quantity: 14,
    shipping: true,
    description: "Handcrafted full-grain calfskin leather Chelsea boots with Goodyear welted construction, durable non-slip rubber outsoles, and flexible elastic side gores for effortless wear.",
    imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80",
  },
  {
    name: "New Balance 574 Core Heritage Sneakers",
    categorySlug: "footwear",
    price: 7999,
    quantity: 20,
    shipping: true,
    description: "The most iconic New Balance silhouette. Suede and mesh upper with ENCAP midsole cushioning combining lightweight foam with a durable polyurethane rim for all-day comfort.",
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
  },

  // --- Accessories & Watches ---
  {
    name: "Fossil Grant Chronograph Roman Leather Watch",
    categorySlug: "accessories",
    price: 8495,
    quantity: 16,
    shipping: true,
    description: "Vintage-inspired chronograph dial with Roman numeral indices, 44mm stainless steel casing, mineral crystal face, and interchangeable genuine dark brown leather strap.",
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
  },
  {
    name: "Ray-Ban Aviator Classic Polarized Sunglasses",
    categorySlug: "accessories",
    price: 9290,
    quantity: 24,
    shipping: true,
    description: "Originally designed for U.S. aviators in 1937. Iconic teardrop frame with gold-tone metal, crystal green G-15 polarized lenses providing 100% UV protection and glare elimination.",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
  },
  {
    name: "Bellroy Slim Leather Bi-Fold Wallet",
    categorySlug: "accessories",
    price: 3899,
    quantity: 35,
    shipping: true,
    description: "Super slim profile that holds 4-11 cards and flat banknotes without bulk. Crafted from environmentally certified top-grain leather with quick-access card slots and RFID protection.",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
  },
  {
    name: "Nordace Siena Ergonomic Smart Travel Backpack",
    categorySlug: "accessories",
    price: 4999,
    quantity: 18,
    shipping: true,
    description: "Water-resistant smart backpack featuring a 15.6-inch padded laptop compartment, integrated USB charging port, hidden anti-theft passport pocket, and contoured lumbar support.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  },

  // --- Men's Fashion ---
  {
    name: "Oxford Tailored Slim-Fit Cotton Shirt",
    categorySlug: "mens-collection",
    price: 2199,
    quantity: 40,
    shipping: true,
    description: "100% two-ply long-staple combed cotton woven in a classic basketweave Oxford finish. Features a structured button-down collar, mother-of-pearl buttons, and tailored silhouette.",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
  },
  {
    name: "Raw Selvage Heavyweight Denim Jacket",
    categorySlug: "mens-collection",
    price: 3799,
    quantity: 15,
    shipping: true,
    description: "14oz Japanese shuttle-loom selvage denim with red-line ticker. Unwashed raw indigo that naturally develops unique personal fades over years of authentic wear.",
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
  },
  {
    name: "Merino Wool Blend Crewneck Sweater",
    categorySlug: "mens-collection",
    price: 2899,
    quantity: 25,
    shipping: true,
    description: "Ultra-fine Australian Merino wool spun with lightweight fibers for temperature regulation. Naturally breathable, anti-odor, and exceptionally soft against skin without itchiness.",
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
  },

  // --- Women's Fashion ---
  {
    name: "Boho Floral Print Tiered Midi Dress",
    categorySlug: "women-collection",
    price: 2499,
    quantity: 20,
    shipping: true,
    description: "Flowing rayon crepe midi dress with hand-drawn botanical print. Smocked bodice with puffed elbow sleeves and a tiered A-line skirt designed for graceful movement.",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
  },
  {
    name: "Oversized Classic Wool Trench Coat (Camel)",
    categorySlug: "women-collection",
    price: 5999,
    quantity: 10,
    shipping: true,
    description: "Sophisticated double-breasted coat with storm flap, wide lapels, and detachable tie belt. Fully lined with satin twill for seamless layering through autumn and winter.",
    imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80",
  },
  {
    name: "Structured Vegan Leather Shoulder Handbag",
    categorySlug: "women-collection",
    price: 3499,
    quantity: 18,
    shipping: true,
    description: "Architectural silhouette made from premium cruelty-free pebbled vegan leather. Polished gold-tone hardware, central zipped partition, and detachable crossbody strap.",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
  },

  // --- Home & Living ---
  {
    name: "Artisan Handcrafted Ceramic Pour-Over Coffee Set",
    categorySlug: "home-living",
    price: 1499,
    quantity: 30,
    shipping: true,
    description: "Wheel-thrown speckled stoneware ceramic dripper and server pitcher with matte glaze. Engineered spiral ridges optimize water flow for barista-quality pour-over extraction.",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
  },
  {
    name: "Nordic Minimalist Dimmable LED Desk Lamp",
    categorySlug: "home-living",
    price: 2299,
    quantity: 22,
    shipping: true,
    description: "Sleek matte aluminum alloy build with 360-degree adjustable gooseneck. Touch-sensitive slider for stepless brightness dimming and 3 color temperatures (warm, natural, cool).",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
  },
  {
    name: "Soy Wax Aromatherapy Scented Candle (Amber & Moss)",
    categorySlug: "home-living",
    price: 899,
    quantity: 50,
    shipping: true,
    description: "100% natural American-grown soy wax poured in an amber apothecary jar with lead-free cotton wick. Notes of earthy oakmoss, warm amber, and fresh sage. 50-hour clean burn time.",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80",
  },
];

async function seed() {
  console.log("=================================================");
  console.log("   SnapCart Catalog Expansion & Seeder");
  console.log("=================================================\n");

  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB successfully.\n");

  // 1. Upsert Categories
  console.log("--- 1. Syncing Categories ---");
  const categoryMap = new Map();

  for (const cat of CATEGORIES_DATA) {
    let existing = await categoryModel.findOne({
      $or: [{ slug: cat.slug }, { name: { $regex: new RegExp(`^${cat.name}$`, "i") } }],
    });

    if (!existing) {
      existing = await categoryModel.create({
        name: cat.name,
        slug: cat.slug,
      });
      console.log(`+ Created category: "${cat.name}"`);
    } else {
      console.log(`✓ Existing category: "${existing.name}" (ID: ${existing._id})`);
    }

    categoryMap.set(cat.slug, existing._id);
  }

  // Also map existing collections if slightly different slugs exist
  const allCats = await categoryModel.find({});
  for (const c of allCats) {
    if (!categoryMap.has(c.slug)) {
      categoryMap.set(c.slug, c._id);
    }
  }

  console.log("\n--- 2. Seeding High-Definition Products to Cloudinary ---");
  let createdCount = 0;
  let skippedCount = 0;

  for (const item of PRODUCTS_DATA) {
    const slug = slugify(item.name, { lower: true, strict: true });
    const existing = await productModel.findOne({ slug });

    if (existing) {
      console.log(`- Skipping "${item.name}" (already exists)`);
      skippedCount++;
      continue;
    }

    const categoryId = categoryMap.get(item.categorySlug);
    if (!categoryId) {
      console.error(`! Error: Could not find category ID for slug "${item.categorySlug}"`);
      continue;
    }

    console.log(`\nUploading image for "${item.name}" to Cloudinary...`);
    try {
      const uploadRes = await uploadImageToCloudinary(item.imageUrl, "snapcart/products");
      console.log(`  -> Cloudinary CDN URL: ${uploadRes.url}`);

      const newProduct = await productModel.create({
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

      console.log(`  ✓ Saved product "${newProduct.name}" (ID: ${newProduct._id})`);
      createdCount++;
    } catch (uploadErr) {
      console.error(`  ! Upload failed for "${item.name}":`, uploadErr.message);
    }
  }

  console.log("\n--- 3. Invalidate Catalog Cache ---");
  await clearCachePattern("product");
  console.log("✓ Catalog cache purged.");

  console.log("\n=================================================");
  console.log(`Seeding summary: ${createdCount} created, ${skippedCount} existing.`);
  console.log("=================================================");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});

