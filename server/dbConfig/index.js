const { default: mongoose } = require("mongoose");
// node2501-ecommerce
const dbConfig = () => {
  return mongoose.connect(process.env.DB_URL).then(() => {
    console.log("DB Connected");
  });
};

module.exports = dbConfig;