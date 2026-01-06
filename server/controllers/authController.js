const userSchema = require("../models/userSchema");
const { sendEmail } = require("../services/emailService");
const { generateOTP } = require("../services/helper");
const { isValidEmail, isStrongPassword } = require("../services/validation");
const { responseHandler } = require("../Utils/responseHandler")
const registration = async (req, res) => {
    try {
        const { fullName, email, password, phone, address } = req.body;
        if (!email) return res.status(400).send({ message: "Email is required" });
        if (!isValidEmail(email)) return responseHandler(res, 400, "Invalid email format" );
        if (!password) return responseHandler(res, 400, "Password is required");
        if (!isStrongPassword(password)) return responseHandler(res, 400, "Password must be at least 6 characters long" );
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) return responseHandler(res, 400, "Email is already registered" );
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
        responseHandler(res, 201, "User signed up successfully, please verify your email", true);
    } catch (error) {
        responseHandler(res, 500,"Internal Server issue" );
    }
}
const verification = async (req, res) => {
    try {
        const { generatedOtp, email } = req.body;
        if(!generatedOtp) return responseHandler(res, 400," OTP is Required");
        if(!email) return responseHandler(res, 400,"Unauthorized User");
        const user = await userShema.findOne({email})

        responseHandler(res, 201, "Varificaation successfully", true);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    registration, verification,
};