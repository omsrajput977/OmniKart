# 🏛️ OmniKart • The Art of Living, Curated

> An editorial lifestyle & curated design e-commerce web platform engineered with the **MERN** stack (MongoDB, Express, React 19, Node.js), powered by **Tailwind CSS v4**, **Redux Toolkit**, **Cloudinary**, and **Razorpay Test-Mode Payment Gateway**.

[![Live Production Demo](https://img.shields.io/badge/Live%20Demo-omnikart--web.onrender.com-BA5D38?style=for-the-badge&logo=render&logoColor=white)](https://omnikart-web.onrender.com/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-1E1B18?style=for-the-badge&logo=github&logoColor=white)](https://github.com/omsrajput977/OmniKart)

🌐 **Live Application**: [https://omnikart-web.onrender.com/](https://omnikart-web.onrender.com/)  
⚙️ **Backend API**: [https://omnikart-api.onrender.com/](https://omnikart-api.onrender.com/)

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Highlights & Architecture](#-key-highlights--architecture)
3. [Technology Stack](#-technology-stack)
4. [Step-by-Step Project Evolution](#-step-by-step-project-evolution)
5. [Directory & File Structure](#-directory--file-structure)
6. [Backend Implementation Details](#-backend-implementation-details)
   - [Database Schemas & Models](#database-schemas--models)
   - [API Reference](#api-reference)
   - [Razorpay Payment Lifecycle](#razorpay-payment-lifecycle)
7. [Frontend Implementation Details](#-frontend-implementation-details)
   - [Design System & "AURA" Aesthetic](#design-system--aura-aesthetic)
   - [Routing Table & Page Architecture](#routing-table--page-architecture)
   - [State Management (Redux & Auth Context)](#state-management-redux--auth-context)
8. [Security & Data Integrity Principles](#-security--data-integrity-principles)
9. [Local Development & Setup Guide](#-local-development--setup-guide)
10. [Postman API Test Plan](#-postman-api-test-plan)

---

## 🌟 Project Overview

**OmniKart** (formerly *ShopKart*) is a production-grade full-stack e-commerce web application designed around the concept of an **"everything store" with high-end editorial curation**. 

Instead of generic grid-based retail software, OmniKart pairs a warm, minimalist Japandi/linen aesthetic (*AURA Design Language*) with enterprise-grade backend engineering:
- **Server-Authoritative Pricing**: Total amounts are strictly recomputed on the server from current MongoDB records, preventing frontend price tampering.
- **Atomic Stock Management**: Inventory is verified at checkout and decremented atomically only upon verified cryptographic payment signatures.
- **Cryptographic Payment Verification**: Full integration with Razorpay test mode using HMAC-SHA256 signature verification.
- **Cloud Media Pipeline**: Direct file stream handling via Multer and cloud storage via Cloudinary SDK.
- **Global Reactive State**: Synchronized customer cart and wishlist using Redux Toolkit and React Context with HttpOnly authentication cookies.

---

## 🛡️ Key Highlights & Architecture

```
   ┌─────────────────────────────────────────────────────────────┐
   │                  OmniKart Client (Vite + React 19)          │
   │   - AURA Design System (Cormorant Garamond + Plus Jakarta)  │
   │   - Redux Toolkit Cart State + Auth Context                 │
   │   - Razorpay Checkout SDK v1 Integration                    │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ HTTP + Cookies (CORS with credentials)
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                  OmniKart REST API (Express 5 + Node)        │
   │   - Customer Auth (JWT + bcrypt + Cookie)                   │
   │   - Product & Category Catalog                              │
   │   - Server-Authoritative Cart & Wishlist Engines            │
   │   - Razorpay Order Factory & HMAC-SHA256 Verifier           │
   └───────────────┬─────────────────────────────┬───────────────┘
                   │                             │
                   ▼                             ▼
   ┌───────────────────────────────┐ ┌───────────────────────────┐
   │      MongoDB Atlas Cluster    │ │    Cloudinary Media CDN   │
   │  - Customers & Sub-documents  │ │  - Product Imagery        │
   │  - Products & Inventory Stock │ │  - Secure URL Delivery    │
   │  - Immutable Orders Snapshot  │ └───────────────────────────┘
   └───────────────────────────────┘
```

---

## 💻 Technology Stack

### Frontend
- **Library/Framework**: [React 19](https://react.dev/) with [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Typography**: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) (Editorial Serif) & [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Geometric UI)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **State Management**: [@reduxjs/toolkit v2](https://redux-toolkit.js.org/) & [react-redux v9](https://react-redux.js.org/)
- **HTTP Client**: [Axios](https://axios-http.com/) configured with standard interceptors and `withCredentials: true`
- **Checkout SDK**: Razorpay Checkout Modal (`checkout.js`)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Server Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/)
- **Authentication**: [jsonwebtoken (JWT)](https://jwt.io/) & [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Media Uploads**: [Multer](https://github.com/expressjs/multer) & [Cloudinary SDK v2](https://cloudinary.com/)
- **Payment Gateway**: Official [Razorpay SDK](https://razorpay.com/docs/) & Node.js Native `crypto` (HMAC SHA-256)
- **CORS & Cookies**: `cors` and `cookie-parser`

---

## 🔨 Step-by-Step Project Evolution

### Phase 1 — Project Initialization & Core Architecture
1. **Repository Setup**: Initialized separate `/backend` (Express) and `/frontend` (Vite + React) folders with `.gitignore` and ES module support.
2. **Database Modeling**: Designed MongoDB schemas for `Customer` (with embedded cart/wishlist subdocuments) and `Product` (with categories, pricing, stock count, and Cloudinary URLs).
3. **Authentication Pipeline**: Implemented signup and login with salt-hashed passwords via `bcrypt`, generating signed JWTs passed inside HTTP-only cookies to thwart XSS attacks.
4. **Cloudinary Asset Storage**: Configured Multer memory buffers and a Cloudinary upload utility to enable high-resolution product imagery delivery.

### Phase 2 — Catalog, Wishlist & Cart Engines
1. **Catalog & Filtering**: Developed paginated product listing with debounce search queries and category dropdown filters.
2. **Wishlist Sync**: Provided one-click toggle actions allowing registered users to save prospective items to their registry.
3. **Reactive Shopping Cart**: Built server-side cart controllers supporting unit incrementation, decrementation, and automatic item purging when quantity hits zero.
4. **Redux Toolkit Architecture**: Connected the frontend cart to a global Redux slice (`cartSlice.js`), keeping item counts, subtotal computations, and badge counters synchronized across all routes.

### Phase 3 — Razorpay Payment Gateway & Order Lifecycle
1. **Order Model Architecture**: Created an independent `Order` collection featuring product snapshot subdocuments (`name`, `price`, `quantity`, `image`), shipping address schema, status tracking (`PENDING`, `PLACED`, `SHIPPED`, `DELIVERED`, `CANCELLED`), and payment metadata (`razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`).
2. **Server-Side Order Creation (`/orders/create-payment-order`)**:
   - Evaluated active cart items directly against real-time database stock levels.
   - Recomputed prices independently from server database records.
   - Generated an internal `PENDING` order document.
   - Instantiated a matching Razorpay order via the Razorpay Node SDK in lowest currency units (paise).
3. **Cryptographic Payment Verification (`/orders/verify-payment`)**:
   - Captured the returned Razorpay response (`razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`).
   - Constructed the HMAC SHA-256 digest using `RAZORPAY_KEY_SECRET`.
   - On signature match: marked order as `PAID` and `PLACED`, decremented product inventory using atomic `$inc`, and cleared the customer's cart.

### Phase 4 — Aesthetic Evolution & Rebranding to OmniKart
1. **Brand Identity Transition**: Transformed the generic "ShopKart" moniker into **OmniKart** — an expansive yet curated "everything store".
2. **"AURA" Editorial Design System**:
   - Replaced default colors with a warm oatmeal/linen canvas (`#FAF7F2`), warm sandstone card surfaces (`#F4EFEA`), hairline borders (`#EAE4DC`), and matte black interactive elements (`#1E1B18`).
   - Added warm terracotta/rust CTA accents (`#BA5D38`) and status indicators.
   - Paired classical serif headlines (*Cormorant Garamond*) with modern geometric interfaces (*Plus Jakarta Sans*).
3. **Dedicated Landing Page (`/` and `/landing`)**:
   - Created a pre-login landing experience with an announcement bar, brand statement ("The Art of Living, Curated."), press endorsements (Vogue, AD, Wirecutter, GQ), and curated category showcases.
4. **Complete Page Overhaul**:
   - Redesigned `/login` and `/register` with a 50/50 split luxury aesthetic.
   - Redesigned `/home` into a personalized Member Lounge displaying tier status ("Omni Circle: Gold Member").
   - Redesigned `/cart` with a complimentary shipping progress bar.
   - Redesigned `/checkout` with address validation, order snapshots, and embedded Razorpay modal.
   - Redesigned `/order-success/:id` and `/orders` for luxury receipt archives.
5. **Custom Insignia Favicon**: Designed an editorial Didone serif "O" badge with a terracotta orbital gem in pure vector SVG.

---

## 📂 Directory & File Structure

```
ShopKart/
├── backend/
│   ├── controllers/
│   │   ├── cart.controllers.js       # Add, update quantity, remove, and get customer cart
│   │   ├── customer.controller.js   # Register, login, logout, getProfile
│   │   ├── order.controllers.js      # createPaymentOrder, verifyPayment, getMyOrders, getOrderById
│   │   ├── product.controller.js     # Create product (Cloudinary), get all with filters, get single
│   │   └── wishlist.controller.js   # Add, remove, and fetch saved registry items
│   ├── middlewares/
│   │   ├── auth.middleware.js        # Validates JWT cookie and attaches req.customer
│   │   └── upload.middleware.js      # Multer memory storage configuration
│   ├── models/
│   │   ├── customer.model.js         # Customer schema with embedded cart & wishlist
│   │   ├── order.model.js            # Order schema with address, item snapshots & payment info
│   │   └── product.model.js          # Product schema with price, stock, category & image
│   ├── routes/
│   │   ├── cart.routes.js            # Routes for /cart endpoints
│   │   ├── customer.routes.js        # Routes for /customers endpoints
│   │   ├── order.routes.js           # Routes for /orders endpoints
│   │   ├── product.routes.js         # Routes for /products endpoints
│   │   └── wishlist.routes.js        # Routes for /wishlist endpoints
│   ├── utils/
│   │   ├── cloudinary.js             # Cloudinary SDK credentials configuration
│   │   ├── generateToken.js          # Signs JWT token and sets cookie
│   │   ├── razorpay.js               # Razorpay client initialized with Key ID and Secret
│   │   └── uploadToCloudinary.js     # Stream buffer uploader to Cloudinary
│   ├── .env                          # Secret environment variables (DB, JWT, Cloudinary, Razorpay)
│   ├── index.js                      # Express server entry point, MongoDB connection & CORS setup
│   └── package.json                  # Backend dependencies and scripts
│
└── frontend/
    └── vite-project/
        ├── public/
        │   ├── favicon.svg           # Custom OmniKart editorial insignia favicon
        │   └── icons.svg             # SVG icon sprites
        ├── src/
        │   ├── components/
        │   │   ├── Navbar.jsx        # Luxury tracked OMNIKART header with search & badges
        │   │   ├── ProductCard.jsx   # Curated product card with heart wishlist & add-to-cart
        │   │   ├── ProtectedRoute.jsx# Auth guard redirecting unauthenticated users to /login
        │   │   ├── PublicRoute.jsx   # Auth guard redirecting logged-in users to /home
        │   │   ├── SearchBar.jsx     # Debounced global search component
        │   │   └── WishlistCard.jsx  # Registry item card with stock count & quick delete
        │   ├── context/
        │   │   └── AuthContent.jsx   # Customer auth provider, login/logout logic & session restore
        │   ├── pages/
        │   │   ├── Cart.jsx          # Shopping bag with free shipping bar & counter controls
        │   │   ├── Checkout.jsx      # Shipping form validation & Razorpay checkout modal
        │   │   ├── Home.jsx          # Member lounge, gold tier badge & personalized feeds
        │   │   ├── Landing.jsx       # Public landing page with hero, press bar & category showcase
        │   │   ├── Login.jsx         # 50/50 split luxury login with social buttons
        │   │   ├── OrderSuccess.jsx  # Order confirmation receipt with reference number
        │   │   ├── Orders.jsx        # Purchase history archive with courier dispatch status
        │   │   ├── ProductDetails.jsx# Detailed editorial view with gallery & swatches
        │   │   ├── Products.jsx      # Filterable product catalog with category chips
        │   │   ├── Register.jsx      # 50/50 split luxury member registration
        │   │   └── Wishlist.jsx      # Curated personal registry collection
        │   ├── redux/
        │   │   ├── cartSlice.js      # Async thunks (fetch, add, update, remove) & state reducers
        │   │   └── store.js          # Centralized Redux store configuration
        │   ├── services/
        │   │   └── api.js            # Axios instance configured with baseURL and withCredentials
        │   ├── App.jsx               # Route mapping for all public & protected pages
        │   ├── index.css             # Tailwind v4 configuration, font variables & theme utilities
        │   └── main.jsx              # React 19 root initialization with Redux Provider
        ├── index.html                # HTML entry point, Google Fonts & viewport meta
        ├── package.json              # Frontend dependencies and build scripts
        └── vite.config.js            # Vite build configuration with Tailwind plugin
```

---

## ⚙️ Backend Implementation Details

### Database Schemas & Models

#### 1. Customer Schema (`backend/models/customer.model.js`)
- `fullName`: String (Required)
- `email`: String (Required, Unique, Lowercase)
- `password`: String (Bcrypt hashed, minimum 6 characters)
- `phone`: String (Optional)
- `cart`: Array of `{ product: ObjectId (ref: Product), quantity: Number }`
- `wishlist`: Array of `{ product: ObjectId (ref: Product) }`
- `timestamps`: `true`

#### 2. Product Schema (`backend/models/product.model.js`)
- `name`: String (Required, Trimmed)
- `description`: String (Required)
- `price`: Number (Required, in INR)
- `category`: String (Enum: `Living`, `Tech`, `Lighting`, `Wellness`, `Fashion`, `Books`, etc.)
- `image`: String (Cloudinary secure HTTPS URL)
- `stock`: Number (Required, Non-negative)
- `timestamps`: `true`

#### 3. Order Schema (`backend/models/order.model.js`)
- `customer`: ObjectId (ref: `Customer`, Required)
- `items`: Snapshot subdocuments:
  - `product`: ObjectId (ref: `Product`)
  - `name`: String
  - `price`: Number (Locked snapshot at moment of purchase)
  - `quantity`: Number
  - `image`: String
- `shippingAddress`:
  - `fullName`: String
  - `phone`: String
  - `addressLine1`: String
  - `city`: String
  - `state`: String
  - `pincode`: String
- `totalAmount`: Number (Computed server-side in INR)
- `status`: String (Enum: `PENDING`, `PLACED`, `SHIPPED`, `DELIVERED`, `CANCELLED`; Default: `PENDING`)
- `paymentStatus`: String (Enum: `PENDING`, `PAID`, `FAILED`; Default: `PENDING`)
- `razorpayOrderId`: String
- `razorpayPaymentId`: String
- `razorpaySignature`: String
- `timestamps`: `true`

---

### API Reference

#### 👤 Customer Authentication (`/customers`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `POST` | `/customers/register` | Public | Create new account, hash password & set JWT cookie |
| `POST` | `/customers/login` | Public | Authenticate user credentials & set JWT cookie |
| `POST` | `/customers/logout` | Protected | Clear authentication cookie |
| `GET` | `/customers/profile` | Protected | Return currently logged-in customer details |

#### 📦 Product Catalog (`/products`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `GET` | `/products` | Public | List products with optional `?search=` and `?category=` |
| `GET` | `/products/:id` | Public | Get specific product by MongoDB ObjectId |
| `POST` | `/products` | Protected | Upload image to Cloudinary & create new product |

#### 🛒 Shopping Cart (`/cart`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `GET` | `/cart` | Protected | Retrieve user's cart populated with product records |
| `POST` | `/cart/add` | Protected | Add item to cart or increment quantity if already present |
| `PUT` | `/cart/update` | Protected | Set specific item quantity (removes if quantity < 1) |
| `DELETE`| `/cart/remove/:productId` | Protected | Remove product completely from customer cart |

#### 💖 Registry / Wishlist (`/wishlist`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `GET` | `/wishlist` | Protected | Fetch user's saved wishlist products |
| `POST` | `/wishlist/add` | Protected | Add product to customer wishlist |
| `DELETE`| `/wishlist/:productId`| Protected | Remove item from customer wishlist |

#### 💳 Orders & Razorpay Checkout (`/orders`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `POST` | `/orders/create-payment-order` | Protected | Validate stock, compute total & issue Razorpay Order |
| `POST` | `/orders/verify-payment` | Protected | Verify HMAC-SHA256 signature, mark PAID, decrement stock |
| `GET` | `/orders` | Protected | Fetch customer's order history sorted newest first |
| `GET` | `/orders/:id` | Protected | Fetch single order details with ownership verification |

---

### Razorpay Payment Lifecycle

```
[ Frontend: /checkout ] ────(1) POST /orders/create-payment-order ───► [ Backend Order Controller ]
                                                                             │
                                                                       - Check DB Stock
                                                                       - Calculate Server Total
                                                                       - Create Order (PENDING)
                                                                       - razorpay.orders.create()
                                                                             │
[ Frontend: /checkout ] ◄───(2) Return razorpayOrder + Key ID ───────────────┘
         │
  Opens Razorpay Modal
  Customer enters Test UPI/Card
         │
[ Frontend Callback ] ──────(3) POST /orders/verify-payment ─────────► [ Backend Verifier ]
  razorpay_order_id,                                                         │
  razorpay_payment_id,                                                 Compute HMAC SHA256:
  razorpay_signature                                                   Crypto.createHmac(...)
                                                                             │
                                                            ┌────────────────┴────────────────┐
                                                      [ Signature Match ]            [ Mismatch ]
                                                            │                              │
                                                     - Order = PLACED, PAID           Return 400
                                                     - Decrement Stock ($inc)         Invalid Signature
                                                     - Empty Customer Cart
                                                            │
[ Frontend: /order-success ] ◄──(4) Return Confirmed Order ─┘
```

---

## 🎨 Frontend Implementation Details

### Design System & "AURA" Aesthetic

The user interface follows an **editorial, tactile aesthetic** inspired by high-end design magazines and contemporary architecture:

| Token | Hex Value | Purpose |
|---|---|---|
| **Linen Base** | `#FAF7F2` | Main page background across all routes |
| **Sandstone Surface** | `#F4EFEA` | Card backgrounds, image holders, and subtle containers |
| **Pure White** | `#FFFFFF` | Primary content cards and form surfaces |
| **Warm Hairline** | `#EAE4DC` / `#DDD6CC` | Structural borders, table dividers, card outlines |
| **Charcoal Primary** | `#1E1B18` | Primary CTA buttons, heavy headings, text accents |
| **Terracotta / Rust** | `#BA5D38` | Highlight buttons, interactive hover states, badges |
| **Forest Green** | `#2E6B47` | Free courier tags, verified payment chips, in-stock labels |

#### Typography
- **Headings**: `Cormorant Garamond` (loaded via Google Fonts) with class `.font-editorial`. High-contrast serifs with wide tracking.
- **Body & Controls**: `Plus Jakarta Sans` with class `.font-sans-ui`. Geometric, legible, and optimized for mobile screens.

---

### Routing Table & Page Architecture

All application routes are defined in [App.jsx](file:///Users/omrajput/Desktop/Web%20Dev/ShopKart/frontend/vite-project/src/App.jsx):

| Route | Component | Access | Purpose |
|---|---|---|---|
| `/` | `Landing.jsx` | Public | Curated editorial landing page with press bar & hero |
| `/landing` | `Landing.jsx` | Public | Direct landing route alias |
| `/login` | `Login.jsx` | Public Only | 50/50 split card with Japandi visual & social auth |
| `/register`| `Register.jsx`| Public Only | Member account creation screen |
| `/home` | `Home.jsx` | Protected | Member lounge with gold tier badge & personalized feeds |
| `/products`| `Products.jsx`| Protected | Paginated catalog with debounced search & category filters |
| `/products/:id`| `ProductDetails.jsx`| Protected| Gallery view, swatches, quantity controls & instant buy |
| `/wishlist`| `Wishlist.jsx`| Protected | User's saved registry pieces |
| `/cart` | `Cart.jsx` | Protected | Shopping bag with complimentary shipping meter |
| `/checkout`| `Checkout.jsx`| Protected | Shipping destination form & Razorpay payment trigger |
| `/order-success/:id`| `OrderSuccess.jsx`| Protected| Verified purchase confirmation receipt |
| `/orders` | `Orders.jsx` | Protected | Full order archive and dispatch tracking |

---

### State Management (Redux & Auth Context)

#### 1. Authentication Context (`src/context/AuthContent.jsx`)
- Provides `customer`, `login()`, `logout()`, and `loading` across the entire React component tree.
- Automatically restores session on page load by invoking `/customers/profile`.
- Coordinates with `ProtectedRoute` to restrict unauthenticated access.

#### 2. Cart Redux Slice (`src/redux/cartSlice.js`)
- **Async Thunks**:
  - `fetchCart`: Loads latest cart items from `/cart`.
  - `addToCartApi`: Optimistically updates and synchronizes cart with backend.
  - `updateQuantityApi`: Updates item counts in real time.
  - `removeFromCartApi`: Deletes items from the customer's cart.
- Synchronizes the live cart count badge in `Navbar.jsx` with every route change.

---

## 🔒 Security & Data Integrity Principles

1. **Zero Client-Side Trust on Pricing**:
   The frontend calculates subtotals only for UI feedback. When `/orders/create-payment-order` is called, the backend queries the database for each item ID, pulls the genuine price, and computes the exact total.
2. **Atomic Inventory Protection**:
   Stock decrements utilize MongoDB's `$inc` operator (`{ stock: -item.quantity }`) in the verified payment handler, ensuring inventory counters cannot become corrupted during simultaneous checkouts.
3. **Cart Retention Until Verified Payment**:
   The customer's cart is never wiped when an order is merely initiated. If a customer cancels the Razorpay modal, their cart items remain intact. The cart is emptied strictly inside `/orders/verify-payment` upon successful signature validation.
4. **HMAC-SHA256 Payment Verification**:
   Payment signatures are validated using Node's standard `crypto.createHmac('sha256', secret)` to confirm that the transaction was truly completed on Razorpay's banking servers:
   ```javascript
   const generatedSignature = crypto
     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
     .digest('hex');
   ```

---

## 🚀 Local Development & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance
- [Razorpay](https://dashboard.razorpay.com/) account (Test Mode credentials)
- [Cloudinary](https://cloudinary.com/) account (Cloud Name, API Key, API Secret)

---

### Step 1: Clone & Environment Setup

```bash
git clone <repository-url>
cd ShopKart
```

#### Configure Backend Environment
Create a `.env` file inside `/backend`:

```env
# Database Connection
dbUrl=mongodb+srv://<username>:<password>@cluster0.mongodb.net/omnikart?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=YourSuperSecretKeyHere

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Test Mode Credentials
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourRazorpaySecretHere
```

---

### Step 2: Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend/vite-project
npm install
```

---

### Step 3: Run the Application Locally

#### Terminal 1 — Start Backend Server
```bash
cd backend
# Starts Express API on port 8085 with nodemon
npx nodemon index.js
```
*Backend runs at:* `http://localhost:8085`

#### Terminal 2 — Start Frontend Server
```bash
cd frontend/vite-project
# Starts Vite development server
npm run dev
```
*Frontend runs at:* `http://localhost:5173`

---

### 🌐 Live Production Deployment

| Service | Environment | Live URL |
|---|---|---|
| **Frontend Application** | Production (Render Static Site) | [https://omnikart-web.onrender.com/](https://omnikart-web.onrender.com/) |
| **Backend REST API** | Production (Render Web Service) | [https://omnikart-api.onrender.com/](https://omnikart-api.onrender.com/) |
| **Repository** | GitHub | [https://github.com/omsrajput977/OmniKart](https://github.com/omsrajput977/OmniKart) |

---

## 🧪 Postman API Test Plan

To test the complete backend order and payment flow independently of the frontend:

### Test 1 — Empty Cart Guard
- **Endpoint**: `POST /orders/create-payment-order`
- **Headers**: Include session cookie from `/customers/login`
- **Body**:
  ```json
  {
    "shippingAddress": {
      "fullName": "Aarav Sharma",
      "phone": "9876543210",
      "addressLine1": "402 Sunshine Apts",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560001"
    }
  }
  ```
- **Expected**: `400 Bad Request` with message `"Your cart is empty"`.

---

### Test 2 — Add Product & Create Payment Order
1. Call `POST /cart/add` with `{ "productId": "<valid_product_id>", "quantity": 1 }`.
2. Call `POST /orders/create-payment-order` with the shipping address.
3. **Expected**: `200 OK` returning:
   - `order._id`: Internal OmniKart pending order ID.
   - `razorpayOrder.id`: Razorpay Order ID (e.g. `order_RvXYZ123`).
   - `razorpayOrder.amount`: Amount in paise.
   - `key`: Public `RAZORPAY_KEY_ID`.

---

### Test 3 — Cart Retention Before Payment
- **Endpoint**: `GET /cart`
- **Expected**: The customer's cart items must still be present.

---

### Test 4 — Cryptographic Signature Verification
- **Endpoint**: `POST /orders/verify-payment`
- **Body**:
  ```json
  {
    "razorpay_order_id": "order_RvXYZ123",
    "razorpay_payment_id": "pay_RvABC456",
    "razorpay_signature": "<hmac_sha256_hex_digest>"
  }
  ```
- **Expected**: `200 OK` with `paymentStatus: "PAID"`, `status: "PLACED"`, and confirmed order snapshot.

---

### Test 5 — Confirm Cart Cleared & Inventory Updated
1. Call `GET /cart`: Cart should now be empty (`[]`).
2. Call `GET /products/<product_id>`: `stock` count is decremented by 1.
3. Call `GET /orders`: The new order appears at index 0.

---

## 📄 License & Credits
- Built with craftsmanship for **OmniKart**.
- Typography: *Cormorant Garamond* & *Plus Jakarta Sans* (Google Fonts).
- Payments powered by Razorpay Sandbox.
- Media hosted on Cloudinary.
