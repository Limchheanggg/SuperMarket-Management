<h1 align="center">🛒 AMS Mart — Supermarket Management System</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react">
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi">
  <img src="https://img.shields.io/badge/Database-MySQL-orange?style=for-the-badge&logo=mysql">
  <img src="https://img.shields.io/badge/Deployed-Railway%20%2B%20Vercel-success?style=for-the-badge">
</p>

<p align="center">
  <a href="https://super-market-management-six.vercel.app" target="_blank">🌐 Live Demo</a> &nbsp;|&nbsp;
  <a href="https://supermarket-management-production-d071.up.railway.app/docs" target="_blank">⚙️ API Docs</a>
</p>

<hr>

<h2>📚 About This Project</h2>

<p>
AMS Mart is a complete full-stack <b>Supermarket Management System</b> developed as a university project at the <b>Institute of Technology of Cambodia (ITC)</b>, Department of Applied Mathematics and Statistics.
</p>
<p>
The system supports both customer-facing shopping features and a comprehensive admin panel for managing supermarket operations — all backed by a cloud-hosted MySQL database with 13,026 real sales records.
</p>

<h3>🎯 Main Goals</h3>
<ul>
  <li>Build a production-ready full-stack web application</li>
  <li>Practice REST API design and integration</li>
  <li>Design a normalized relational database with 12 tables</li>
  <li>Implement role-based access control (admin, cashier, customer)</li>
  <li>Deploy a live system accessible from anywhere</li>
</ul>

<hr>

<h2>👥 Team Members</h2>

<table align="center">
  <tr>
    <th>Name</th>
    <th>Student ID</th>
    <th>Role</th>
  </tr>
  <tr>
    <td><b>KHUN Limchheang</b></td>
    <td>e20230393</td>
    <td>Core System Development</td>
  </tr>
  <tr>
    <td><b>CHHAY Lyveng</b></td>
    <td>e20230135</td>
    <td>Frontend Development</td>
  </tr>
  <tr>
    <td><b>HORN Hengveasna</b></td>
    <td>e20230754</td>
    <td>Database Design</td>
  </tr>
  <tr>
    <td><b>KHEAN Visal</b></td>
    <td>—</td>
    <td>Supervisor (TP)</td>
  </tr>
</table>

<hr>

<h2>✨ Features</h2>

<h3>👤 Customer Side (14 Pages)</h3>
<ul>
  <li>🏠 <b>Home</b> — Hero banner, recently added products, best sellers</li>
  <li>🛍️ <b>Shop</b> — Product grid with search, category filter, sort</li>
  <li>📦 <b>Product Detail</b> — Images, description, add to cart, wishlist</li>
  <li>🛒 <b>Cart</b> — Item list, quantity update, subtotal calculation</li>
  <li>💳 <b>Checkout</b> — ABA / ACLEDA / Cash payment, coupon code support</li>
  <li>📋 <b>Order History</b> — Transaction list with item details</li>
  <li>📊 <b>Dashboard</b> — Loyalty points, tier progress, recent orders</li>
  <li>❤️ <b>Wishlist</b> — Saved products</li>
  <li>👤 <b>Account Settings</b> — Profile update</li>
  <li>🔐 <b>Login / Register</b> — JWT authentication</li>
  <li>ℹ️ <b>About / Contact / FAQ</b></li>
</ul>

<h3>🛠️ Admin Panel (7 Pages)</h3>
<ul>
  <li>📊 <b>Dashboard</b> — Revenue today, monthly stats, recent sales, low stock alerts</li>
  <li>📦 <b>Inventory</b> — Add/edit/delete products, restock, image upload via Cloudinary</li>
  <li>👥 <b>Users & Shifts</b> — Manage employees, customers, shift scheduling</li>
  <li>💰 <b>Sales</b> — Transaction list, filter by date/cashier/payment, view details</li>
  <li>🎖️ <b>Membership</b> — Tier management (Bronze/Silver/Gold/Platinum), coupon management</li>
  <li>📈 <b>Analytics</b> — Revenue charts, best sellers top 10, payment breakdown</li>
  <li>🏭 <b>Suppliers</b> — Supplier CRUD management</li>
