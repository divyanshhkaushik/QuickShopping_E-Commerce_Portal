const History = require("../models/History");

const addHistory = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    await History.findOneAndDelete({
      userId: req.user.id,
      productId,
    });

    const history = await History.create({
      userId: req.user.id,
      productId,
    });

    console.log("Saved History:", history);

    return res.json({
      success: true,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await History.find({
      userId: req.user.id,
    })
      .populate("productId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
    addHistory,
    getHistory,
};