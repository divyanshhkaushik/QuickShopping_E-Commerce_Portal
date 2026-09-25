const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      label: String,
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      default: "UPI",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    couponApplied: {
      type: Boolean,
      default: false,
    },
    couponCode: {
      type: String,
      default: "",
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Placed",
    },
    cancellation: {
      requested: {
        type: Boolean,
        default: false,
      },
      reasonType: {
        type: String,
        default: "",
      },
      reason: {
        type: String,
        default: "",
      },
      details: {
        type: String,
        default: "",
      },
      customerMessage: {
        type: String,
        default: "",
      },
      requestedAt: {
        type: Date,
      },
      resolvedAt: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
