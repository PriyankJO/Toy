# 🧸 ToyWonder — Animated MERN Stack Kids Toy Store

ToyWonder is a complete, modern, responsive e-commerce web application for children's toys built on the **MERN** stack (MongoDB, Express.js, React.js, Node.js). It features colorful product cards, floating toy animations, interactive shopping cart & checkout with coupon validation, Cash on Delivery & Razorpay payment flows, customer order tracking, and an extensive administration panel with Recharts business intelligence analytics.

---

## 🎨 Theme & Visual Palette

| Palette Element | Color Hex | Visual Purpose |
|---|---|---|
| **Primary** | `#7657E8` | Playful Purple brand identity, headers, main action CTAs |
| **Secondary** | `#62C8F5` | Sky Blue accents, pill badges, subtle gradients |
| **Accent** | `#FF786E` | Coral highlight, discounts, wishlist hearts |
| **Highlight** | `#FFD85E` | Sunshine Yellow stars, best-seller tags, sparkles |
| **Background**| `#FFFDF8` | Warm White soft paper background |
| **Mint Green** | `#8EE5BE` | In-stock and child-safe certification badges |
| **Main Text** | `#25253A` | Deep contrast readable typography |

---

## 🚀 Key Features

### Customer Experience
- **Interactive Home Page:**
  - Hero banner with headline *"Big Smiles Start with Little Toys!"*, floating 3D toy illustrations, and trust badges.
  - Shop by Category (8 animated toy collection cards).
  - Featured Toys, Best Sellers, and Age-based recommendation tabs (0-2 Yrs, 3-5 Yrs, 6-8 Yrs, 9-12 Yrs).
  - Limited-time promotional discount festival banner (`WONDER20`).
  - Real customer testimonials and parent club newsletter.
- **Product Catalog & Filtering:**
  - Multi-faceted filters: category, age group, price range slider/inputs, in-stock only, and discount-only.
  - Sorting: newest arrivals, popularity, rating, price low-to-high, and price high-to-low.
  - Real-time search bar with auto-suggestions dropdown.
  - Quick View modal for previewing toy details and instant cart additions without leaving the page.
- **Product Details:**
  - Image gallery with thumbnail selector.
  - EN71 and ASTM child-safety certification notes.
  - Live stock availability indicator (prevents ordering beyond available inventory).
  - Customer review submission with interactive star rating.
  - Related product recommendations.
- **Cart & Checkout:**
  - Server-calculated subtotals, item totals, and delivery charges (Free shipping over ₹499).
  - Promotional coupon validator with instant discount feedback (`WONDER20`, `TOYFEST100`, `SUPERKID`).
  - Cash on Delivery (COD) and Razorpay online payments with signature verification.
  - Confetti celebration animation upon placing an order.
- **Customer Account:**
  - My Profile: update personal details and change password.
  - Saved Address Book: manage multiple delivery addresses with default selection.
  - My Orders: list orders, visual progress stepper (*Pending → Confirmed → Processing → Shipped → Delivered*), and order cancellation with inventory restoration.
  - Wishlist: persistent favorites list.

### Admin Dashboard (`/admin`)
- **Business Intelligence Analytics:**
  - KPI Summary cards: Total Revenue, Total Orders, Active Products, Customers, Pending Orders, and Low Stock alerts.
  - Interactive Recharts graphs: Monthly Sales Area Chart and Category Distribution Pie Chart.
- **Product Management:**
  - Searchable, filterable catalog table with active/draft toggles.
  - Add & Edit toy products with image upload (Multer) or image URLs, specifications, and safety notes.
- **Category Management:**
  - Manage 8 core toy categories, descriptions, and brand colors.
- **Order Management:**
  - Order search and status filter.
  - Guarded lifecycle status transitions preventing invalid state changes and protecting stock.
- **Customer Management:**
  - Customer directory with total orders and lifetime spend.
  - Account suspension & activation controls.
