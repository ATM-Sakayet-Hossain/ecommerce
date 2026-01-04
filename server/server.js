const express = require("express");
const app = express();
const port = process.env.port || 1993
const cors = require("cors");
const dbConfig = require("./dbConfig");
const route = require("./routes");
app.use(express.json());
require("dotenv").config();
app.use(cors());
dbConfig();
app.use(route);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
