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
import { uploadImageToCloudinary } from "../helpers/cloudinaryHelper.js";
import { clearCachePattern } from "../helpers/cacheHelper.js";

const NEW_CATEGORIES = [
  { name: "Fragrance & Grooming", slug: "fragrance" },
  { name: "Eyewear & Sunglasses", slug: "eyewear" },
  { name: "Travel & Luggage", slug: "travel-luggage" },
];

const NEW_PRODUCTS = [
  // Fragrance & Grooming
  {
    name: "Bleu Royale Eau de Parfum (100ml)",
    categorySlug: "fragrance",
    price: 8499,
    quantity: 24,
    shipping: true,
    description: "A magnetic, sensual fragrance combining Mediterranean bergamot, smoked cedarwood, and rich tonka bean. Hand-bottled in France with an exquisite magnetic cap.",
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
  },
  {
    name: "Santal & Haitian Vetiver Botanical Cologne",
    categorySlug: "fragrance",
    price: 6299,
    quantity: 18,
    shipping: true,
    description: "A grounding woody profile featuring sustainably harvested Australian sandalwood, cardamom, and crisp Haitian vetiver. Formulated without synthetic phthalates or parabens.",
    imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80",
  },
  {
    name: "Precision Japanese Steel Beard & Grooming Set",
    categorySlug: "fragrance",
    price: 3499,
    quantity: 30,
    shipping: true,
    description: "Hand-forged 440C Japanese steel trimming scissors, dual-density pearwood comb, and cold-pressed organic jojoba beard elixir in an embossed leather travel case.",
    imageUrl: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80",
  },

  // Eyewear & Sunglasses
  {
    name: "Handcrafted Japanese Acetate Polarized Sunglasses",
    categorySlug: "eyewear",
    price: 7999,
    quantity: 16,
    shipping: true,
    description: "Precision-milled 8mm cured Japanese acetate frames with 7-barrel custom hinges and anti-reflective polarized CR-39 lenses offering 100% UVA/UVB protection.",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
  },
  {
    name: "Titanium Minimalist Round Optical Frames",
    categorySlug: "eyewear",
    price: 6499,
    quantity: 20,
    shipping: true,
    description: "Ultralight aerospace-grade titanium wire frames weighing just 14 grams. Features hypoallergenic silicone nose pads and flexible beta-titanium temples.",
    imageUrl: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80",
  },
  {
    name: "Classic 1970s 24K Gold Plated Aviator Sunglasses",
    categorySlug: "eyewear",
    price: 9299,
    quantity: 14,
    shipping: true,
    description: "Vintage military aviator silhouette electroplated in 24-karat gold with gradient mineral glass lenses and tear-drop double brow bar.",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
  },

  // Travel & Luggage
  {
    name: "Cabin Polycarbonate Hard-Shell Carry-On Spinner (38L)",
    categorySlug: "travel-luggage",
    price: 11999,
    quantity: 15,
    shipping: true,
    description: "Aerospace Makrolon polycarbonate shell that flexes under impact. Features Hinomoto 360-degree silent whisper wheels, integrated TSA lock, and interior compression system.",
    imageUrl: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&q=80",
  },
  {
    name: "Full-Grain Italian Leather Weekender Travel Duffel",
    categorySlug: "travel-luggage",
    price: 14499,
    quantity: 10,
    shipping: true,
    description: "Handcrafted vegetable-tanned Tuscan vacchetta leather with heavy brass YKK Excella zippers, reinforced bottom studs, and a detachable padded shoulder strap.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  },
  {
    name: "Ballistic Nylon Tech Organizer & Passport Folio",
    categorySlug: "travel-luggage",
    price: 2999,
    quantity: 35,
    shipping: true,
    description: "1680D Cordura ballistic nylon folio featuring RFID-blocking passport sleeves, elastic cable loops, power bank pocket, and waterproof seam sealing.",
    imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80",
  },

  // Footwear & Sneakers
  {
    name: "Heritage 990v6 Suede Running Shoes (Castlerock Grey)",
    categorySlug: "footwear",
    price: 18999,
    quantity: 14,
    shipping: true,
    description: "Premium pigskin suede and breathable mesh upper with FuelCell foam midsole cushioning and ENCAP rim technology for unmatched daily walking comfort.",
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
  },
  {
    name: "Minimalist Italian Nappa Leather Court Sneakers (White)",
    categorySlug: "footwear",
    price: 8999,
    quantity: 20,
    shipping: true,
    description: "Supple full-grain Italian Nappa calfskin with Margom stitched rubber cupsole, waxed organic cotton laces, and calfskin lining that molds to your foot.",
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
  },

  // Men's Fashion
  {
    name: "Heavyweight 280GSM Supima Cotton Crewneck (Sage)",
    categorySlug: "mens-collection",
    price: 1899,
    quantity: 45,
    shipping: true,
    description: "American extra-long staple Supima cotton crafted into a dense 280GSM jersey knit. Pre-shrunk with blind-stitched hems and ribbed collar retention.",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
  },
  {
    name: "Extra-Fine Merino Wool Utility Overshirt (Navy)",
    categorySlug: "mens-collection",
    price: 5299,
    quantity: 22,
    shipping: true,
    description: "100% natural Australian extra-fine merino wool woven with temperature-regulating properties, dual flap chest pockets, and real horn buttons.",
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
  },

  // Women's Fashion
  {
    name: "Pleated Asymmetrical Satin Evening Dress (Emerald)",
    categorySlug: "women-collection",
    price: 5999,
    quantity: 16,
    shipping: true,
    description: "High-sheen heavy fluid satin with fine accordion pleating, asymmetrical draped neckline, and an elegant side slit designed for evening galas.",
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
  },
  {
    name: "Tailored Double-Breasted Linen Blazer (Desert Sand)",
    categorySlug: "women-collection",
    price: 6499,
    quantity: 18,
    shipping: true,
    description: "Pure European flax linen with a relaxed sartorial silhouette, peak lapels, tortoise-effect buttons, and partial breathable viscose butterfly lining.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
  },

  // Accessories & Watches
  {
    name: "Automatic 300M Diver Stainless Steel Watch",
    categorySlug: "accessories",
    price: 38500,
    quantity: 8,
    shipping: true,
    description: "316L surgical-grade stainless steel case, unidirectional ceramic bezel with Super-LumiNova markers, sapphire crystal with AR coating, and 42-hour automatic movement.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  },
  {
    name: "Vegetable-Tanned Italian Leather Minimalist Cardholder",
    categorySlug: "accessories",
    price: 1999,
    quantity: 50,
    shipping: true,
    description: "Hand-burnished edge finishing with 4 card slots, central folded cash compartment, and gold foil embossed SnapCart hallmark logo.",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
  },

  // Home & Living
  {
    name: "Hand-Poured Amber Noir & Smoked Santal Soy Candle",
    categorySlug: "home-living",
    price: 1699,
    quantity: 40,
    shipping: true,
    description: "100% natural soy wax infused with essential oils of dark amber, birch tar, and charred santal. Double lead-free cotton wicks offering 60+ hours clean burn time.",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80",
  },
];

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected successfully.");

  // 1. Seed Categories
  const categoryMap = {};

  // Fetch existing categories
  const existingCats = await categoryModel.find({});
  existingCats.forEach((c) => {
    categoryMap[c.slug] = c._id;
  });

  for (const catData of NEW_CATEGORIES) {
    let cat = await categoryModel.findOne({ slug: catData.slug });
    if (!cat) {
      cat = await categoryModel.create({
        name: catData.name,
        slug: catData.slug,
      });
      console.log(`Created new category: ${cat.name} (/${cat.slug})`);
    } else {
      console.log(`Category exists: ${cat.name} (/${cat.slug})`);
    }
    categoryMap[cat.slug] = cat._id;
  }

  // 2. Seed Products
  console.log(`\nSeeding ${NEW_PRODUCTS.length} expanded products with Cloudinary CDN...`);

  for (const prodData of NEW_PRODUCTS) {
    const categoryId = categoryMap[prodData.categorySlug];
    if (!categoryId) {
      console.warn(`Category slug not found: ${prodData.categorySlug}`);
      continue;
    }

    const slug = slugify(prodData.name, { lower: true, strict: true });
    let existing = await productModel.findOne({ slug });

    if (existing) {
      console.log(`Product already exists: ${prodData.name} - skipping.`);
      continue;
    }

    console.log(`Uploading to Cloudinary: ${prodData.name}...`);
    try {
      const uploadRes = await uploadImageToCloudinary(prodData.imageUrl);
      const product = await productModel.create({
        name: prodData.name,
        slug,
        description: prodData.description,
        price: prodData.price,
        quantity: prodData.quantity,
        category: categoryId,
        shipping: prodData.shipping,
        photo: {
          url: uploadRes.url,
          public_id: uploadRes.public_id,
        },
      });
      console.log(`Saved product: ${product.name} (₹${product.price})`);
    } catch (err) {
      console.error(`Failed to process ${prodData.name}:`, err.message);
    }
  }

  await clearCachePattern("product");
  console.log("\nFinished seeding catalog. Total products now in database:");
  const totalCount = await productModel.countDocuments();
  console.log(`Total count: ${totalCount}`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