- **Inventory Management:**
  - Real-time stock overview with critical low-stock warnings (&lt; 5 units).
  - Quick stock adjustment with audit logs in `InventoryMovement`.
- **Coupons & Discounts:**
  - Create percentage or fixed discount coupons with minimum order values, caps, and expiry dates.
- **Sales Reports:**
  - Financial statements, Average Order Value (AOV), and printable/PDF export view.

---

## 🛠️ Technology Stack

- **Frontend:**
  - React 19 / Vite
  - React Router DOM v7
  - Bootstrap 5 + Custom Design Tokens CSS
  - Framer Motion (floating animations, smooth transitions)
  - Lucide React (feather icons)
  - Recharts (admin charts)
  - React Hot Toast (toast notifications)
  - Canvas Confetti (celebratory order placement)
  - Axios (API requests with JWT bearer interceptor)
- **Backend:**
  - Node.js & Express.js
  - MongoDB & Mongoose ODM
  - JSON Web Tokens (JWT) & bcryptjs password hashing
  - Multer (local image file uploads)
  - Razorpay SDK (online payment orders and HMAC-SHA256 signature verification)
  - Express centralized error handling & input validation
- **Testing:**
  - Node.js native test runner (`node --test tests/**/*.test.js`)

---

## 📂 Project Structure

```
Toyshop-project/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── admin/               # Admin Panel Pages & Layout
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Coupons.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   ├── Products.jsx
│   │   │   └── Reports.jsx
│   │   ├── components/
│   │   │   ├── common/          # ProductCard, FloatingDecoration, Modals, Spinners
│   │   │   └── layout/          # Navbar, Footer, PublicLayout
│   │   ├── context/             # AuthContext, CartContext, WishlistContext
│   │   ├── pages/               # Home, Shop, ProductDetails, Cart, Checkout, Login, etc.
│   │   ├── services/            # Axios API Services (auth, product, cart, order, admin)
│   │   ├── index.css            # Custom Design System, Colors, Keyframes
│   │   ├── App.jsx              # Routes & Protected Route Guards
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js           # Vite dev server with proxy to backend
│
├── server/                      # Node.js + Express + MongoDB Backend
│   ├── src/
│   │   ├── config/              # MongoDB connection
│   │   ├── controllers/         # Auth, Product, Cart, Order, Payment, Admin, Coupon
│   │   ├── middleware/          # Auth JWT verify, Role check, Multer upload, Error handler
│   │   ├── models/              # User, Product, Category, Cart, Order, Review, Coupon, Movement
│   │   ├── routes/              # Express REST API routes
│   │   ├── utils/               # Database Seed Script (seed.js)
│   │   ├── app.js               # Express application configuration
│   │   └── server.js            # Server listener
│   ├── tests/                   # Automated backend test suite
│   ├── .env                     # Server environment variables
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (verified on v22)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

### 2. Backend Setup & Database Seeding

Open a terminal in the `server` folder:

```bash
cd server
npm install

# Populate MongoDB with 8 categories, 24 toy products, demo coupons, orders, and users:
npm run seed

# Run automated tests:
npm test

# Start the backend server (runs on http://localhost:5000):
npm run dev
```

### 3. Frontend Setup

Open a second terminal in the `client` folder:

```bash
cd client
npm install

# Start Vite frontend (runs on http://localhost:5173):
npm run dev
```

Visit **`http://localhost:5173/`** in your browser to experience ToyWonder!

---

## 🔑 Demo Login Credentials

