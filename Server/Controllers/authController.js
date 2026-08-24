const User = require("../Models/User");
const OTP = require("../Models/OTP");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail, sendOtpEmail } = require("../utils/emailService");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "rentx_secret_key_2026_placements", {
    expiresIn: "30d",
  });
};

// @desc    Send OTP to email for signup verification
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Please provide email address." });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists. Please login instead." });
    }

    // Generate 6-digit random OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in DB, update if exists
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send OTP via Nodemailer
    const emailResult = await sendOtpEmail(email, otp);
    
    if (emailResult.success) {
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully"
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "OTP email could not be sent"
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, otp } = req.body;

    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP verification code is required." });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Verify OTP
    const otpDoc = await OTP.findOne({ email });
    if (!otpDoc || otpDoc.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP verification code." });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "user", // Let client specify 'admin' for placement testing
    });

    if (user) {
      // Remove OTP record
      await OTP.deleteOne({ email });

      // Send welcome email asynchronously
      sendWelcomeEmail(user.email, user.name).catch((err) =>
        console.error("Welcome email error:", err.message)
      );

      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google OAuth Register/Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: "Invalid user credentials from Google" });
    }

    // Check if user exists in database
    let user = await User.findOne({ email });

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      // Create a user record if they don't exist
      user = await User.create({
        name,
        email,
        password: `google-secret-pass-${googleId || Math.random().toString(36).slice(-8)}`,
        role: "user", // Default role
      });
    }

    if (isNewUser) {
      sendWelcomeEmail(user.email, user.name).catch((err) =>
        console.error("Welcome email error (Google):", err.message)
      );
    }

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  sendOTP,
};
