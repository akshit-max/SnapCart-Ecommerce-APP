import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { connectTestDb, closeTestDb, clearTestDb, createUser, createProduct } from "./setup.js";
import app from "../app.js";
import categoryModel from "../models/categoryModel.js";

describe("Category API", () => {
  let adminToken;

  before(connectTestDb);
  after(closeTestDb);
  beforeEach(async () => {
    await clearTestDb();
    ({ token: adminToken } = await createUser({ role: 1, email: "cat-admin@test.com" }));
  });

  it("creates a new category and slugifies the name", async () => {
    const res = await request(app)
      .post("/api/v1/category/create-category")
      .set("Authorization", adminToken)
      .send({ name: "Running Shoes" });

    assert.equal(res.status, 201);
    assert.equal(res.body.category.slug, "running-shoes");
  });

  it("rejects duplicate category names", async () => {
    await request(app)
      .post("/api/v1/category/create-category")
      .set("Authorization", adminToken)
      .send({ name: "Watches" });

    const duplicate = await request(app)
      .post("/api/v1/category/create-category")
      .set("Authorization", adminToken)
      .send({ name: "Watches" });

    assert.equal(duplicate.status, 409);
  });

  it("blocks deleting a category when products are still assigned to it", async () => {
    const cat = await categoryModel.create({ name: "Hats", slug: "hats" });
    await createProduct({ name: "Sun Hat", category: cat._id });

    const res = await request(app)
      .delete(`/api/v1/category/delete-category/${cat._id}`)
      .set("Authorization", adminToken);

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes("product(s) in this category"));
  });
});

