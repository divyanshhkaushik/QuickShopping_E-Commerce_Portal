const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getAddresses,
  addAddress,
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
router.get("/addresses", verifyUser, getAddresses);
router.post("/address", verifyUser, addAddress);
router.post("/add-address", verifyUser, addAddress);

module.exports = router;