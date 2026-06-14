const express = require("express");
const app = express();
var cookieParser = require("cookie-parser");
const cors = require("cors");
const dns = require("dns");
const dbConfig = require("./dbConfig");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const route = require("./routes");
const cloudinaryConfig = require("./services/cloudinaryConfig");
const { webhook } = require("./controllers/orderController");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

require("dotenv").config();
const port = process.env.PORT || 1993;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const clientOrigin = process.env.CLIENT_URL?.trim() || "http://localhost:3000";

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);
app.post("/webhook", express.raw({ type: "application/json" }), webhook);
app.use(express.json());
app.use(route);
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await dbConfig();
    cloudinaryConfig();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