</ul>

<hr>

<h2>⚙️ Tech Stack</h2>

<h3>🎨 Frontend</h3>
<table>
  <tr><th>Technology</th><th>Purpose</th></tr>
  <tr><td>React 19</td><td>UI library</td></tr>
  <tr><td>Vite 8</td><td>Build tool / dev server</td></tr>
  <tr><td>React Router DOM</td><td>Client-side routing</td></tr>
  <tr><td>Tailwind CSS</td><td>Utility-first styling</td></tr>
  <tr><td>shadcn/ui + Radix UI</td><td>Component library</td></tr>
  <tr><td>Axios</td><td>HTTP client</td></tr>
  <tr><td>Lucide + Phosphor</td><td>Icon libraries</td></tr>
  <tr><td>React Hot Toast</td><td>Notifications</td></tr>
</table>

<h3>🧠 Backend</h3>
<table>
  <tr><th>Technology</th><th>Purpose</th></tr>
  <tr><td>FastAPI</td><td>Python REST framework</td></tr>
  <tr><td>SQLAlchemy ORM</td><td>Database abstraction</td></tr>
  <tr><td>PyJWT + bcrypt</td><td>Auth / password hashing</td></tr>
  <tr><td>Pydantic Settings</td><td>Config / validation</td></tr>
  <tr><td>CORS Middleware</td><td>Cross-origin requests</td></tr>
  <tr><td>Cloudinary</td><td>Cloud image storage</td></tr>
  <tr><td>PyMySQL</td><td>MySQL DB connector</td></tr>
</table>

<h3>🗄️ Database & Deployment</h3>
<table>
  <tr><th>Technology</th><th>Purpose</th></tr>
  <tr><td>MySQL</td><td>Relational database (12 tables)</td></tr>
  <tr><td>JWT (HS256)</td><td>24h access tokens</td></tr>
  <tr><td>Railway</td><td>Backend + MySQL hosting</td></tr>
  <tr><td>Vercel</td><td>Frontend hosting</td></tr>
  <tr><td>GitHub</td><td>Version control / CI/CD</td></tr>
</table>

<hr>

<h2>🏗️ System Architecture</h2>

<pre>
👤 User (Browser)
      ↓
🌐 Vercel (Frontend — React + Vite)
      ↓ Axios HTTP Requests
⚙️ Railway (Backend — FastAPI + Python)
      ↓ SQLAlchemy ORM
🗄️ Railway MySQL (13,026 sales · 549 users · 148 products)
      ↓
☁️ Cloudinary (Product image storage)
</pre>

<h3>Backend Layered Architecture</h3>
<pre>
HTTP Request
    ↓ FastAPI Router (auth, products, sales, inventory...)
    ↓ JWT Authentication Middleware
    ↓ Business Logic (routers/)
    ↓ SQLAlchemy ORM (models/)
    ↓ MySQL Database Response
</pre>

<hr>

<h2>🗄️ Database Design</h2>

<h3>12 Tables</h3>
<table>
  <tr><th>Table</th><th>Description</th></tr>
  <tr><td>users</td><td>All users — auth, role management (admin/cashier/customer)</td></tr>
  <tr><td>Customer</td><td>Customer profiles and loyalty points</td></tr>
  <tr><td>Membership</td><td>Tier (Bronze/Silver/Gold/Platinum), points, total spent</td></tr>
  <tr><td>Product</td><td>All products — name, price, category, supplier, image</td></tr>
  <tr><td>Category</td><td>12 product categories</td></tr>
  <tr><td>Supplier</td><td>12 suppliers</td></tr>
  <tr><td>Inventory</td><td>Current stock levels per product</td></tr>
  <tr><td>StockMovement</td><td>Stock change history (in/out)</td></tr>
  <tr><td>Sale</td><td>Sales transactions — employee, customer, coupon, payment</td></tr>
  <tr><td>SaleItem</td><td>Products in each sale (junction table)</td></tr>
  <tr><td>Coupon</td><td>Promo codes with tier requirements and expiry</td></tr>
  <tr><td>Employee_Shift</td><td>Employee shift schedules</td></tr>
