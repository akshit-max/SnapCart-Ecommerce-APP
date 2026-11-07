import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import slugify from "slugify";
import { clearCachePattern } from "../helpers/cacheHelper.js";

const toSlug = (name) => slugify(name, { lower: true, strict: true });

//create category
export const createCategoryController = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) {
      return res.status(400).send({ success: false, message: "Name is required" });
    }
    if (await categoryModel.exists({ slug: toSlug(name) })) {
      return res.status(409).send({ success: false, message: "Category already exists" });
    }

    const category = await new categoryModel({ name, slug: toSlug(name) }).save();
    await clearCachePattern("product");
    res.status(201).send({ success: true, message: "New category created", category });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while creating category" });
  }
};

//update category
export const updateCategoryController = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const { id } = req.params;
    if (!name) {
      return res.status(400).send({ success: false, message: "Name is required" });
    }
    if (await categoryModel.exists({ slug: toSlug(name), _id: { $ne: id } })) {
      return res.status(409).send({ success: false, message: "Category already exists" });
    }

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: toSlug(name) },
      { new: true }
    );
    await clearCachePattern("product");
    res.status(200).send({ success: true, message: "Category updated successfully", category });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while updating category" });
  }
};

//get all categories
export const categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({}).sort({ name: 1 });
    res.status(200).send({ success: true, category });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while getting categories" });
  }
};

//single category
export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).send({ success: false, message: "Category not found" });
    res.status(200).send({ success: true, category });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while getting category" });
  }
};

//delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    // don't leave products pointing to a category that doesn't exist
    const productCount = await productModel.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(400).send({
        success: false,
        message: `Move or delete the ${productCount} product(s) in this category first`,
      });
    }

    await categoryModel.findByIdAndDelete(id);
    await clearCachePattern("product");
    res.status(200).send({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while deleting category" });
  }
};
