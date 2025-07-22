import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Local imports
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// Config environment
dotenv.config();

// Connect to database
connectDB();

// ES Module path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App initialization
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/contact", contactRoutes);

// REST API default route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ECOMMERCE WEB APP!!</h1>");
});

// ------------------- Deployment -------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}
// --------------------------------------------------

// Port and Server Listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `✅ Server running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgBlue
      .white
  );
});
