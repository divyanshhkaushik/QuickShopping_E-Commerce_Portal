const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../backend/src/models/Product");

dotenv.config();

const products = [
  // Electronics
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Sony WH-1000XM5 Headphones",
    description: "Premium wireless noise-cancelling headphones.",
    category: "Electronics",
    brand: "Sony",
    price: 24999,
    stock: 20,
    images: [],
    status: "active",
  },
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Samsung Crystal 4K Smart TV",
    description: "55-inch Ultra HD smart television.",
    category: "Electronics",
    brand: "Samsung",
    price: 54999,
    stock: 10,
    images: [],
    status: "active",
  },

  // Smart Home
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Amazon Echo Dot",
    description: "Smart speaker with Alexa support.",
    category: "Smart Home",
    brand: "Amazon",
    price: 4499,
    stock: 25,
    images: [],
    status: "active",
  },
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Smart Security Camera",
    description: "Wi-Fi enabled HD indoor security camera.",
    category: "Smart Home",
    brand: "Xiaomi",
    price: 2999,
    stock: 15,
    images: [],
    status: "active",
  },

  // Computers
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Dell Inspiron 15 Laptop",
    description: "Intel Core i5 laptop with 16GB RAM.",
    category: "Computers",
    brand: "Dell",
    price: 58999,
    stock: 12,
    images: [],
    status: "active",
  },
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Logitech MX Master 3S",
    description: "Professional wireless productivity mouse.",
    category: "Computers",
    brand: "Logitech",
    price: 8999,
    stock: 30,
    images: [],
    status: "active",
  },
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard.",
    category: "Computers",
    brand: "Redragon",
    price: 3999,
    stock: 18,
    images: [],
    status: "active",
  },

  // Men's Fashion
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Levi's Slim Fit Jeans",
    description: "Comfortable stretch denim jeans.",
    category: "Men's Fashion",
    brand: "Levi's",
    price: 2499,
    stock: 35,
    images: [],
    status: "active",
  },
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Nike Air Max Sneakers",
    description: "Stylish and comfortable sneakers.",
    category: "Men's Fashion",
    brand: "Nike",
    price: 7999,
    stock: 20,
    images: [],
    status: "active",
  },

  // Women's Fashion
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Floral Summer Dress",
    description: "Elegant and lightweight floral dress.",
    category: "Women's Fashion",
    brand: "Zara",
    price: 2999,
    stock: 25,
    images: [],
    status: "active",
  },
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Women's Handbag",
    description: "Spacious premium handbag.",
    category: "Women's Fashion",
    brand: "Lavie",
    price: 1999,
    stock: 30,
    images: [],
    status: "active",
  },
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Casual High Heels",
    description: "Comfortable heels for daily wear.",
    category: "Women's Fashion",
    brand: "Metro",
    price: 2499,
    stock: 18,
    images: [],
    status: "active",
  },

  // Home & Kitchen
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Prestige Induction Cooktop",
    description: "Fast and efficient induction cooking.",
    category: "Home & Kitchen",
    brand: "Prestige",
    price: 2499,
    stock: 20,
    images: [],
    status: "active",
  },
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Pigeon Electric Kettle",
    description: "1.5L electric kettle with auto shut-off.",
    category: "Home & Kitchen",
    brand: "Pigeon",
    price: 999,
    stock: 40,
    images: [],
    status: "active",
  },

  // Beauty & Personal Care
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Mamaearth Face Wash",
    description: "Daily-use natural face wash.",
    category: "Beauty & Personal Care",
    brand: "Mamaearth",
    price: 299,
    stock: 100,
    images: [],
    status: "active",
  },
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Philips Beard Trimmer",
    description: "Cordless beard trimmer with adjustable settings.",
    category: "Beauty & Personal Care",
    brand: "Philips",
    price: 1499,
    stock: 50,
    images: [],
    status: "active",
  },

  // Mobiles & Accessories
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Samsung Galaxy S24",
    description: "AI-powered flagship Android smartphone.",
    category: "Mobiles & Accessories",
    brand: "Samsung",
    price: 69999,
    stock: 15,
    images: [],
    status: "active",
  },
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Apple iPhone 16",
    description: "Latest Apple smartphone with advanced cameras.",
    category: "Mobiles & Accessories",
    brand: "Apple",
    price: 89999,
    stock: 12,
    images: [],
    status: "active",
  },
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Spigen Mobile Case",
    description: "Shockproof protective mobile back cover.",
    category: "Mobiles & Accessories",
    brand: "Spigen",
    price: 999,
    stock: 60,
    images: [],
    status: "active",
  },
  {
    sellerId: "6a8c4aceb2b285f580127416",
    productName: "Boat 20W Fast Charger",
    description: "USB-C fast charging adapter.",
    category: "Mobiles & Accessories",
    brand: "Boat",
    price: 699,
    stock: 70,
    images: [],
    status: "active",
  }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Product.insertMany(products);
        console.log("✅ 20 Products Seeded Successfully");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedProducts();