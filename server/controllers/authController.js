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
const {
  emailVerifyTem,
  resetPassEmailTemp,
} = require("../services/emailVerifyTem");
const {
  deleteFromCloudinary,
  uploadToCloudinary,
} = require("../services/cloudinaryService");
const { responseHandler } = require("../Utils/responseHandler");

const registration = async (req, res) => {
  try {
    const { fullName, email, password, phone, address, confirmPassword } =
      req.body;
    if (!fullName)
      return responseHandler.error(res, 400, "Full Name is required");
    if (!email) return responseHandler.error(res, 400, "Email is required");
    if (!isValidEmail(email))
      return responseHandler.error(res, 400, "Invalid email format");
    if (!password)
      return responseHandler.error(res, 400, "Password is required");
    if (!confirmPassword)
      return responseHandler.error(res, 400, "Confirm Password is required.");
    if (password != confirmPassword)
      return responseHandler.error(
        res,
        400,
        "Please provide and confirm your new password.",
      );
    if (!isStrongPassword(password))
      return responseHandler.error(
        res,
        400,
        "Password must be at least 6 characters long",
      );
    const existingUser = await userSchema.findOne({ email });
    if (existingUser)
      return responseHandler.error(res, 401, "Email is already registered");
    const otp = generateOTP();
    const user = new userSchema({
      fullName,
      email,
      password,
      phone,
      address,
      otp,
      otpExpires: Date.now() + 2 * 60 * 1000,
    });
    sendEmail({
      email,
      subject: "Email Varification",
      otp,
      templete: emailVerifyTem,
      fullName,
    });
    await user.save();
    responseHandler.success(
      res,
      201,
      "User signed up successfully, Please verify your email before logging in.",
    );
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const verification = async (req, res) => {
  try {
    const { otp, email } = req.body;
    if (!otp) return responseHandler.error(res, 400, " OTP is Required");
    if (!email) return responseHandler.error(res, 400, "Unauthorized User");
    const user = await userSchema.findOne({
      email,
      otp: Number(otp),
      otpExpires: { $gt: new Date() },
      isVerified: false,
    });
    if (!user)
      return responseHandler.error(res, 401, "Invalid or expired OTP.");
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    responseHandler.success(res, 200, "Varificaation successfully");
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return responseHandler.error(res, 400, "Email is required");
    const user = await userSchema.findOne({ email, isVerified: false });
    if (!user) return responseHandler.error(res, 400, "Unauthorized Request");
    if (user.otpExpires && user.otpExpires > Date.now() - 60000) {
      return responseHandler.error(
        res,
        429,
        "Please wait before requesting a new OTP",
      );
    }
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 2 * 60 * 1000;
    user.save();
    sendEmail({
      email,
      subject: "Email Varification",
      otp,
      templete: emailVerifyTem,
      fullName: user.fullName,
    });
    responseHandler.success(res, 200, "OTP send you mail successfully");
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) return responseHandler.error(res, 400, "Email is required");
    if (!isValidEmail(email))
      return responseHandler.error(res, 400, "Valid Email is required");
    if (!password)
      return responseHandler.error(res, 400, "Password is required");
    const user = await userSchema.findOne({ email });
    if (!user)
      return responseHandler.error(res, 401, "Email or Password is invalid");
    if (!user.isVerified)
      return responseHandler.error(
        res,
        400,
        "Please verify your email before logging in",
      );
    if (user.status === "banned")
      return responseHandler.error(
        res,
        400,
        "Account is banned. Please Contract your Admin or IT Support",
      );
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return responseHandler.error(res, 401, "Email or Password is invalid");
    if (user.status === "inactive") {
      user.status = "active";
      await user.save();
    }
    const accToken = generateAccessToken(user);
    const refToken = generateRefreshToken(user);
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
    responseHandler.success(res, 200, "Welcome, your login was successful.");
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const logout = async (req, res) => {
  try {
    res.cookie("X-AS-Token", "", {
      httpOnly: false,
      secure: false,
      sameSite: "none",
      expires: new Date(0),
    });
    res.cookie("X-RF-Token", "", {
      httpOnly: false,
      secure: false,
      sameSite: "none",
      expires: new Date(0),
    });
    responseHandler.success(res, 200, "Logout successful");
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const forgetPass = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return responseHandler.error(res, 400, "Email is required");
    if (!isValidEmail(email))
      return responseHandler.error(
        res,
        400,
        "Please enter a valid email address",
      );
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser)
      return responseHandler.error(res, 400, "Unauthorized Email");
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
    responseHandler.success(
      res,
      200,
      "A reset password link has been sent to your email",
    );
  } catch (error) {
    responseHandler.error(
      res,
      400,
      "Something went wrong. Please try again later",
      500,
    );
  }
};
const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const token = req.query.sec;
    if (!newPassword)
      return responseHandler.error(res, 400, "New password is required.");
    if (!confirmPassword)
      return responseHandler.error(res, 400, "Confirm Password is required.");
    if (newPassword != confirmPassword)
      return responseHandler.error(
        res,
        "Please provide and confirm your new password.",
      );
    const hashedToken = hashResetToken(token);
    const existingUser = await userSchema.findOne({
      resetPassToken: hashedToken,
      resetExpires: { $gt: Date.now() },
    });
    if (!existingUser)
      return responseHandler.error(res, 400, "Invalid Request");
    existingUser.password = newPassword;
    existingUser.resetPassToken = undefined;
    existingUser.resetExpires = undefined;
    existingUser.save();
    responseHandler.success(
      res,
      200,
      "Your password has been reset successfully. You can now log in.",
    );
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user._id;
  try {
    if (!currentPassword)
      return responseHandler(res, 400, "Current password is required");
    if (!newPassword)
      return responseHandler(res, 400, "New password is required.");
    if (!isStrongPassword(newPassword))
      return responseHandler.error(
        res,
        400,
        "Password must be at least 6 characters long",
      );
    if (!confirmPassword)
      return responseHandler(res, 400, "Confirm Password is required.");
    if (newPassword != confirmPassword)
      return responseHandler(
        res,
        400,
        "Please provide and confirm your new password.",
      );
    const user = await userSchema.findById(userId);
    if (!user) return responseHandler.error(res, 400, "User not Found");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return responseHandler.error(res, 400, "Current password is incorrect");
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword)
      return responseHandler.error(
        res,
        400,
        "New password must be different from current password",
      );
    user.password = newPassword;
    await user.save();
    responseHandler.success(res, 200, "Password changed successfully");
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const getprofile = async (req, res) => {
  try {
    const userProfile = await userSchema
      .findById(req.user._id)
      .select(
        "-password -otp -otpExpires -resetPassToken -resetExpires -updatedAt",
      );
    if (!userProfile) return responseHandler.error(res, 400, "Invalid Request");
    responseHandler.success(res, 200, userProfile);
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
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
    if (avatar) {
      const imgPublicId = user.avatar.split("/").pop().split(".")[0];
      deleteFromCloudinary(`avatar/${imgPublicId}`);
      const imgRes = await uploadToCloudinary(avatar, "avatar");
      user.avatar = imgRes.secure_url;
    }
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    user.save();
    responseHandler.success(res, 200, "user Update successfully");
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const refreshAccessToken = async (req, res) => {
  try {
    const refToken = req.cookies?.["X-RF-Token"] || req.header.authorization;
    if (!refToken) return responseHandler.error(res, 400, "time is Expair");
    const decoded = VerifiedToken(refToken);
    if (!decoded) return;
    const accToken = generateAccessToken(decoded);
    res
      .cookie("X-AS-Token", accToken, {
        httpOnly: false, // Not accessible by client-side JS
        secure: false, // Only sent over HTTPS
        maxAge: 3600000, // Expires in 1 hour (in milliseconds)
        // sameSite: 'Strict' // Only send for same-site requests
      })
      .send({ success: true });
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const getAuthStatus = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await userSchema.findById(userId).select("status email role");
    if (!user) return responseHandler.error(res, 400, "Unauthorized User");
    responseHandler.success(res, 200, "User status fetched");
  } catch (error) {
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const deactivateAccount = async (req, res) => {
  const { email } = req.body;
  const user = await userSchema.findOne({ email });
  try {
    if (!user) return responseHandler.error(res, 404, "user not Found");
    if (user.status === "inactive")
      return responseHandler.error(res, 404, "Account already deactivated");
    if (user.status === "banned")
      return responseHandler.error(
        res,
        404,
        "Banned account cannot be modified",
      );
    user.status = "inactive";
    await user.save();
    responseHandler.success(res, 200, "Account deactivated successfully");
  } catch (error) {
    console.log(error);
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
const userStatus = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userSchema.findOne({ email });
    if (!user) return responseHandler.error(res, 400, "user not found");
    user.status = user.status === "active" ? "banned" : "active";
    await user.save();
    responseHandler.success(res, 200, `user ${user.status} successfully`);
  } catch (error) {
    console.log(error);
    responseHandler.error(
      res,
      500,
      "Something went wrong. Please try again later",
    );
  }
};
module.exports = {
  registration,
  verification,
  resendOTP,
  login,
  logout,
  forgetPass,
  resetPassword,
  changePassword,
  getprofile,
  updateUserProfile,
  refreshAccessToken,
  getAuthStatus,
  deactivateAccount,
  userStatus,
};
