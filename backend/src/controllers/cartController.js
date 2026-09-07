const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
    console.log("🔥 addToCart reached");
    try{
        const { productId } = req.body;

        const product = await require("../models/Product").findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (String(product.sellerId) === String(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "You cannot add your own listed product to the cart",
            });
        }

        const existingItem = 
        await Cart.findOne({
            userId: req.user.id,
            productId,
        });

        if (existingItem) {
            existingItem.quantity += 1;
            await existingItem.save();

            return res.json({
                success: true,
                message: "Quantity updated",
            });
        }

        await Cart.create({
            userId: req.user.id,
            productId,
            quantity: 1,
        });

        res.status(201).json({
            success: true,
            message: "Added to cart",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getCartCount = async (req, res) => {
    try{
        const count = await Cart.countDocuments({
            userId: req.user.id,
        });

        res.json({
            success: true,
            count,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getCartItems = async (req, res) => {
  try {
    const items = await Cart.find({
      userId: req.user.id,
    }).populate("productId");

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const deletedItem = await Cart.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {addToCart, getCartCount, getCartItems, removeFromCart};