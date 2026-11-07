// Shared test helpers. Tests run against an in-memory MongoDB,
// so they never touch the real database.
import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import { hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.RAZORPAY_KEY_SECRET = "test-razorpay-secret";

let mongo;

export const connectTestDb = async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
};

export const closeTestDb = async () => {
  await mongoose.disconnect();
  await mongo.stop();
};

export const clearTestDb = async () => {
  for (const collection of Object.values(mongoose.connection.collections)) {
    await collection.deleteMany({});
  }
};

// creates a user and returns it with a valid token
export const createUser = async ({ role = 0, email = "user@test.com" } = {}) => {
  const user = await userModel.create({
    name: role === 1 ? "Admin" : "Test User",
    email,
    password: await hashPassword("secret123"),
    phone: "9999999999",
    address: "Hyderabad",
    answer: await hashPassword("cricket"),
    role,
  });
  const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET);
  return { user, token };
};

export const createProduct = async (overrides = {}) => {
  const category =
    (await categoryModel.findOne({ slug: "shirts" })) ||
    (await categoryModel.create({ name: "Shirts", slug: "shirts" }));

  const name = overrides.name || "Blue Shirt";
  return productModel.create({
    name,
    slug: name.toLowerCase().replace(/ /g, "-"),
    description: "A nice shirt",
    price: 1000,
    quantity: 10,
    category: category._id,
    ...overrides,
  });
};
