console.log("Cart routes loaded");
const express = require("express");

const router = express.Router();

const verifyUser = require("../middleware/authMiddleware");

const {
    addToCart,
    getCartCount,
    getCartItems,
    removeFromCart,
    updateCartQuantity,
} = require("../controllers/cartController");

console.log({
    getCartCount,
    addToCart,
    getCartItems,
    removeFromCart,
});

router.get("/count", verifyUser, getCartCount);
router.post("/add", verifyUser, addToCart);
router.patch("/item/:productId", verifyUser, updateCartQuantity);
router.get("/", verifyUser, getCartItems);
router.delete("/:id", verifyUser, removeFromCart);

module.exports = router;
