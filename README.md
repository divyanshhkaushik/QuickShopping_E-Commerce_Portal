# QuickShopping

QuickShopping is a full-stack e-commerce web application built for a smooth shopping experience for customers and sellers. The platform includes user authentication, product browsing, seller onboarding, cart management, order placement, and address management.

## Project Overview

This project is divided into two main parts:

- Frontend: React + Vite application for the user interface
- Backend: Node.js + Express API connected to MongoDB

The application supports two roles:

- Customer: browse products, view categories, manage cart, checkout, track orders, and save addresses
- Seller: become a seller, add products with images, view their inventory, and manage listings

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Leaflet / React Leaflet (map support for address-related features)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Cookie-based session handling
- Cloudinary for product image uploads
- Multer for multipart file uploads

## Features

- User registration and login
- JWT-based protected routes
- Customer and seller role support
- Seller onboarding flow
- Add, view, and delete products
- Product listing by category
- Product detail page
- Cart functionality with count and item management
- Order creation and order history
- Address management for users
- Browsing history tracking
- Cloudinary image uploads for products

## Repository Structure

```bash
E-Commerce/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   ├── cloudinary.js
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── cartController.js
│   │   │   ├── historyController.js
│   │   │   ├── orderController.js
│   │   │   └── productController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── upload.js
│   │   ├── models/
│   │   │   ├── Cart.js
│   │   │   ├── History.js
│   │   │   ├── Order.js
│   │   │   ├── Product.js
│   │   │   └── User.js
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       ├── cartRoutes.js
│   │       ├── historyRoutes.js
│   │       ├── orderRoutes.js
│   │       └── productRoutes.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── README.md
└── package.json (if present in root)
```

## Prerequisites

Before running the project, make sure you have:

- Node.js v18 or above
- npm or yarn
- MongoDB installed locally or a MongoDB Atlas cluster
- Cloudinary account for image uploads

## Environment Variables

Create a `.env` file in the `backend` directory with the following values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/quickshopping
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> Replace the values with your actual MongoDB and Cloudinary credentials.

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd E-Commerce
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Running the Application

### Start the backend

```bash
cd backend
npm run dev
```

The backend will run on:

```bash
http://localhost:5000
```

### Start the frontend

```bash
cd frontend
npm run dev
```

The frontend will run on:

```bash
http://localhost:5173
```

## API Endpoints

### Authentication

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT cookie
- `POST /api/auth/logout` — Logout user
- `GET /api/auth/addresses` — Get user addresses
- `POST /api/auth/address` — Add a new address
- `POST /api/auth/add-address` — Add a new address

### Products

- `PUT /api/products/become-seller` — Upgrade a customer to seller role
- `POST /api/products/add-product` — Add a product with uploaded images
- `GET /api/products/my-products` — Get current seller products
- `DELETE /api/products/:id` — Delete a seller product
- `GET /api/products` — Get all products or filter by category
- `GET /api/products/:id` — Get a product by ID

### Cart

- `GET /api/cart/count` — Get cart item count
- `POST /api/cart/add` — Add product to cart
- `GET /api/cart` — Get cart items
- `DELETE /api/cart/:id` — Remove item from cart

### Orders

- `POST /api/orders/create` — Create an order
- `GET /api/orders` — Get user order history

### Browsing History

- `POST /api/history/add` — Save product view history
- `GET /api/history` — Get user browsing history

## Default App Behavior

The app is designed as a full e-commerce flow where a user can:

1. Register or log in
2. Browse products and categories
3. Add items to the cart
4. Save delivery addresses
5. Proceed to checkout
6. Place an order
7. View past orders and browsing activity

Sellers can:

1. Register as a seller
2. Add product details and images
3. View product inventory
4. Remove listings as needed

## Notes

- The frontend and backend are configured to work together locally via CORS.
- The backend uses a cookie-based JWT token, so credentials must be enabled in browser requests.
- Product images are uploaded to Cloudinary, so Cloudinary credentials must be valid.

## License

This project is currently unlicensed unless otherwise specified in the repository.

## Contributing

Contributions are welcome. If you want to improve the platform, you can fork the repository, create a feature branch, and submit a pull request.

## Contact

For project questions or setup support, reach out to the repository owner or maintainer.
