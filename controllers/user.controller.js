require("dotenv").config();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const jwt = require("jsonwebtoken")
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Upload avatar if a file is provided
    let avatarUrl = "";
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      avatarUrl = uploadResult.secure_url;
    } else {
      console.log("enter photo")
    }
    

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    // Save user to database
    await user.save();

    // Respond with success
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Registration error:", err); // Log error for debugging
    res.status(500).json({ message: "Internal Server Error" });
  }
};



exports.login = async (req, res) => {
    try {
    const { email, password} = req.body;
    const user = await User.findOne({ email} );
     if (!user) return res.status(400).json({message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) return res.status(400).json({message: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { 
      expiresIn: "1h", 
    });
    
   
    res.json({token, user });
 } catch (err) { 
    res.status(500).json({ message: err.message });
 }
};


// Forgot Password
exports.forgotPassword = async (req, res) => {
try {
const { email} = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: "User not found" });
const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
user.resetToken = resetToken;
user.resetTokenExpiry =  Date.now() + 900000; // 15 minutes
expiry

await user.save();
const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
await sendEmail(email, "Password Reset", ` clisk here and to rest your password${resetLink}`);
res.json({message: "Reset link sent to email" });
} catch (err) {
res.status (500).json({ message: err.message });
}
};