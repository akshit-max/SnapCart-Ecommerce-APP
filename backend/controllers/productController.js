import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import slugify from "slugify";

const MAX_PHOTO_SIZE = 1024 * 1024; // 1mb

// shared checks for create and update, returns an error message or null
const validateProduct = ({ name, description, price, category, quantity }, photo) => {
  if (!name) return "Name is required";
  if (!description) return "Description is required";
  if (!price || Number(price) <= 0) return "Price must be greater than 0";
  if (!category) return "Category is required";
  if (quantity === undefined || quantity === "" || Number(quantity) < 0) return "Quantity is required";
  if (photo && photo.size > MAX_PHOTO_SIZE) return "Photo should be less than 1mb";
  if (photo && !photo.type?.startsWith("image/")) return "Only image files are allowed";
  return null;
};

const productFields = ({ name, description, price, category, quantity, shipping }) => ({
  name,
  description,
  price: Number(price),
  category,
  quantity: Number(quantity),
  shipping: shipping === "1" || shipping === "true",
  slug: slugify(name, { lower: true, strict: true }),
});

//create product
export const createProductController = async (req, res) => {
  try {
    const { photo } = req.files;
    const error = validateProduct(req.fields, photo);
    if (error) return res.status(400).send({ success: false, message: error });

    const product = new productModel(productFields(req.fields));
    if (await productModel.exists({ slug: product.slug })) {
      return res.status(409).send({ success: false, message: "A product with this name already exists" });
    }

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();

    res.status(201).send({ success: true, message: "Product created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while creating product" });
  }
};

//update product
export const updateProductController = async (req, res) => {
  try {
    const { photo } = req.files;
    const error = validateProduct(req.fields, photo);
    if (error) return res.status(400).send({ success: false, message: error });

    const fields = productFields(req.fields);
    if (await productModel.exists({ slug: fields.slug, _id: { $ne: req.params.pid } })) {
      return res.status(409).send({ success: false, message: "A product with this name already exists" });
    }

    const product = await productModel.findById(req.params.pid);
    if (!product) return res.status(404).send({ success: false, message: "Product not found" });

    product.set(fields);
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();

    res.status(200).send({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while updating product" });
  }
};

//delete product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid);
    res.status(200).send({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while deleting product" });
  }
};

//all products (admin list)
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category", "name")
      .select("-photo")
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while getting products" });
  }
};

//single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    if (!product) return res.status(404).send({ success: false, message: "Product not found" });
    res.status(200).send({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while getting product" });
  }
};

//product photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (!product?.photo?.data) return res.status(404).send({ success: false, message: "No photo" });

    res.set("Content-Type", product.photo.contentType);
    res.set("Cache-Control", "public, max-age=86400");
    res.status(200).send(product.photo.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while getting photo" });
  }
};

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
};

// home page list: filters, sorting and pagination in one call
// /product-list?page=1&categories=id1,id2&min=0&max=50&sort=price-asc
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const { categories, min, max, sort } = req.query;

    const filter = {};
    if (categories) filter.category = { $in: categories.split(",") };
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }

    const [products, total] = await Promise.all([
      productModel
        .find(filter)
        .select("-photo")
        .sort(SORT_OPTIONS[sort] || SORT_OPTIONS.newest)
        .skip((page - 1) * perPage)
        .limit(perPage),
      productModel.countDocuments(filter),
    ]);

    res.status(200).send({ success: true, products, total });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error while getting products" });
  }
};

// escape user input before using it in a regex
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

//search product
export const searchProductController = async (req, res) => {
  try {
    const keyword = escapeRegex(req.params.keyword.slice(0, 50));
    const products = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo")
      .limit(30);
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error while searching" });
  }
};

//similar products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .select("-photo")
      .limit(4);
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error while getting related products" });
  }
};

//products by category
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).send({ success: false, message: "Category not found" });

    const products = await productModel.find({ category: category._id }).select("-photo");
    res.status(200).send({ success: true, category, products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error while getting products" });
  }
};
