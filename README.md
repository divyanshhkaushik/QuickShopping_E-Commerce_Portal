# QuickShopping

QuickShopping is a full-stack e-commerce application for both customers and sellers. It covers product discovery, cart and checkout, seller onboarding, order management, account management, coupon support, and legal/help pages.

## Overview

The project is split into two applications:

- `frontend/`: React + Vite client
- `backend/`: Node.js + Express API with MongoDB

The platform supports two main roles:

- Customer: browse, manage cart quantities, place orders, cancel orders, manage addresses, and update account details
- Seller: onboard as a seller, add and edit products, mark products active/inactive, handle orders, and manage coupons

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Tailwind CSS
- Zod
- Axios
- React Google Maps API
- Leaflet / React Leaflet

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication with cookies
- Cloudinary
- Multer
- Nodemailer
- Groq SDK

## Main Features

### Customer Features

- Registration and login
- Dashboard and category-based browsing
- Product detail pages
- Cart with quantity controls capped by stock
- Buy now flow with quantity controls in checkout
- Order placement and order history
- Order cancellation with reason capture
- Address management
- Browsing history
- Account profile editing
- Multi-step password reset with OTP flow
- FAQ and Terms and Conditions pages

### Seller Features

- Become a seller
- Add products with image uploads
- Edit and delete products
- Mark products `active` or `inactive`
- View seller orders and dispatch them
- Manage coupons and coupon analytics

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

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- npm
- MongoDB local instance or MongoDB Atlas
- Cloudinary account for product image hosting

## Environment Variables

Create or update `backend/.env` with values like:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quickshopping
JWT_SECRET=your_secret
GROQ_MODEL=llama-3.1-8b-instant

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_EMAIL=your_email@example.com
SMTP_APP_PASSWORD=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_FROM=your_email@example.com

OTP_DEBUG_MODE=true
```

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

## Running the Project

### Backend

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Useful Validation Commands

### Frontend build check

```bash
cd frontend
npm run build
```

### Backend wiring check

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

## Notes

- The backend uses cookie-based JWT auth, so frontend requests that need authentication use credentials.
- Product images are hosted through Cloudinary.
- OTP debug mode is useful while SMTP transport is not available during testing.
- Legal/help pages now include FAQ and Terms and Conditions.
## Images
<img width="1858" height="2538" alt="Screenshot_25-9-2026_194853_localhost" src="https://github.com/user-attachments/assets/c48d046b-0d4a-46b8-96f6-29270bd52505" /><img width="1870" height="2782" alt="Screenshot_25-9-2026_193939_localhost" src="https://github.com/user-attachments/assets/18e0f1f9-1726-40d7-a83d-41a9bb36b9c7" />
<img width="804" height="1327" alt="Screenshot_25-9-2026_194030_localhost" src="https://github.com/user-attachments/assets/a97d45b9-3ce0-4e48-b821-a83e140b87ee" />
<img width="1873" height="583" alt="Screenshot_25-9-2026_194055_localhost" src="https://github.com/user-attachments/assets/23a553e7-01d3-4cbc-aa1c-dc1aec5fb8fb" />
<img width="1863" height="2104" alt="Screenshot_25-9-2026_194119_localhost" src="https://github.com/user-attachments/assets/6be856d3-bf58-4597-8f16-0fe36b64c3d8" />
<img width="1864" height="4313" alt="Screenshot_25-9-2026_194139_localhost" src="https://github.com/user-attachments/assets/b2e7a259-fcc7-41b0-bcfb-ee797be74c82" />
<img width="1876" height="1308" alt="Screenshot_25-9-2026_19422_localhost" src="https://github.com/user-attachments/assets/b9025367-ccda-4199-915f-e9b42fb66c4c" />
<img width="1471" height="1849" alt="Screenshot_25-9-2026_194750_localhost" src="https://github.com/user-attachments/assets/39c0aef7-108d-4c4b-aa00-c5466ccdc0d2" />
<img width="1846" height="3284" alt="Screenshot_25-9-2026_194812_localhost" src="https://github.com/user-attachments/assets/bc5a8905-9d45-4ac8-8602-4fa5643bed3a" />
<img width="1843" height="1129" alt="Screenshot_25-9-2026_194832_localhost" src="https://github.com/user-attachments/assets/da5546d3-70fb-4fde-8c1e-e98019555f69" />
<img width="1861" height="2621" alt="image" src="https://github.com/user-attachments/assets/6707eb4f-df15-4693-b85d-cb40434c68c3" />
<img width="1836" height="1906" alt="image" src="https://github.com/user-attachments/assets/f5160a1c-de1b-4eff-8eca-00f0ecc00b3e" />



## License

This project is currently unlicensed unless otherwise specified.
