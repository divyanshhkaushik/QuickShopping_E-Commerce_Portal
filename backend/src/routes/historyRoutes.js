const express = require("express");

const router = express.Router();

const verifyUser = require("../middleware/authMiddleware");

const {
    addHistory,
    getHistory,
} = require("../controllers/historyController");

console.log("addHistory =", addHistory);
console.log("getHistory =", getHistory);

router.post("/add", verifyUser, addHistory);
router.get("/", verifyUser, getHistory);

module.exports = router;