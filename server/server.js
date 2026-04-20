const express = require("express");
const app = express();
var cookieParser = require("cookie-parser")
const port = process.env.port || 1993
const cors = require("cors");
const dns = require('dns')
const dbConfig = require("./dbConfig");
dns.setServers(['8.8.8.8', '8.8.4.4'])
const route = require("./routes");
const cloudinaryConfig = require("./services/cloudinaryConfig");
const { webhook } = require("./controllers/orderController");

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
dbConfig();
cloudinaryConfig()
app.post("/webhook", express.raw({ type: 'application/json' }), webhook)
app.use(express.json());
app.use(route);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