The seed script creates the following pre-configured test accounts (also accessible with **1-click quick login buttons** on the `/login` page):

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@toywonder.com` | `Admin@123` | Full access to `/admin` dashboard, products CRUD, inventory, orders, coupons |
| **Customer 1** | `alice@example.com` | `Customer@123` | Browsing, shopping cart, placing orders, wishlist, order tracking |
| **Customer 2** | `rahul@example.com` | `Customer@123` | Secondary customer account with pre-seeded orders |

### Active Promotional Coupons for Testing

- **`WONDER20`** — 20% discount on orders above ₹500
- **`TOYFEST100`** — Flat ₹100 instant cash discount on orders above ₹799
- **`SUPERKID`** — 15% discount on orders above ₹300

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a customer (enforces customer role)
- `POST /api/auth/login` — Login user or admin, returns JWT
- `GET /api/auth/me` — Get current profile (Protected)
- `PATCH /api/auth/profile` — Update name, phone, avatar (Protected)
- `PATCH /api/auth/change-password` — Change password (Protected)
- `POST /api/auth/addresses` — Add shipping address (Protected)
- `DELETE /api/auth/addresses/:id` — Delete address (Protected)

### Products (`/api/products`)
- `GET /api/products` — Catalog query with `q`, `category`, `ageGroup`, `minPrice`, `maxPrice`, `inStock`, `hasDiscount`, `sort`, `page`, `limit`
- `GET /api/products/featured` — Homepage featured, best-sellers, new arrivals, special offers
- `GET /api/products/:idOrSlug` — Single product details with related toys
- `POST /api/products` — Create product (Admin only)
- `PATCH /api/products/:id` — Update product (Admin only)
- `DELETE /api/products/:id` — Delete product (Admin only)

### Categories (`/api/categories`)
- `GET /api/categories` — Get 8 categories with live item counts
- `POST /api/categories` — Create category (Admin only)
- `PATCH /api/categories/:id` — Update category (Admin only)
- `DELETE /api/categories/:id` — Delete category (Admin only)

### Cart (`/api/cart`)
- `GET /api/cart` — Get authenticated user's calculated cart
- `POST /api/cart/items` — Add product to cart with stock validation
- `PATCH /api/cart/items/:itemId` — Update quantity with stock limit check
- `DELETE /api/cart/items/:itemId` — Remove item
- `DELETE /api/cart` — Clear cart

### Orders & Payments (`/api/orders`, `/api/payments`)
- `POST /api/orders` — Create order (server-side price recalculation & stock deduction)
- `GET /api/orders/my-orders` — Get logged-in user's orders
- `GET /api/orders/:id` — Get single order tracking details
- `POST /api/orders/:id/cancel` — Cancel order & restore inventory
- `POST /api/payments/razorpay/order` — Create Razorpay order
- `POST /api/payments/razorpay/verify` — Verify Razorpay HMAC-SHA256 signature

### Coupons (`/api/coupons`)
- `POST /api/coupons/validate` — Validate code against subtotal, returns discount amount
- `GET /api/coupons/admin` — List all coupons (Admin only)
- `POST /api/coupons/admin` — Create coupon (Admin only)
- `DELETE /api/coupons/admin/:id` — Delete coupon (Admin only)

### Admin Intelligence (`/api/admin`)
- `GET /api/admin/dashboard/stats` — Revenue, orders, products, customers, low stock
- `GET /api/admin/dashboard/sales` — Monthly revenue aggregation for Recharts
- `GET /api/admin/dashboard/category-sales` — Category distribution for PieChart
- `GET /api/admin/orders` — Search, filter, and paginate orders
- `PATCH /api/admin/orders/:id/status` — Guarded status transition update
- `GET /api/admin/customers` — Customer spend overview & account status
- `PATCH /api/admin/customers/:id/status` — Suspend/activate account
- `GET /api/admin/inventory/movements` — Stock audit movement records
- `POST /api/admin/inventory/adjust` — Quick manual stock adjustment
- `POST /api/upload` — Multer multi-image upload endpoint

---

## 🚢 Deployment Guidelines

### Frontend (Vercel / Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Environment variable: `VITE_API_URL` pointing to your hosted backend API URL.

### Backend (Render / Railway)
1. Build command: `npm install`
2. Start command: `node src/server.js`
3. Configure environment variables in the host dashboard:
   - `MONGO_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Random secure string
   - `CLIENT_URL`: URL of the deployed frontend
   - `NODE_ENV`: `production`

---

## 📜 License
Created for ToyWonder Kids E-Commerce Platform. Built with care for joyful play!
