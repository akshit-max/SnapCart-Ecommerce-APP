import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { connectTestDb, closeTestDb, clearTestDb, createUser } from "./setup.js";
import app from "../app.js";

const newUser = {
  name: "Akshit",
  email: "akshit@test.com",
  password: "secret123",
  phone: "9999999999",
  address: "Hyderabad",
  answer: "Cricket",
};

describe("Auth API", () => {
  before(connectTestDb);
  after(closeTestDb);
  beforeEach(clearTestDb);

  it("registers a user without sending back the password", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(newUser);

    assert.equal(res.status, 201);
    assert.equal(res.body.user.email, newUser.email);
    assert.equal(res.body.user.password, undefined);
    assert.equal(res.body.user.answer, undefined);
  });

  it("rejects missing fields and duplicate emails", async () => {
    const missing = await request(app).post("/api/v1/auth/register").send({ email: "a@b.com" });
    assert.equal(missing.status, 400);

    await request(app).post("/api/v1/auth/register").send(newUser);
    const duplicate = await request(app).post("/api/v1/auth/register").send(newUser);
    assert.equal(duplicate.status, 409);
  });

  it("logs in with the right password and returns a token", async () => {
    await request(app).post("/api/v1/auth/register").send(newUser);
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: newUser.email, password: newUser.password });

    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    assert.equal(res.body.user.address, newUser.address);
  });

  it("gives the same error for a wrong password and an unknown email", async () => {
    await request(app).post("/api/v1/auth/register").send(newUser);

    const wrongPassword = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: newUser.email, password: "nope" });
    const unknownEmail = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "ghost@test.com", password: "nope" });

    assert.equal(wrongPassword.status, 401);
    assert.equal(unknownEmail.status, 401);
    assert.equal(wrongPassword.body.message, unknownEmail.body.message);
  });

  it("resets the password with the security answer (case doesn't matter)", async () => {
    await request(app).post("/api/v1/auth/register").send(newUser);

    const reset = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: newUser.email, answer: "cricket", newPassword: "newpass123" });
    assert.equal(reset.status, 200);

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: newUser.email, password: "newpass123" });
    assert.equal(login.status, 200);
  });

  it("protects user and admin routes", async () => {
    const noToken = await request(app).get("/api/v1/auth/user-auth");
    assert.equal(noToken.status, 401);

    const badToken = await request(app).get("/api/v1/auth/user-auth").set("Authorization", "garbage");
    assert.equal(badToken.status, 401);

    const { token } = await createUser();
    const asUser = await request(app).get("/api/v1/auth/admin-auth").set("Authorization", token);
    assert.equal(asUser.status, 403);

    const { token: adminToken } = await createUser({ role: 1, email: "admin@test.com" });
    const asAdmin = await request(app).get("/api/v1/auth/admin-auth").set("Authorization", adminToken);
    assert.equal(asAdmin.status, 200);
  });
});
