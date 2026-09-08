const express = require("express");

const router = express.Router();

const {
    becomeSeller,
    addProduct,
    getMyProducts,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
} = require("../controllers/productController");

const verifyUser = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

router.put("/become-seller", verifyUser, becomeSeller);
router.post("/add-product", verifyUser, upload.array("images", 5), addProduct);
router.get("/my-products", verifyUser, getMyProducts);
router.put("/:id", verifyUser, upload.array("images", 5), updateProduct);
router.delete("/:id", verifyUser, deleteProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

module.exports = router;