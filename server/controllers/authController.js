const userSchema = require("../models/userShema");
const { sendEmail } = require("../services/emailService");
const { generateOTP } = require("../services/helper");
const { isValidEmail, isStrongPassword } = require("../services/validation");
const registration = async (req, res) => {
    try {
        const { fullName, email, password, phone, address } = req.body;
        if (!email) return res.status(400).send({ message: "Email is required" });
        if (!isValidEmail(email)) return res.status(400).send({ message: "Invalid email format" });
        if (!password) return res.status(400).send({ message: "Password is required" });
        if (!isStrongPassword(password)) return res.status(400).send({ message: "Password must be at least 6 characters long" });
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) return res.status(400).send({ message: "Email is already registered" });
        const generatedOtp = generateOTP(); 
        const user = new userSchema({
            fullName,
            email,
            password,
            phone,
            address,
            generatedOtp,
            otpExpires: Date.now() + 2 * 60 * 1000,
        })
        sendEmail({email, subject: "Email Varification", generatedOtp })
        user.save()
        res.status(201).send({ message: "User signed up successfully, please verify your email" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server issue" });
    }
}

module.exports = {
    registration,
};