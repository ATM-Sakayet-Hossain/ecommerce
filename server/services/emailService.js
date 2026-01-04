const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});

const sendEmail = async ({ email, subject, generatedOtp }) => {
  await transporter.sendMail({
    from: '"E-Commerce" <process.env.MAIL_USERNAME>',
    to: email,
    subject: subject,
    html: `<b>Email verification OTP: ${generatedOtp}</b>`, // HTML version of the message
  });
};

module.exports = { sendEmail };