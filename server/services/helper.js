const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
    { expiresIn: "1h" }
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
    { expiresIn: "1d" }
  );
};
const generateResetPassToken = () => {
  const resetToken = crypto.randomBytes(16).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  return {resetToken, hashedToken}
};
const hashResetToken = (token) =>{
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return hashedToken;
}
const VerifiedToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
const generateOrderNumber = async (orderData) => {
    const today = new Date();
    const year = String(today.getFullYear()).slice(-2); // 26
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 04
    const day = String(today.getDate()).padStart(2, "0"); // 01
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const count = await Order.countDocuments({
        createdAt: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });
    const sequence = String(count + 1).padStart(4, "0"); // 0001
    return `${year}${month}${day}${sequence}`;
};

module.exports = {
  generateOTP,
  generateAccessToken,
  generateRefreshToken,
  generateResetPassToken,
  VerifiedToken,
  hashResetToken,
  generateOrderNumber
};
