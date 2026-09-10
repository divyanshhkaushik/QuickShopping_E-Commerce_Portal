const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");

const becomeSeller = async (req,res) => {
  try {
    const user =
      await User.findById(
        req.user.id
      );

    user.role = "seller";

    user.sellerInfo = req.body;

    await user.save();

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message:
        "Seller account activated",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

const addProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product images are required",
      });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const uploadedImage = await cloudinary.uploader.upload(
        file.path,
        {
          folder: "quickshopping-products",
        }
      );
      imageUrls.push(
        uploadedImage.secure_url
      );
    }

    const product = await Product.create({
      sellerId: req.user.id,
      productName: req.body.productName,
      description: req.body.description,
      category: req.body.category,
      brand: req.body.brand,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      images: imageUrls,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Product upload failed",
    });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      sellerId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.user.id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      productName,
      description,
      category,
      brand,
      price,
      stock,
    } = req.body;

    if (productName !== undefined) {
      product.productName = productName.trim();
    }

    if (description !== undefined) {
      product.description = description.trim();
    }

    if (category !== undefined) {
      product.category = category.trim();
    }

    if (brand !== undefined) {
      product.brand = brand.trim();
    }

    if (price !== undefined) {
      product.price = Number(price);
    }

    if (stock !== undefined) {
      product.stock = Number(stock);
    }

    if (req.files && req.files.length > 0) {
      const imageUrls = [];

      for (const file of req.files) {
        const uploadedImage = await cloudinary.uploader.upload(file.path, {
          folder: "quickshopping-products",
        });
        imageUrls.push(uploadedImage.secure_url);
      }

      product.images = imageUrls;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findOneAndDelete({
      _id: req.params.id,
      sellerId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category) {
      const safeCategory = category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.category = {
        $regex: new RegExp(`^${safeCategory}$`, "i"),
      };
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 });

    const uniqueProducts = products.filter((product, index, arr) => {
      const key = product?._id?.toString();
      return arr.findIndex((item) => item?._id?.toString() === key) === index;
    });

    res.status(200).json({
      success: true,
      products: uniqueProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const seller = await User.findById(product.sellerId).select("name sellerInfo");

    res.status(200).json({
      success: true,
      product,
      seller: seller || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

console.log("Inside authController");
console.log("getMyProducts =", getMyProducts);
console.log("deleteProduct =", deleteProduct);

module.exports = {
  becomeSeller,
  addProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
};