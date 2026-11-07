import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// the express app lives here (without listen) so tests can import it
const app = express();
const isProd = process.env.NODE_ENV === "production";

// CSP is off because the client loads bootstrap, fonts and razorpay from CDNs
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: isProd ? process.env.CLIENT_URL : true }));
app.use(express.json({ limit: "1mb" }));
if (!isProd && process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// limit login / register / reset attempts and contact form spam
const strictLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });
app.use("/api/v1/auth/login", strictLimiter);
app.use("/api/v1/auth/register", strictLimiter);
app.use("/api/v1/auth/forgot-password", strictLimiter);
app.use("/api/v1/contact", strictLimiter);

// ============================================================================
// SYSTEM DESIGN PATTERN: HEALTH CHECK & OBSERVABILITY
// Standard endpoint used by load balancers, Kubernetes probes, and monitoring
// tools to verify API uptime and active database connectivity.
// ============================================================================
app.get("/api/v1/health", (req, res) => {
  res.status(200).send({
    status: "ok",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/contact", contactRoutes);

// unknown api routes should return json, not the react app
app.use("/api", (req, res) => {
  res.status(404).send({ success: false, message: "Route not found" });
});

if (isProd) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const buildPath = path.join(__dirname, "..", "frontend", "build");
  app.use(express.static(buildPath));

  // let react router handle every other page (fixes 404 on refresh)
  app.use((req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("<h1>API is running...</h1>");
  });
}

export default app;
