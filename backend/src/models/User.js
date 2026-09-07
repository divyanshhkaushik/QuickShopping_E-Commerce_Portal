const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    label: {
    type: String,
    default: "Home",
    },

    addressLine1: {
    type: String,
    required: true,
    },

    addressLine2: {
    type: String,
    },

    city: {
    type: String,
    required: true,
    },

    state: {
    type: String,
    required: true,
    },

    pincode: {
    type: String,
    required: true,
    },

    country: {
    type: String,
    default: "India",
    },

    latitude: Number,

    longitude: Number,

    isDefault: {
    type: Boolean,
    default: false,
    },
  }
);
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
  type: String,
  enum: ["customer", "seller"],
  default: "customer",
  },

  sellerInfo: {
    storeName: String,
    businessType: String,
    gstNumber: String,
    pickupAddress: String,
    bankAccountHolder: String,
    accountNumber: String,
    ifscCode: String,
  },

    addresses: [addressSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);