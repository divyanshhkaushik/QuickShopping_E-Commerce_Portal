require("https").globalAgent.options.rejectUnauthorized = false;
const express = require("express");
const cors = require("cors"); 
const cookieParser = require("cookie-parser"); // Import cookie-parser
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const historyRoutes = require("./routes/historyRoutes"); // Import history routes
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(cookieParser()); // Use cookie-parser

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));  //Enable CORS so frontend can communicate with backend
app.use(express.json()); //Parse JSON request bodies

app.get("/", (req, res) => {
  res.send("QuickShopping Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/history", historyRoutes); 
app.use("/api/orders", orderRoutes);
module.exports = app;