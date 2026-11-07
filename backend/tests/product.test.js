import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { connectTestDb, closeTestDb, clearTestDb, createUser, createProduct } from "./setup.js";
import app from "../app.js";

describe("Product API", () => {
  before(connectTestDb);
  after(closeTestDb);
  beforeEach(clearTestDb);

  it("filters by price, sorts and paginates the product list", async () => {
    for (let i = 1; i <= 8; i++) {
      await createProduct({ name: `Shirt ${i}`, price: i * 500 });
    }

    const res = await request(app)
      .get("/api/v1/product/product-list")
      .query({ min: 1000, max: 3000, sort: "price-desc" });

    assert.equal(res.status, 200);
    assert.equal(res.body.total, 5); // 1000, 1500, 2000, 2500, 3000
    assert.deepEqual(
      res.body.products.map((p) => p.price),
      [3000, 2500, 2000, 1500, 1000]
    );

    const page2 = await request(app).get("/api/v1/product/product-list").query({ page: 2 });
    assert.equal(page2.body.products.length, 2); // 6 per page
  });

  it("handles regex characters in search safely", async () => {
    await createProduct({ name: "Blue Shirt" });

    const weird = await request(app).get("/api/v1/product/search/(((");
    assert.equal(weird.status, 200);
    assert.equal(weird.body.products.length, 0);

    const normal = await request(app).get("/api/v1/product/search/blue");
    assert.equal(normal.body.products.length, 1);
  });

  it("only lets admins delete products", async () => {
    const product = await createProduct();
    const { token } = await createUser();

    const noLogin = await request(app).delete(`/api/v1/product/delete-product/${product._id}`);
    assert.equal(noLogin.status, 401);

    const asUser = await request(app)
      .delete(`/api/v1/product/delete-product/${product._id}`)
      .set("Authorization", token);
    assert.equal(asUser.status, 403);

    const { token: adminToken } = await createUser({ role: 1, email: "admin@test.com" });
    const asAdmin = await request(app)
      .delete(`/api/v1/product/delete-product/${product._id}`)
      .set("Authorization", adminToken);
    assert.equal(asAdmin.status, 200);
  });

  it("returns 404 for a product that doesn't exist", async () => {
    const res = await request(app).get("/api/v1/product/get-product/nothing-here");
    assert.equal(res.status, 404);
  });

  it("invalidates the catalog cache when an admin deletes a product", async () => {
    const product = await createProduct({ name: "Cached Item", price: 200 });
    const { token: adminToken } = await createUser({ role: 1, email: "admin-cache@test.com" });

    // Populate the cache
    const initial = await request(app).get("/api/v1/product/product-list");
    assert.equal(initial.status, 200);
    assert.equal(initial.body.total, 1);

    // Delete the product as admin
    const del = await request(app)
      .delete(`/api/v1/product/delete-product/${product._id}`)
      .set("Authorization", adminToken);
    assert.equal(del.status, 200);

    // Immediate subsequent list must reflect deletion (cache was purged)
    const after = await request(app).get("/api/v1/product/product-list");
    assert.equal(after.status, 200);
    assert.equal(after.body.total, 0);
  });

  it("redirects to Cloudinary CDN URL when product photo is hosted in cloud storage", async () => {
    const cdnUrl = "https://res.cloudinary.com/qrkg4byu/image/upload/v12345/snapcart/products/sample.webp";
    const product = await createProduct({
      name: "Cloudinary Product",
      photo: {
        url: cdnUrl,
        public_id: "snapcart/products/sample",
      },
    });

    const res = await request(app).get(`/api/v1/product/product-photo/${product._id}`);
    assert.equal(res.status, 302);
    assert.equal(res.headers.location, cdnUrl);
  });

  it("serves legacy buffer photo with correct headers if stored directly in database", async () => {
    const dummyBuffer = Buffer.from("fake-image-bytes");
    const product = await createProduct({
      name: "Legacy Product",
      photo: {
        data: dummyBuffer,
        contentType: "image/jpeg",
      },
    });

    const res = await request(app).get(`/api/v1/product/product-photo/${product._id}`);
    assert.equal(res.status, 200);
    assert.equal(res.headers["content-type"], "image/jpeg");
    assert.equal(res.body.toString(), dummyBuffer.toString());
  });
});
