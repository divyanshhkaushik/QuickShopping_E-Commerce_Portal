const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/authMiddleware");
const {
  getSellerCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponAnalytics,
  getAvailableCouponsForProduct,
  validateCoupon,
} = require("../controllers/couponController");

router.get("/seller", verifyUser, getSellerCoupons);
router.get("/analytics", verifyUser, getCouponAnalytics);
router.get("/product/:productId", getAvailableCouponsForProduct);
router.post("/create", verifyUser, createCoupon);
router.patch("/:id", verifyUser, updateCoupon);
router.delete("/:id", verifyUser, deleteCoupon);
router.post("/validate", validateCoupon);

module.exports = router;
