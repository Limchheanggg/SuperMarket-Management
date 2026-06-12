<div align="center">



# 🛒 AMS Mart — Supermarket Management System

**A production-ready full-stack supermarket system built for Cambodia**

[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

[🌐 **Live Demo**](https://super-market-management-six.vercel.app) &nbsp;·&nbsp; [⚙️ **API Docs**](https://supermarket-management-production-d071.up.railway.app/docs) &nbsp;·&nbsp; [📊 **Admin Panel**](https://super-market-management-six.vercel.app/admin)

---

</div>

## 📖 Overview

AMS Mart is a **complete supermarket management system** developed as a university project at the **Institute of Technology of Cambodia (ITC)**, Department of Applied Mathematics and Statistics.

The system bridges the gap between traditional Cambodian supermarket operations and modern digital management — featuring a full online shopping experience for customers and a powerful admin panel for managing every aspect of supermarket operations.

> 🗄️ Backed by a cloud MySQL database with **13,026 sales records**, **549 users**, and **148 products** — all with realistic Cambodia seasonal patterns from 2024–2026.

---

## 👥 Team

| Name | Student ID | Role |
|------|-----------|------|
| **KHUN Limchheang** | e20230393 | Core System  |
| **CHHAY Lyveng** | e20230135 | Database Design |
| **HORN Hengveasna** | e20230754 | Testing & Documentation |
| **KHEAN Visal** | — | Supervisor |

**Institution:** Institute of Technology of Cambodia (ITC)  
**Department:** Applied Mathematics and Statistics

---

## ✨ What's Inside

### 👤 Customer Portal — 14 Pages

| Page | Features |
|------|---------|
| 🏠 Home | Hero banner, recently added products, best sellers |
| 🛍️ Shop | Product grid, search, filter by category, sort |
| 📦 Product Detail | Images, description, add to cart, add to wishlist |
| 🛒 Cart | Item list, quantity update, subtotal |
| 💳 Checkout | ABA / ACLEDA / Cash, coupon codes, order summary |
| 📋 Order History | Transaction list, item-level detail modal |
| 📊 Dashboard | Loyalty points, tier progress, recent orders |
| ❤️ Wishlist | Saved products, move to cart |
| 👤 Account | Profile update, name, phone |
| 🔐 Login / Register | JWT auth, inline validation |
| ℹ️ About / Contact / FAQ | Store info, team, mission |

### 🛠️ Admin Panel — 7 Pages

| Page | Features |
|------|---------|
| 📊 Dashboard | Live revenue, sales count, low stock alerts, recent transactions |
| 📦 Inventory | Product CRUD, restock, Cloudinary image upload, filters |
| 👥 Users & Shifts | Employee/customer management, shift scheduling |
| 💰 Sales | Transaction list, date/cashier/payment filters, item details |
| 🎖️ Membership | Bronze/Silver/Gold/Platinum tiers, coupon management |
| 📈 Analytics | Revenue charts, top 10 best sellers, payment breakdown |
| 🏭 Suppliers | Supplier CRUD |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI library |
| Vite 8 | Build tool / dev server |
| React Router DOM | Client-side routing |
| Tailwind CSS | Utility-first styling |
| shadcn/ui + Radix UI | Component library |
| Axios | HTTP client |
| Lucide + Phosphor | Icon libraries |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| FastAPI | Python REST framework |
| SQLAlchemy ORM | Database abstraction |
| PyJWT + bcrypt | Auth / password hashing |
| Pydantic Settings | Config / validation |
| CORS Middleware | Cross-origin requests |
| Cloudinary | Cloud image storage |
| PyMySQL | MySQL connector |

### Infrastructure
| Service | Platform | Cost |
|---------|---------|------|
| Frontend | Vercel | 🆓 Free |
| Backend + MySQL | Railway | 🆓 Free |
| Image Storage | Cloudinary | 🆓 Free |

---

## 🏗️ Architecture

```
👤 User (Browser)
      │
      ▼
┌─────────────────────────────┐
│  Vercel — React + Vite      │  Frontend
│  super-market-management-   │
│  six.vercel.app             │
└─────────────┬───────────────┘
              │ Axios (HTTPS)
              ▼
┌─────────────────────────────┐
│  Railway — FastAPI + Python │  Backend
│  supermarket-management-    │
│  production-d071.up...      │
└──────┬──────────────┬───────┘
       │ SQLAlchemy   │ Cloudinary SDK
       ▼              ▼
┌──────────────┐  ┌──────────────┐
│ Railway MySQL│  │  Cloudinary  │  Storage
│ 13,026 sales │  │ Product imgs │
└──────────────┘  └──────────────┘
```

### Backend Layer Structure
```
HTTP Request
    ↓  FastAPI Router  (auth, products, sales, inventory, membership...)
    ↓  JWT Middleware  (role check: admin / cashier / customer)
    ↓  Business Logic  (routers/)
    ↓  SQLAlchemy ORM  (models/)
    ↓  MySQL Response
```

---

## 🗄️ Database Design

### 12 Tables

| Table | Rows | Description |
|-------|------|-------------|
| `users` | 550+ | All users — auth + role (admin/manager/cashier/customer) |
| `Customer` | 520+ | Customer profiles + loyalty points |
| `Membership` | 550+ | Tier (Bronze/Silver/Gold/Platinum), points, spent |
| `Product` | 140+ | Products — name, price, category, supplier, image |
| `Category` | 12 | Product categories |
| `Supplier` | 12 | Product suppliers |
| `Inventory` | 140+ | Current stock per product |
| `StockMovement` | 37 | Stock change history (in/out) |
| `Sale` | 13,000+ | Sales transactions |
| `SaleItem` | 39,220 | Line items per sale (M:M junction) |
| `Coupon` | 10 | Promo codes with tier requirements |
| `Employee_Shift` | 260 | Employee shift schedules |

### Relationships

```
Type  │ Pair                          │ Via
──────┼───────────────────────────────┼──────────────────────────
1:1   │ users         ↔ Customer      │ Customer.User_ID
1:1   │ Product       ↔ Inventory     │ Inventory.Product_ID
1:1   │ Customer      ↔ Membership    │ Membership.Customer_ID
1:M   │ users         → Sale          │ Sale.Employee_ID
1:M   │ users         → Employee_Shift│ Employee_Shift.user_id
1:M   │ Customer      → Sale          │ Sale.Customer_ID
1:M   │ Category      → Product       │ Product.Category_ID
1:M   │ Supplier      → Product       │ Product.Supplier_ID
1:M   │ Product       → StockMovement │ StockMovement.Product_ID
1:M   │ Sale          → SaleItem      │ SaleItem.Sale_ID
1:M   │ Coupon        → Sale          │ Sale.Coupon_ID
M:M   │ Sale          ↔ Product       │ Junction: SaleItem
```

---

## 📁 Project Structure

```
SuperMarket-Management/
│
├── supermarket-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/           # Navbar, Footer, AdminLayout
│   │   ├── pages/
│   │   │   ├── admin/            # 7 admin pages
│   │   │   └── *.jsx             # 14 customer pages
│   │   ├── services/
│   │   │   └── api.js            # Axios instance + all endpoints
│   │   └── utils/
│   ├── vercel.json               # SPA routing (rewrites all → /)
│   └── package.json
│
├── supermarket-backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── database.py       # SQLAlchemy engine + session
│   │   │   ├── config.py         # Pydantic settings
│   │   │   └── dependencies.py   # JWT decode + role guards
│   │   ├── models/               # ORM table definitions
│   │   ├── routers/
│   │   │   ├── auth.py           # Login, register, /me
│   │   │   ├── products.py       # Product CRUD + categories
│   │   │   ├── sales.py          # Sales CRUD + reports
│   │   │   ├── inventory.py      # Stock management + restock
│   │   │   ├── membership.py     # Loyalty tiers + points
│   │   │   ├── users.py          # Employee + customer management
│   │   │   ├── coupons.py        # Coupon CRUD + validate
│   │   │   ├── suppliers.py      # Supplier CRUD
│   │   │   ├── shifts.py         # Employee shift scheduling
│   │   │   └── upload.py         # Cloudinary image upload
│   │   └── main.py               # App init + CORS + router mount
│   ├── static/images/            # Product images (git-tracked)
│   ├── nixpacks.toml             # Railway Python build config
│   ├── Procfile                  # uvicorn start command
│   ├── requirements.txt          # Python dependencies
│   └── .python-version           # Pins Python 3.11
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- MySQL 8.0+

### 1. Clone

```bash
git clone https://github.com/Limchheanggg/SuperMarket-Management.git
cd SuperMarket-Management
```

### 2. Backend

```bash
cd supermarket-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env            # then fill in your values

uvicorn app.main:app --reload --host 0.0.0.0
# → http://localhost:8000
# → http://localhost:8000/docs
```

### 3. Frontend

```bash
cd supermarket-frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## ⚙️ Environment Variables

```env
# Database
DATABASE_URL=mysql+pymysql://user:password@host:port/dbname

# Auth
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS
ALLOWED_ORIGINS=*
```

---

## 📖 API Reference

Full interactive docs at `http://localhost:8000/docs`

| Router | Method | Endpoint | Description |
|--------|--------|---------|-------------|
| Auth | POST | `/api/auth/login` | Login, get JWT token |
| Auth | POST | `/api/auth/register` | Create account |
| Auth | GET/PUT | `/api/auth/me` | Get / update profile |
| Products | GET | `/api/products/` | List all products |
| Products | GET | `/api/products/categories` | All categories |
| Inventory | POST | `/api/inventory/restock` | Restock product |
| Sales | GET | `/api/sales/` | All transactions |
| Sales | GET | `/api/sales/reports/summary` | Revenue summary |
| Sales | GET | `/api/sales/reports/daily` | Today's stats |
| Membership | GET | `/api/membership/` | All members |
| Coupons | POST | `/api/coupons/validate` | Validate coupon code |
| Upload | POST | `/api/upload/` | Upload image → Cloudinary |

---

## ✅ Project Status

| Feature | Status |
|---------|--------|
| 14 customer pages | ✅ Complete |
| 7 admin pages | ✅ Complete |
| 10 API routers / 40+ endpoints | ✅ Complete |
| MySQL — 12 tables | ✅ Complete |
| JWT role-based auth | ✅ Complete |
| Loyalty program (4 tiers) | ✅ Complete |
| Coupon system | ✅ Complete |
| Cloudinary image upload | ✅ Complete |
| Railway backend deployment | ✅ Live |
| Vercel frontend deployment | ✅ Live |

---

## 💡 Future Work

- [ ] Barcode scanner for faster cashier checkout
- [ ] React Native mobile app for customers
- [ ] Real ABA / ACLEDA payment gateway integration
- [ ] AI product recommendations based on purchase history
- [ ] Multi-branch support for chain supermarkets
- [ ] Automated supplier reorder notifications

---

## 📚 What We Learned

- Designing a normalized relational database with 12 tables and 12 relationships
- Building a RESTful API with FastAPI and SQLAlchemy ORM
- Implementing JWT authentication with role-based access control
- Deploying a full-stack app to Railway + Vercel at zero cost
- Generating realistic e-commerce data with Cambodian seasonal patterns
- Managing cloud image storage with Cloudinary

---

<div align="center">

</div>
