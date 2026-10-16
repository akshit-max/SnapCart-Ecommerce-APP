import "dotenv/config";
import colors from "colors";
import dns from "node:dns";
import connectdb from "./config/db.js";
import app from "./app.js";

// some networks fail to resolve the Atlas SRV record, so use public DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectdb();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`.bgBlue.white
  );
});
