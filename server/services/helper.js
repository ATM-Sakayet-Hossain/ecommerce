const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const ordersSchema = require("../models/ordersSchema");

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
};
const generateResetPassToken = () => {
  const resetToken = crypto.randomBytes(16).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  return { resetToken, hashedToken };
};
const hashResetToken = (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return hashedToken;
};
const VerifiedToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
const generateOrderNumber = async (Model, prefixCode, fieldName) => {
  const today = new Date();
  const year = String(today.getFullYear()).slice(-2);
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const prefix = `${prefixCode}${year}${month}${day}`; // `PA${year}${month}${day}`
  // find last order of today
  const lastOrder = await Model.findOne({
    [fieldName]: { $regex: `^${prefix}` },
  }).sort({ [fieldName]: -1 });
  let sequence = 1;
  if (lastOrder) {
    const lastNumber = lastOrder[fieldName];
    const lastSequence = parseInt(lastNumber.slice(-4)); // last 4 digits
    sequence = lastSequence + 1;
  }
  const newSequence = String(sequence).padStart(4, "0");
  return `${prefix}${newSequence}`;
};
const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

module.exports = {
  generateOTP,
  generateAccessToken,
  generateRefreshToken,
  generateResetPassToken,
  VerifiedToken,
  hashResetToken,
  generateOrderNumber,
  getPagination,
};
