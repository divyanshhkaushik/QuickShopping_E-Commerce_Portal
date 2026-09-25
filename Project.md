# Project

## Overview

QuickShopping is a full-stack e-commerce platform for customers and sellers. Customers can browse products, manage cart items, place orders, maintain addresses, track history, and manage their accounts. Sellers can onboard themselves, create and manage listings, update product visibility, handle orders, and manage coupons.

The project is split into two major parts:

- `frontend/`: React + Vite user interface
- `backend/`: Node.js + Express API with MongoDB

## Current Core Flows

### Customer

- Register and log in
- Browse dashboard and category pages
- Open product detail pages
- Add to cart with quantity controls capped by stock
- Buy now and adjust quantity at checkout
- Place orders and review order history
- Cancel orders or request cancellation after dispatch
- Manage saved addresses
- Update profile and reset password with OTP flow

### Seller

- Become a seller
- Add new products with image uploads
- Edit and delete products
- Mark products `active` or `inactive`
- Review seller orders and dispatch them
- Manage coupons and coupon analytics

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Tailwind CSS
- Zod
- React Google Maps API
- Leaflet / React Leaflet

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication with cookies
- Cloudinary for product image uploads
- Multer for multipart uploads
- Nodemailer for email-based flows
- Groq SDK for chatbot integration

## Important Features Implemented

- Product quantity controls on product detail, dashboard cards, and checkout
- Stock-aware cart behavior
- Seller product activation and inactivation
- Order cancellation with mandatory reason capture
- Dedicated pages for edit profile and password reset flow
- OTP debug mode for testing password reset without SMTP delivery
- FAQ page and Terms and Conditions page

## Notable Current Behavior

- Inactive products remain visible on customer listing pages but appear faded and cannot be opened or purchased.
- Password reset supports OTP debug mode through `OTP_DEBUG_MODE=true`, which returns the OTP in API responses for testing.
- Contact form is currently local-success only and not wired to active SMTP sending.

## Repository Structure

```text
E-Commerce/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── validation/
│   ├── package.json
│   └── vite.config.js
├── README.md
└── Project.md
```

## Backend Notes

- API base is exposed through `/api/*`
- Product APIs are under `/api/products`
- Cart APIs are under `/api/cart`
- Order APIs are under `/api/orders`
- Auth and account APIs are under `/api/auth`
- Chatbot API is under `/api/chatbot`

## Frontend Notes

- Main customer route entry is the dashboard at `/dashboard`
- Product details are opened through `/product/:id`
- Seller management lives under `/seller/*`
- Account pages include profile, password reset, orders, addresses, FAQ, and terms pages

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- npm
- MongoDB local instance or MongoDB Atlas
- Cloudinary account for product image hosting

## Environment Requirements

Backend `.env` should define values such as:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `SMTP_EMAIL`
- `SMTP_APP_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_FROM`
- `OTP_DEBUG_MODE`

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

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Validation Commands

Useful local checks already used in this project:

```bash
cd frontend
npm run build
```

```bash
cd backend
node -e "require('./src/app'); console.log('backend app loaded')"
```

## Main API Areas

### Auth and Account

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/profile`
- `PATCH /api/auth/profile`
- `POST /api/auth/password/request-otp`
- `POST /api/auth/password/verify-otp`
- `POST /api/auth/password/reset`
- `GET /api/auth/addresses`
- `POST /api/auth/address`

### Products

- `PUT /api/products/become-seller`
- `POST /api/products/add-product`
- `GET /api/products/my-products`
- `PATCH /api/products/:id/status`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/products`
- `GET /api/products/:id`

### Cart

- `GET /api/cart/count`
- `POST /api/cart/add`
- `PATCH /api/cart/item/:productId`
- `GET /api/cart`
- `DELETE /api/cart/:id`

### Orders

- `POST /api/orders/create`
- `GET /api/orders`
- `GET /api/orders/seller`
- `PATCH /api/orders/:id/status`
- `PATCH /api/orders/:id/cancel`

### Coupons

- Product coupon fetching and validation endpoints are available under `/api/coupons`

### History

- `POST /api/history/add`
- `GET /api/history`

## Current User Flows

### Customer Flow

1. Register or log in
2. Browse dashboard or category pages
3. Open product detail pages
4. Add to cart or buy now with quantity controls
5. Complete checkout
6. Track orders and submit cancellations when needed
7. Manage profile, password, and addresses

### Seller Flow

1. Become a seller
2. Add and manage product listings
3. Toggle product active/inactive state
4. Review and dispatch orders
5. Manage coupons and inventory visibility

## Current Testing Note

Password reset supports a debug OTP mode through `OTP_DEBUG_MODE=true`, which returns the OTP in the API response for testing instead of relying on SMTP delivery.