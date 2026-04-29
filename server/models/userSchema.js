const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    avatar: { type: String },
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    address: { type: String },
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    otp: { type: Number, default: null },
    otpExpires: { type: Date },
    resetPassToken: { type: String },
    resetExpires: { type: String },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  const user = this;
  if (!user.isModified("password")) {
    return;
  }

  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (err) {}
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
