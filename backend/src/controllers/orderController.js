const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount, couponCode, discountAmount, finalAmount } = req.body;

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

    const finalTotal = Number(finalAmount || totalAmount || normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
    const discountTotal = Number(discountAmount || 0);

    const order = await Order.create({
      userId: req.user.id,
      orderId,
      items: normalizedItems,
      shippingAddress,
      paymentMethod: paymentMethod || "UPI",
      totalAmount: Number(totalAmount || finalTotal),
      couponApplied: Boolean(couponCode),
      couponCode: couponCode || "",
      discountAmount: discountTotal,
      finalAmount: finalTotal,
    });

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: String(couponCode).trim().toUpperCase() });
      if (coupon) {
        coupon.usedCount = Number(coupon.usedCount || 0) + 1;
        await coupon.save();
      }
    }

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

    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled orders cannot be dispatched",
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

const cancelOrder = async (req, res) => {
  try {
    const { reasonType, reason, details } = req.body;

    if (!reasonType || !reason || !details) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason, reason type, and details are required",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "Cancelled" && order.cancellation?.requested) {
      return res.status(400).json({
        success: false,
        message: "This order is already cancelled",
      });
    }

    const isDispatched = order.status === "Dispatched";
    const customerMessage = isDispatched
      ? "Since your order is already dispatched, you can refuse delivery when our delivery partner arrives at your doorstep."
      : "Your order has been cancelled successfully.";

    if (!isDispatched) {
      for (const item of order.items || []) {
        const product = await Product.findById(item.productId);

        if (product) {
          product.stock = Number(product.stock || 0) + Number(item.quantity || 1);
          await product.save();
        }
      }

      order.status = "Cancelled";
    }

    order.cancellation = {
      requested: isDispatched,
      reasonType,
      reason,
      details,
      customerMessage,
      requestedAt: new Date(),
      resolvedAt: isDispatched ? undefined : new Date(),
    };

    await order.save();

    res.status(200).json({
      success: true,
      message: customerMessage,
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
  cancelOrder,
};