</table>

<h3>Key Relationships</h3>
<pre>
users        →  Customer       (1:1 via Customer.User_ID)
users        →  Employee_Shift (1:M via Employee_Shift.user_id)
users        →  Sale           (1:M via Sale.Employee_ID)
Customer     →  Sale           (1:M via Sale.Customer_ID)
Customer     →  Membership     (1:1 via Membership.Customer_ID)
Category     →  Product        (1:M via Product.Category_ID)
Supplier     →  Product        (1:M via Product.Supplier_ID)
Product      →  Inventory      (1:1 via Inventory.Product_ID)
Product      →  StockMovement  (1:M via StockMovement.Product_ID)
Sale         →  SaleItem       (1:M via SaleItem.Sale_ID)
Coupon       →  Sale           (1:M via Sale.Coupon_ID)
Sale         ↔  Product        (M:M junction: SaleItem)
</pre>

<h3>📊 Database Statistics</h3>
<ul>
  <li>13,026 sales records (2024–2026, Cambodia seasonal patterns)</li>
  <li>39,220 sale items</li>
  <li>549 users and customers</li>
  <li>148 products across 12 categories</li>
  <li>260 employee shift records</li>
  <li>10 active coupons</li>
</ul>

<hr>

<h2>📁 Project Structure</h2>

<pre>
SuperMarket-Management/
│
├── supermarket-frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   └── layout/            # Navbar, Footer, Layout
│   │   ├── pages/                 # All 14 customer pages
│   │   │   └── admin/             # 7 admin panel pages
│   │   ├── services/
│   │   │   └── api.js             # Axios API client
│   │   └── utils/                 # Helper functions
│   ├── vercel.json                # Vercel SPA routing config
│   └── package.json
│
├── supermarket-backend/           # FastAPI Python backend
│   ├── app/
│   │   ├── core/
│   │   │   ├── database.py        # SQLAlchemy engine + session
│   │   │   ├── config.py          # Environment settings
│   │   │   └── dependencies.py    # JWT auth dependencies
│   │   ├── models/                # SQLAlchemy ORM models
│   │   ├── routers/               # API route handlers
│   │   │   ├── auth.py
│   │   │   ├── products.py
│   │   │   ├── sales.py
│   │   │   ├── inventory.py
│   │   │   ├── membership.py
│   │   │   ├── users.py
│   │   │   ├── coupons.py
│   │   │   ├── suppliers.py
│   │   │   ├── shifts.py
│   │   │   └── upload.py
│   │   └── main.py                # FastAPI app + CORS setup
│   ├── static/images/             # Product images (git-tracked)
│   ├── nixpacks.toml              # Railway build config
│   ├── Procfile                   # Railway start command
│   ├── requirements.txt           # Python dependencies
│   └── .python-version            # Python 3.11
│
└── README.md
</pre>

<hr>

<h2>🚀 Getting Started</h2>

<h3>Prerequisites</h3>
<ul>
  <li>Node.js 18+</li>
  <li>Python 3.11+</li>
  <li>MySQL 8.0+</li>
</ul>

<h3>Clone the Repository</h3>

<pre>
git clone https://github.com/Limchheanggg/SuperMarket-Management.git
cd SuperMarket-Management
</pre>

<h3>Frontend Setup</h3>

<pre>
cd supermarket-frontend
npm install
npm run dev
# Runs at http://localhost:5173
</pre>

<h3>Backend Setup</h3>

<pre>
cd supermarket-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0
# Runs at http://localhost:8000
</pre>

<hr>

<h2>⚙️ Environment Variables</h2>

<h3>Backend <code>.env</code></h3>
<pre>
DATABASE_URL=mysql+pymysql://user:password@host:port/dbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=*
</pre>

