const bcrypt = require("bcrypt");
const userSchema = require("../models/userSchema");
const { sendEmail } = require("../services/emailService");
const {
  generateOTP,
  generateAccessToken,
  generateRefreshToken,
  generateResetPassToken,
  hashResetToken,
  VerifiedToken,
} = require("../services/helper");
const { isValidEmail, isStrongPassword } = require("../services/validation");
const { responseHandler } = require("../Utils/responseHandler");
const {
  emailVerifyTem,
  resetPassEmailTemp,
} = require("../services/emailVerifyTem");
const { deleteFromCloudinary, uploadToCloudinary } = require("../services/cloudinaryService");

const registration = async (req, res) => {
  try {
    const { fullName, email, password, phone, address, confirmPassword } =
      req.body;
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!isValidEmail(email))
      return responseHandler(res, 400, "Invalid email format");
    if (!password) return responseHandler(res, 400, "Password is required");
    if (!confirmPassword)
      return responseHandler(res, 200, "Confirm Password is required.");
    if (password != confirmPassword)
      return responseHandler(
        res,
        200,
        "Please provide and confirm your new password.",
      );
    if (!isStrongPassword(password))
      return responseHandler(
        res,
        400,
        "Password must be at least 6 characters long",
      );
    const existingUser = await userSchema.findOne({ email });
    if (existingUser)
      return responseHandler(res, 400, "Email is already registered");
    const generatedOtp = generateOTP();
    const user = new userSchema({
      fullName,
      email,
      password,
      phone,
      address,
      otp: generatedOtp,
      otpExpires: Date.now() + 2 * 60 * 1000,
    });
    sendEmail({
      email,
      subject: "Email Varification",
      generatedOtp,
      templete: emailVerifyTem,
      fullName,
    });
    user.save();
    responseHandler(
      res,
      201,
      "User signed up successfully, Please verify your email before logging in.",
      true,
    );
  } catch (error) {
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
};
const verification = async (req, res) => {
  try {
    const { otp, email } = req.body;
    if (!otp) return responseHandler(res, 400, " OTP is Required");
    if (!email) return responseHandler(res, 400, "Unauthorized User");
    const user = await userSchema.findOne({
      email,
      otp: Number(otp),
      otpExpires: { $gt: new Date() },
      isVerified: false,
    });
    if (!user) return responseHandler(res, 400, "Invalid or expired OTP.");
    user.isVerified = true;
    user.otp = null;
    user.save();
    responseHandler(res, 201, "Varificaation successfully", true);
  } catch (error) {
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
};
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return responseHandler(res, 400, "Email is required");
    const user = await userSchema.findOne({ email, isVerified: false });
    if (!user) return responseHandler(res, 400, "Invalid Request");
    if (user.otpExpires && user.otpExpires > Date.now() - 60000) {
      return responseHandler(
        res,
        429,
        "Please wait before requesting a new OTP",
      );
    }
    const generatedOtp = generateOTP();
    user.otp = generatedOtp;
    user.otpExpires = Date.now() + 2 * 60 * 1000;
    user.save();
    sendEmail({
      email,
      subject: "Email Varification",
      generatedOtp,
      templete: emailVerifyTem,
      fullName: user.fullName,
    });
    responseHandler(res, 200, "OTP send you mail successfully", true);
  } catch (error) {
    responseHandler(res, 500, "Something went wrong. Please try again later");
    console.log(error);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!isValidEmail(email))
      return responseHandler(res, 400, "Enter a valid email address");
    if (!password) return responseHandler(res, 400, "Password is required");
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser)
      return responseHandler(res, 400, "Invalid email or password");
    if (!existingUser.isVerified)
      return responseHandler(
        res,
        400,
        "Please verify your email before logging in",
      );
    const isMatch = await existingUser.comparePassword(password);
    if (!isMatch) return responseHandler(res, 400, "Invalid email or password");
    const accToken = generateAccessToken(existingUser);
    const refToken = generateRefreshToken(existingUser);
    res.cookie("X-AS-Token", accToken, {
      httpOnly: false, // Not accessible by client-side JS
      secure: false, // Only sent over HTTPS
      maxAge: 3600000, // Expires in 1 hour (in milliseconds)
      // sameSite: 'Strict' // Only send for same-site requests
    });
    res.cookie("X-RF-Token", refToken, {
      httpOnly: false, // Not accessible by client-side JS
      secure: false, // Only sent over HTTPS
      maxAge: 1296000000, // Expires in 1 hour (in milliseconds)
      // sameSite: 'Strict' // Only send for same-site requests
    });
    responseHandler(res, 201, "Welcome, your login was successful.", true);
  } catch (error) {
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
};
const forgetPass = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!isValidEmail(email))
      return responseHandler(res, 400, "Please enter a valid email address");
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser)
      return responseHandler(res, 400, "Email is not registered");
    const { resetToken, hashedToken } = generateResetPassToken();
    existingUser.resetPassToken = hashedToken;
    existingUser.resetExpires = Date.now() + 5 * 60 * 1000;
    existingUser.save();
    const resetPasswordLink = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/auth/resetPass?sec=${resetToken}`;
    sendEmail({
      email,
      subject: "Reset Your Password",
      generatedOtp: resetPasswordLink,
      templete: resetPassEmailTemp,
      fullName: existingUser.fullName,
    });
    responseHandler(
      res,
      200,
      "A reset password link has been sent to your email",
      true,
    );
  } catch (error) {
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
};
const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    // const {token} = req.params.token;
    const token = req.query.sec;
    console.log(token);
    if (!newPassword)
      return responseHandler(res, 400, "New password is required.");
    if (!confirmPassword)
      return responseHandler(res, 400, "Confirm Password is required.");
    if (newPassword != confirmPassword)
      return responseHandler(
        res,
        400,
        "Please provide and confirm your new password.",
      );
    const hashedToken = hashResetToken(token);
    const existingUser = await userSchema.findOne({
      resetPassToken: hashedToken,
      resetExpires: { $gt: Date.now() },
    });
    if (!existingUser) return responseHandler(res, 400, "Invalid Request");
    existingUser.password = newPassword;
    existingUser.resetPassToken = undefined;
    existingUser.resetExpires = undefined;
    existingUser.save();
    responseHandler(
      res,
      200,
      "Your password has been reset successfully. You can now log in.",
      true,
    );
  } catch (error) {
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
};
const getprofile = async (req, res) => {
  try {
    const userProfile = await userSchema
      .findById(req.user._id)
      .select(
        "-password -otp -otpExpires -resetPassToken -resetExpires -updatedAt",
      );
    if (!userProfile) return responseHandler(res, 400, "Invalid Request");
    responseHandler(res, 200, "", true, userProfile);
  } catch (error) {
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    const userId = req.user._id;
    const avatar = req.file;
    const user = await userSchema
      .findById(userId)
      .select(
        "-password -otp -otpExpires -resetPassToken -resetExpires -updatedAt",
      );
    if (avatar){
      const imgPublicId = user.avatar.split("/").pop().split(".")[0];
      deleteFromCloudinary(`avatar/${imgPublicId}`)
      const imgRes = await uploadToCloudinary(avatar, "avatar")
      user.avatar = imgRes.secure_url;
    }
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    user.save();
    responseHandler(res, 200, "", true, user);
  } catch (error) {
    console.log(error);
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
};
const refreshAccessToken = async (req, res) => {
  try {
    const refToken = req.cookies?.["X-RF-Token"] || req.header.authorization;
    if(!refToken) return responseHandler(res, 400, "time is Expair");
    const decoded = VerifiedToken(refToken)
    if(!decoded) return;
    const accToken = generateAccessToken(decoded);
    res.cookie("X-AS-Token", accToken, {
      httpOnly: false, // Not accessible by client-side JS
      secure: false, // Only sent over HTTPS
      maxAge: 3600000, // Expires in 1 hour (in milliseconds)
      // sameSite: 'Strict' // Only send for same-site requests
    }).send({success: true});
  } catch (error) {
    responseHandler(res, 500, "Something went wrong. Please try again later");
  }
}

module.exports = {
  registration,
  verification,
  resendOTP,
  login,
  forgetPass,
  resetPassword,
  getprofile,
  updateUserProfile,
  refreshAccessToken,
};
