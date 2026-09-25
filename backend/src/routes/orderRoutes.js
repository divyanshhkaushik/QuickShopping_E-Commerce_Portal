const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/authMiddleware");
const {
  createOrder,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

router.post("/create", verifyUser, createOrder);
router.get("/", verifyUser, getUserOrders);
router.get("/seller", verifyUser, getSellerOrders);
router.patch("/:id/cancel", verifyUser, cancelOrder);
router.patch("/:id/status", verifyUser, updateOrderStatus);

module.exports = router;
