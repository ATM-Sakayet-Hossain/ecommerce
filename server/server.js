const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const port = process.env.port || 1993
const cors = require("cors");
const dbConfig = require("./dbConfig");
const route = require("./routes");
app.use(express.json());
app.use(cookieParser())
require("dotenv").config();
app.use(cors());
dbConfig();
app.use(route);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
