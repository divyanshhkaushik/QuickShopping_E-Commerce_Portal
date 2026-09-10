const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const normalizedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        continue;
      }

      const quantity = Number(item.quantity || 1);

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units available for ${product.productName}`,
        });
      }

      normalizedItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        productName: product.productName,
        image: product.images?.[0] || "",
        price: Number(product.price),
        quantity,
      });

      product.stock = product.stock - quantity;
      await product.save();
    }

    if (!normalizedItems.length) {
      return res.status(404).json({
        success: false,
        message: "No valid products found to place the order",
      });
    }

    const orderId = `QS-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;

    const order = await Order.create({
      userId: req.user.id,
      orderId,
      items: normalizedItems,
      shippingAddress,
      paymentMethod: paymentMethod || "UPI",
      totalAmount: Number(totalAmount || normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)),
    });

    const productIds = normalizedItems.map((item) => item.productId.toString());
    await Cart.deleteMany({
      userId: req.user.id,
      productId: { $in: productIds },
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.productId");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "items.sellerId": req.user.id })
      .sort({ createdAt: -1 });

    const sellerOrders = orders.map((order) => {
      const sellerItems = (order.items || []).filter(
        (item) => String(item.sellerId) === String(req.user.id)
      );

      return {
        ...order.toObject(),
        items: sellerItems,
      };
    });

    res.status(200).json({
      success: true,
      orders: sellerOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Placed", "Dispatched"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const isSellerForThisOrder = (order.items || []).some(
      (item) => String(item.sellerId) === String(req.user.id)
    );

    if (!isSellerForThisOrder) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus,
};
