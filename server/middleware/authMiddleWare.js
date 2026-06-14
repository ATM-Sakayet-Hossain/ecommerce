const userSchema = require("../models/userSchema");
const { VerifiedToken } = require("../services/helper");
const { responseHandler } = require("../Utils/responseHandler");

const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.cookies;

    if (!token["X-AS-Token"]) {
      return responseHandler.error(res, 401, "Invalid Request");
    }

    const decoded = VerifiedToken(token["X-AS-Token"]);

    if (!decoded) {
      return responseHandler.error(res, 401, "Invalid Request");
    }

    const user = await userSchema
      .findById(decoded._id)
      .select("role status email");

    if (!user) {
      res.cookie("X-AS-Token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0),
      });
      res.cookie("X-RF-Token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0),
      });
      return responseHandler.error(res, 401, "Invalid Request");
    }

    if (user.role !== decoded.role) {
      res.cookie("X-AS-Token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0),
      });
      res.cookie("X-RF-Token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0),
      });
      return responseHandler.error(
        res,
        401,
        "Your role has changed. Please log in again.",
      );
    }

    req.user = decoded;
    next();
  } catch (error) {
    responseHandler.error(res, 500, "Invalid Request");
  }
};

module.exports = authMiddleWare;
