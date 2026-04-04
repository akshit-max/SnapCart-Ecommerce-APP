import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dns from "node:dns";

import connectdb from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// DNS fix (important for MongoDB Atlas sometimes)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// config env
dotenv.config();

// connect DB
connectdb();

// app
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/contact", contactRoutes);



// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve frontend (IMPORTANT for Render)
// serve frontend (SAFE + production ready)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("<h1>API is running...</h1>");
  });
}

// PORT
const PORT = process.env.PORT || 8080;

// run server
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.bgBlue.white
  );
});