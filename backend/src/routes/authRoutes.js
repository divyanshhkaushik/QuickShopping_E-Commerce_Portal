const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/authController");

const verifyUser = require("../middleware/authMiddleware");

console.log({
  registerUser,
  loginUser,
  logoutUser,
  getAddresses,
  addAddress,
  verifyUser,
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", verifyUser, getProfile);
router.patch("/profile", verifyUser, updateProfile);
router.post("/password/request-otp", verifyUser, requestPasswordOtp);
router.post("/password/verify-otp", verifyUser, verifyPasswordOtp);
router.post("/password/reset", verifyUser, resetPasswordWithOtp);
router.get("/addresses", verifyUser, getAddresses);
router.post("/address", verifyUser, addAddress);
router.post("/add-address", verifyUser, addAddress);

module.exports = router;