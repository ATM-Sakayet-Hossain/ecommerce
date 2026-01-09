const jwt = require('jsonwebtoken');

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
const generateRefreshToken  = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};
const generateResetPassToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

module.exports = { generateOTP, generateAccessToken, generateRefreshToken, generateResetPassToken };
