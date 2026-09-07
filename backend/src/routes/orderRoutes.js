const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/authMiddleware");
const { createOrder, getUserOrders } = require("../controllers/orderController");

router.post("/create", verifyUser, createOrder);
router.get("/", verifyUser, getUserOrders);

module.exports = router;
