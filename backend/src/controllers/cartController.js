const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
    console.log("🔥 addToCart reached");
    try{
    const { productId } = req.body;
    const requestedQuantity = Math.max(1, Number(req.body.quantity || 1));

    const product = await Product.findById(productId);

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

        if (Number(product.stock || 0) < 1) {
          return res.status(400).json({
            success: false,
            message: "This product is out of stock",
          });
        }

        const existingItem = 
        await Cart.findOne({
            userId: req.user.id,
            productId,
        });

        if (existingItem) {
            existingItem.quantity = Math.min(Number(product.stock || 0), existingItem.quantity + requestedQuantity);

            if (existingItem.quantity < 1) {
                existingItem.quantity = 1;
            }

            await existingItem.save();

            return res.json({
                success: true,
                message: "Quantity updated",
                item: existingItem,
            });
        }

        const quantity = Math.min(requestedQuantity, Number(product.stock || 0));

        await Cart.create({
            userId: req.user.id,
            productId,
            quantity: quantity > 0 ? quantity : 1,
        });

        res.status(201).json({
            success: true,
            message: "Added to cart",
            item: {
                productId,
                quantity: quantity > 0 ? quantity : 1,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const nextQuantity = Math.max(0, Number(req.body.quantity || 0));

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const cartItem = await Cart.findOne({
      userId: req.user.id,
      productId,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (nextQuantity <= 0) {
      await cartItem.deleteOne();

      return res.json({
        success: true,
        message: "Item removed from cart",
        quantity: 0,
      });
    }

    if (Number(product.stock || 0) < 1) {
      await cartItem.deleteOne();

      return res.status(400).json({
        success: false,
        message: "This product is out of stock",
      });
    }

    cartItem.quantity = Math.min(nextQuantity, Number(product.stock || 0));
    await cartItem.save();

    return res.json({
      success: true,
      message: "Quantity updated",
      quantity: cartItem.quantity,
      item: cartItem,
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

module.exports = {addToCart, getCartCount, getCartItems, removeFromCart, updateCartQuantity};