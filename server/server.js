const express = require("express");
const app = express();
var cookieParser = require("cookie-parser")
const port = process.env.port || 1993
const cors = require("cors");
const dbConfig = require("./dbConfig");
const route = require("./routes");
const cloudinaryConfig = require("./services/cloudinaryConfig")

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser())
require("dotenv").config();
app.use(cors());
dbConfig();
cloudinaryConfig()
app.use(route);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
