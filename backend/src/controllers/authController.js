const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");
const { sendOtpEmail } = require("../config/mailer");

// Register User

const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }
    console.log("Content-Type:", req.headers["content-type"]);
console.log("Body:", req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("addresses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newAddress = {
      ...req.body,
      label: req.body.label || "Home",
      country: req.body.country || "India",
    };

    user.addresses.push(newAddress);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address Saved",
      address: user.addresses[user.addresses.length - 1],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email phone role createdAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, and email are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user.id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered to another account",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = String(name).trim();
    user.phone = String(phone).trim();
    user.email = normalizedEmail;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const requestPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (String(user.email).trim().toLowerCase() !== normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Please enter the same email linked to your account",
      });
    }

    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const isOtpDebugMode = String(process.env.OTP_DEBUG_MODE || "false") === "true";

    if (!isOtpDebugMode) {
      await sendOtpEmail({
        to: user.email,
        otp,
        username: user.name,
      });
    }

    user.passwordResetOtp = otp;
    user.passwordResetOtpExpiresAt = otpExpiresAt;
    await user.save();

    return res.status(200).json({
      success: true,
      message: isOtpDebugMode ? "OTP generated in debug mode" : "OTP sent to your email address",
      debugMode: isOtpDebugMode,
      debugOtp: isOtpDebugMode ? otp : undefined,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (String(user.email).trim().toLowerCase() !== normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Please enter the same email linked to your account",
      });
    }

    if (!user.passwordResetOtp || user.passwordResetOtp !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.passwordResetOtpExpiresAt || user.passwordResetOtpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password must match",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (String(user.email).trim().toLowerCase() !== normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Please enter the same email linked to your account",
      });
    }

    if (!user.passwordResetOtp || user.passwordResetOtp !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.passwordResetOtpExpiresAt || user.passwordResetOtpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetOtp = "";
    user.passwordResetOtpExpiresAt = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getAddresses,
  addAddress,
  getProfile,
  updateProfile,
  requestPasswordOtp,
  verifyPasswordOtp,
  resetPasswordWithOtp,
};