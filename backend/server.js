import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();
import colors from "colors";
import dns from "node:dns";
import connectdb from "./config/db.js";
import app from "./app.js";
import { cleanupExpiredPendingOrders } from "./controllers/orderController.js";

// some networks fail to resolve the Atlas SRV record, so use public DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectdb();

// Periodic background sweeper: cleans up abandoned checkout sessions every 10 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
setInterval(() => {
  cleanupExpiredPendingOrders(15).catch((err) => console.error("Error in order cleaner:", err));
}, CLEANUP_INTERVAL_MS).unref();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`.bgBlue.white
  );
});