<hr>

<h2>📖 API Documentation</h2>

Once the backend is running, visit: <code>http://localhost:8000/docs</code>

<h3>Key Endpoints</h3>

<table>
  <tr><th>Router</th><th>Endpoints</th></tr>
  <tr><td>Auth</td><td>POST /api/auth/login, /register, GET/PUT /api/auth/me</td></tr>
  <tr><td>Products</td><td>CRUD /api/products/, /categories, /bestsellers/list</td></tr>
  <tr><td>Inventory</td><td>GET /api/inventory/, POST /restock, PUT /{id}</td></tr>
  <tr><td>Sales</td><td>CRUD /api/sales/, /reports/summary, /daily, /monthly</td></tr>
  <tr><td>Membership</td><td>GET /api/membership/, /register, /add-points/{id}</td></tr>
  <tr><td>Coupons</td><td>CRUD /api/coupons/, /validate, /active</td></tr>
  <tr><td>Users</td><td>/api/users/employees, /customers, /cashiers</td></tr>
  <tr><td>Shifts</td><td>CRUD /api/shifts/</td></tr>
  <tr><td>Upload</td><td>POST /api/upload/ → Cloudinary</td></tr>
  <tr><td>Suppliers</td><td>CRUD /api/suppliers/</td></tr>
</table>

<hr>

<h2>🌐 Deployment</h2>

<p>This project is deployed for free:</p>

<table>
  <tr><th>Service</th><th>Platform</th><th>Cost</th></tr>
  <tr><td>Frontend</td><td>Vercel</td><td>🆓 Free</td></tr>
  <tr><td>Backend + MySQL</td><td>Railway</td><td>🆓 Free tier</td></tr>
  <tr><td>Image Storage</td><td>Cloudinary</td><td>🆓 Free tier</td></tr>
</table>

<h3>Deploy Frontend (Vercel)</h3>
<ol>
  <li>Push to GitHub</li>
  <li>Connect repo to vercel.com</li>
  <li>Set Root Directory to <code>supermarket-frontend</code></li>
  <li>Deploy ✅</li>
</ol>

<h3>Deploy Backend (Railway)</h3>
<ol>
  <li>Connect repo to railway.app</li>
  <li>Set Root Directory to <code>supermarket-backend</code></li>
  <li>Add environment variables</li>
  <li>Deploy ✅</li>
</ol>

<hr>

<h2>✅ Current Status</h2>

<p>
✅ Frontend — 14 customer pages completed<br>
✅ Backend — 10 API routers, 40+ endpoints<br>
✅ MySQL Database — 12 tables, 13,026 sales records<br>
✅ Authentication — JWT role-based access control<br>
✅ Admin Dashboard — Full CRUD operations<br>
✅ Loyalty System — Bronze/Silver/Gold/Platinum tiers<br>
✅ Image Upload — Cloudinary cloud storage<br>
✅ Deployed — Railway (backend) + Vercel (frontend)<br>
</p>

<hr>

<h2>💡 Future Improvements</h2>
<ul>
  <li>Barcode scanner integration for faster cashier checkout</li>
  <li>Mobile app (React Native) for customers</li>
  <li>Real ABA and ACLEDA payment gateway APIs</li>
  <li>AI-powered product recommendations based on purchase history</li>
  <li>Multi-branch support for chain supermarkets</li>
  <li>Automated low-stock reorder notifications to suppliers</li>
</ul>

<hr>

<h2>🚀 What We Learned</h2>
<ul>
  <li>Full-stack web development with React + FastAPI</li>
  <li>REST API design and integration</li>
  <li>Relational database design with 12 normalized tables</li>
  <li>JWT authentication and role-based access control</li>
  <li>Cloud deployment with Railway and Vercel</li>
  <li>Realistic data generation with Cambodian seasonal patterns</li>
  <li>Image management with Cloudinary</li>
</ul>

<hr>

<p align="center">
  Built with ❤️ by Group 3 — ITC Applied Mathematics and Statistics 2026
</p>
