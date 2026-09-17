const Coupon = require("../models/Coupon");
const Product = require("../models/Product");

const calculateDiscount = (coupon, amount) => {
  const total = Number(amount || 0);

  if (!coupon || !coupon.couponType) {
    return 0;
  }

  if (coupon.couponType === "percentage") {
    return Math.min(total, (total * Number(coupon.discountValue || 0)) / 100);
  }

  return Math.min(total, Number(coupon.discountValue || 0));
};

const getSellerCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ sellerId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCoupon = async (req, res) => {
  try {
    const {
      code,
      couponType,
      discountValue,
      categoryIds,
      productIds,
      minOrderValue,
      usageLimit,
      startDate,
      expiryDate,
      isActive,
    } = req.body;

    const normalizedCode = String(code || "").trim().toUpperCase();

    if (!normalizedCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    if (!['percentage', 'fixed'].includes(couponType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon type",
      });
    }

    const discountNum = Number(discountValue || 0);

    if (discountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be greater than zero",
      });
    }

    const existingCoupon = await Coupon.findOne({
      sellerId: req.user.id,
      code: normalizedCode,
    });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: "Coupon code already exists for this seller",
      });
    }

    if (!startDate || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and expiry date are required",
      });
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      sellerId: req.user.id,
      couponType,
      discountValue: discountNum,
      categoryIds: Array.isArray(categoryIds) ? categoryIds : [],
      productIds: Array.isArray(productIds) ? productIds : [],
      minOrderValue: Number(minOrderValue || 0),
      usageLimit: Number(usageLimit || 1),
      usedCount: 0,
      startDate: new Date(startDate),
      expiryDate: new Date(expiryDate),
      isActive: isActive !== false,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      _id: req.params.id,
      sellerId: req.user.id,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const payload = req.body;

    if (payload.code) {
      coupon.code = String(payload.code).trim().toUpperCase();
    }

    if (payload.couponType) {
      coupon.couponType = payload.couponType;
    }

    if (payload.discountValue !== undefined) {
      coupon.discountValue = Number(payload.discountValue);
    }

    if (payload.categoryIds) {
      coupon.categoryIds = payload.categoryIds;
    }

    if (payload.productIds) {
      coupon.productIds = payload.productIds;
    }

    if (payload.minOrderValue !== undefined) {
      coupon.minOrderValue = Number(payload.minOrderValue || 0);
    }

    if (payload.usageLimit !== undefined) {
      coupon.usageLimit = Number(payload.usageLimit || 1);
    }

    if (payload.startDate) {
      coupon.startDate = new Date(payload.startDate);
    }

    if (payload.expiryDate) {
      coupon.expiryDate = new Date(payload.expiryDate);
    }

    if (payload.isActive !== undefined) {
      coupon.isActive = Boolean(payload.isActive);
    }

    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.findOneAndDelete({
      _id: req.params.id,
      sellerId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCouponAnalytics = async (req, res) => {
  try {
    const coupons = await Coupon.find({ sellerId: req.user.id });

    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter((coupon) => coupon.isActive).length;
    const totalRedemptions = coupons.reduce((sum, coupon) => sum + Number(coupon.usedCount || 0), 0);
    const totalDiscountGiven = coupons.reduce((sum, coupon) => {
      const value = Number(coupon.discountValue || 0);
      const usage = Number(coupon.usedCount || 0);
      return sum + (coupon.couponType === "percentage" ? value * usage : value * usage);
    }, 0);

    res.status(200).json({
      success: true,
      analytics: {
        totalCoupons,
        activeCoupons,
        totalRedemptions,
        totalDiscountGiven,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAvailableCouponsForProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const now = new Date();

    const coupons = await Coupon.find({
      sellerId: product.sellerId,
      isActive: true,
      startDate: { $lte: now },
      expiryDate: { $gte: now },
    }).sort({ discountValue: -1, createdAt: -1 });

    const eligibleCoupons = coupons.filter((coupon) => {
      const hasProductMatch = coupon.productIds?.length
        ? coupon.productIds.some((id) => String(id) === String(product._id))
        : true;

      const hasCategoryMatch = coupon.categoryIds?.length
        ? coupon.categoryIds.includes(product.category)
        : true;

      return hasProductMatch && hasCategoryMatch;
    });

    res.status(200).json({
      success: true,
      coupons: eligibleCoupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, productId, totalAmount, category } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const coupon = await Coupon.findOne({
      code: String(code).trim().toUpperCase(),
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    const now = new Date();

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: "Coupon inactive" });
    }

    if (coupon.startDate > now) {
      return res.status(400).json({ success: false, message: "Coupon not started yet" });
    }

    if (coupon.expiryDate < now) {
      return res.status(400).json({ success: false, message: "Coupon expired" });
    }

    if (Number(coupon.usedCount || 0) >= Number(coupon.usageLimit || 1)) {
      return res.status(400).json({ success: false, message: "Usage limit reached" });
    }

    if (Number(totalAmount || 0) < Number(coupon.minOrderValue || 0)) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value must be ₹${coupon.minOrderValue}`,
      });
    }

    if (productId) {
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      if (coupon.productIds?.length && !coupon.productIds.some((id) => String(id) === String(productId))) {
        return res.status(400).json({ success: false, message: "Product not eligible" });
      }

      if (coupon.categoryIds?.length && !coupon.categoryIds.includes(product.category)) {
        return res.status(400).json({ success: false, message: "Product category not eligible" });
      }
    }

    if (category && coupon.categoryIds?.length && !coupon.categoryIds.includes(category)) {
      return res.status(400).json({ success: false, message: "Category not eligible" });
    }

    const discountAmount = calculateDiscount(coupon, Number(totalAmount || 0));
    const finalAmount = Number(totalAmount || 0) - discountAmount;

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      coupon,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSellerCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponAnalytics,
  getAvailableCouponsForProduct,
  validateCoupon,
  calculateDiscount,
};
