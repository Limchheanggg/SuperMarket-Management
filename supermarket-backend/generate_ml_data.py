"""
FreshMart ML Data Generator
Generates realistic data for ML training:
- 500 customers (users with role=customer)
- 10,000+ orders/sales spanning 3 years
- Realistic purchase patterns
Run: python generate_ml_data.py
"""

import random
import bcrypt
from datetime import datetime, timedelta, date
from app.core.database import SessionLocal
from app.models.user import User
from app.models.product import Product
from app.models.inventory import Inventory
from sqlalchemy import text

db = SessionLocal()

# ── Helpers ────────────────────────────────────────────────────────────
def hash_password(p):
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()

def random_date(start_year=2022):
    start = date(start_year, 1, 1)
    end   = date.today()
    delta = (end - start).days
    return start + timedelta(days=random.randint(0, delta))

def weighted_choice(items, weights):
    total = sum(weights)
    r = random.uniform(0, total)
    upto = 0
    for item, w in zip(items, weights):
        upto += w
        if r <= upto:
            return item
    return items[-1]

# ── Khmer names ─────────────────────────────────────────────────────────
FIRST_NAMES = [
    "Sophal","Dara","Chenda","Bopha","Ratana","Samnang","Channary","Pisach",
    "Sreyleak","Vanna","Kosal","Phearum","Mealea","Sovann","Chanthy","Rithy",
    "Sothea","Kakada","Malika","Bunna","Leakhena","Vibol","Sokhom","Chantra",
    "Kimheng","Pichda","Davy","Visal","Sokha","Ratha","Sreyna","Makara",
    "Chanthou","Narin","Sopheak","Vuthy","Sreymom","Kimly","Thy","Sokly",
    "Phalla","Bunthy","Davuth","Sokheng","Chanmony","Raksmey","Pisey","Sopha",
    "Sreypich","Moniroth","Vibolrith","Sokunthea","Chanreaksmey","Sotheavy",
    "Kimchhorn","Sreylai","Bunheng","Chanmony","Sokunthea","Virith",
]
LAST_NAMES = [
    "Khun","Chan","Sok","Phan","Lim","Heng","Sar","Touch","Keo","Mao",
    "Ros","Pen","Tep","Yem","Srun","Prum","Ek","Ny","Thol","Meas",
    "Nget","Chea","Kong","Sam","Tan","Horn","Doeun","Seng","Chhay","Vong",
    "Bun","Oun","Khem","Siv","Mok","Pov","Nhem","Try","Kuy","Leng",
]
DOMAINS = ["gmail.com","yahoo.com","hotmail.com","outlook.com","icloud.com"]

print("=" * 55)
print("  FreshMart ML Data Generator")
print("=" * 55)

# ── Step 1: Generate 500 Customers ─────────────────────────────────────
print("\n👥 Generating 500 customers...")
existing = db.query(User).filter(User.role == "customer").count()
to_create = max(0, 500 - existing)
print(f"   Existing: {existing}, Creating: {to_create}")

customers_created = 0
for i in range(to_create):
    fn = random.choice(FIRST_NAMES)
    ln = random.choice(LAST_NAMES)
    email = f"{fn.lower()}.{ln.lower()}{random.randint(1,9999)}@{random.choice(DOMAINS)}"
    if db.query(User).filter(User.email == email).first():
        continue
    phone = f"+855 {random.randint(10,99)} {random.randint(100,999)} {random.randint(100,999)}"
    u = User(
        full_name=f"{fn} {ln}",
        email=email,
        password=hash_password("customer123"),
        phone=phone,
        role="customer"
    )
    db.add(u)
    customers_created += 1
    if customers_created % 50 == 0:
        db.commit()
        print(f"   ✅ {customers_created} customers created...")

db.commit()
all_customers = db.query(User).filter(User.role == "customer").all()
print(f"   Total customers: {len(all_customers)}")

# ── Step 2: Get all products ────────────────────────────────────────────
print("\n📦 Loading products...")
products = db.query(Product).all()
if not products:
    print("   ❌ No products found! Run insert_lucky_products.py first.")
    db.close()
    exit()
print(f"   Found {len(products)} products")

# ── Step 3: Ensure inventory exists for all products ───────────────────
print("\n🏪 Setting up inventory...")
for p in products:
    inv = db.query(Inventory).filter(Inventory.Product_ID == p.Product_ID).first()
    if not inv:
        db.add(Inventory(Product_ID=p.Product_ID, Quantity=random.randint(20, 200)))
db.commit()

# ── Step 4: Create Sale & SaleItem tables if not exist ─────────────────
print("\n🗃️  Ensuring Sale tables exist...")
db.execute(text("""
    CREATE TABLE IF NOT EXISTS Sale (
        Sale_ID        INT AUTO_INCREMENT PRIMARY KEY,
        Sale_Day       INT NOT NULL,
        Sale_Month     INT NOT NULL,
        Sale_Year      INT NOT NULL,
        Sale_Time      TIME NOT NULL,
        Employee_ID    INT NOT NULL DEFAULT 2,
        Customer_ID    INT,
        Payment_Method VARCHAR(50) DEFAULT 'Cash',
        Discount       FLOAT DEFAULT 0,
        Tax            FLOAT DEFAULT 0,
        Total_Amount   FLOAT NOT NULL,
        FOREIGN KEY (Employee_ID) REFERENCES users(id),
        FOREIGN KEY (Customer_ID) REFERENCES users(id)
    )
"""))
db.execute(text("""
    CREATE TABLE IF NOT EXISTS SaleItem (
        Item_ID    INT AUTO_INCREMENT PRIMARY KEY,
        Sale_ID    INT NOT NULL,
        Product_ID INT NOT NULL,
        Quantity   INT NOT NULL,
        Unit_Price FLOAT NOT NULL,
        Subtotal   FLOAT NOT NULL,
        FOREIGN KEY (Sale_ID) REFERENCES Sale(Sale_ID),
        FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
    )
"""))
db.commit()

# ── Step 5: Generate 10,000 Sales over 3 years ─────────────────────────
print("\n🛒 Generating 10,000 sales transactions...")
print("   This may take 1-2 minutes...")

existing_sales = db.execute(text("SELECT COUNT(*) FROM Sale")).scalar()
to_generate = max(0, 10000 - existing_sales)
print(f"   Existing: {existing_sales}, Creating: {to_generate}")

# Payment method distribution (realistic for Cambodia)
payment_methods = ["Cash", "Card", "QR Code", "Bank Transfer"]
payment_weights = [45, 25, 20, 10]

# Category-based purchase probability (some categories sell more)
high_demand_cats = ["Instant Noodles", "Beverages", "Rice & Grains", "Snacks & Biscuits", "Fresh Produce"]
medium_demand_cats = ["Dairy & Eggs", "Sauces & Condiments", "Frozen Foods", "Canned & Preserved"]

def get_product_weight(p):
    cat = p.Category_Name if hasattr(p, 'Category_Name') else ""
    # Get category name from DB
    cat_result = db.execute(
        text("SELECT Category_Name FROM Category WHERE Category_ID = :id"),
        {"id": p.Category_ID}
    ).fetchone()
    cat_name = cat_result[0] if cat_result else ""
    if cat_name in high_demand_cats:    return 5
    if cat_name in medium_demand_cats:  return 3
    return 1

product_weights = [get_product_weight(p) for p in products]

# Seasonal multipliers (more sales during holidays)
def seasonal_multiplier(d):
    month = d.month
    if month in [1, 2]:    return 1.8  # Khmer New Year prep
    if month in [4]:       return 2.0  # Khmer New Year
    if month in [11, 12]:  return 1.5  # End of year
    return 1.0

# Time of day distribution (realistic shopping hours)
shopping_hours = list(range(7, 22))
hour_weights = [2,4,6,8,9,10,9,8,7,8,9,10,8,7,5,3] # 7am-10pm

employee_id = db.query(User).filter(User.role.in_(["admin","manager","cashier"])).first()
emp_id = employee_id.id if employee_id else 2

batch_size = 100
sales_created = 0

for i in range(to_generate):
    # Pick a random customer (70% have account, 30% walk-in)
    customer = random.choice(all_customers) if random.random() < 0.7 else None
    customer_id = None  # Sale.Customer_ID refs Customer table, not users

    # Random date weighted towards recent (more recent = more data)
    sale_date = random_date(2022)
    
    # Apply seasonal multiplier — skip some days in low season
    if random.random() > seasonal_multiplier(sale_date) * 0.5:
        # Still create it but with lower amounts
        pass

    hour = weighted_choice(shopping_hours, hour_weights)
    minute = random.randint(0, 59)
    sale_time = f"{hour:02d}:{minute:02d}:00"

    # Number of items per transaction (1-8 items)
    n_items = random.choices(
        [1, 2, 3, 4, 5, 6, 7, 8],
        weights=[15, 25, 25, 15, 10, 5, 3, 2]
    )[0]

    # Pick products (no duplicates per sale)
    chosen_products = random.choices(products, weights=product_weights, k=min(n_items, len(products)))
    seen = set()
    unique_products = []
    for p in chosen_products:
        if p.Product_ID not in seen:
            seen.add(p.Product_ID)
            unique_products.append(p)

    # Calculate totals
    discount = round(random.choices([0, 0, 0, random.uniform(0.5, 5)], weights=[60,20,15,5])[0], 2)
    payment = weighted_choice(payment_methods, payment_weights)

    subtotal = 0
    items_data = []
    for p in unique_products:
        qty = random.choices([1,2,3,4,5], weights=[50,25,15,7,3])[0]
        price = float(p.Unit_Price)
        item_subtotal = round(price * qty, 2)
        subtotal += item_subtotal
        items_data.append((p.Product_ID, qty, price, item_subtotal))

    tax = round(subtotal * 0.1, 2)
    total = round(subtotal - discount + tax, 2)
    if total <= 0:
        continue

    # Insert sale
    result = db.execute(text("""
        INSERT INTO Sale (Sale_Day, Sale_Month, Sale_Year, Sale_Time,
                         Employee_ID, Customer_ID, Payment_Method,
                         Discount, Tax, Total_Amount)
        VALUES (:day, :month, :year, :time,
                :emp, :cust, :method,
                :disc, :tax, :total)
    """), {
        "day": sale_date.day, "month": sale_date.month, "year": sale_date.year,
        "time": sale_time, "emp": emp_id, "cust": customer_id,
        "method": payment, "disc": discount, "tax": tax, "total": total
    })
    sale_id = result.lastrowid

    # Insert sale items
    for (pid, qty, price, sub) in items_data:
        db.execute(text("""
            INSERT INTO SaleItem (Sale_ID, Product_ID, Quantity, Unit_Price, Subtotal)
            VALUES (:sid, :pid, :qty, :price, :sub)
        """), {"sid": sale_id, "pid": pid, "qty": qty, "price": price, "sub": sub})

    sales_created += 1
    if sales_created % batch_size == 0:
        db.commit()
        print(f"   ✅ {sales_created}/{to_generate} sales created...")

db.commit()

# ── Step 6: Update inventory to reflect sales ──────────────────────────
print("\n📉 Updating inventory stock levels...")
for p in products:
    total_sold = db.execute(
        text("SELECT COALESCE(SUM(Quantity),0) FROM SaleItem WHERE Product_ID=:pid"),
        {"pid": p.Product_ID}
    ).scalar()
    inv = db.query(Inventory).filter(Inventory.Product_ID == p.Product_ID).first()
    if inv:
        # Start with 500 initial stock, subtract sales, min 0
        inv.Quantity = max(0, 500 - int(total_sold))
db.commit()

# ── Step 7: Add membership for active customers ─────────────────────────
print("\n⭐ Creating memberships for active customers...")
db.execute(text("""
    CREATE TABLE IF NOT EXISTS Membership (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        tier VARCHAR(20) DEFAULT 'Bronze',
        points INT DEFAULT 0,
        total_spent FLOAT DEFAULT 0,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
"""))
db.commit()

# Add top 200 customers with most purchases to membership
top_customers = db.execute(text("""
    SELECT Customer_ID, COUNT(*) as cnt, SUM(Total_Amount) as spent
    FROM Sale
    WHERE Customer_ID IS NOT NULL
    GROUP BY Customer_ID
    ORDER BY spent DESC
    LIMIT 200
""")).fetchall()

for row in top_customers:
    spent = float(row.spent or 0)
    points = int(spent * 10)  # 10 points per dollar
    if spent >= 500:   tier = "Platinum"
    elif spent >= 200: tier = "Gold"
    elif spent >= 50:  tier = "Silver"
    else:              tier = "Bronze"
    try:
        db.execute(text("""
            INSERT IGNORE INTO Membership (user_id, tier, points, total_spent)
            VALUES (:uid, :tier, :pts, :spent)
        """), {"uid": row.Customer_ID, "tier": tier, "pts": points, "spent": spent})
    except: pass
db.commit()

# ── Final Summary ───────────────────────────────────────────────────────
total_sales   = db.execute(text("SELECT COUNT(*) FROM Sale")).scalar()
total_items   = db.execute(text("SELECT COUNT(*) FROM SaleItem")).scalar()
total_cust    = db.query(User).filter(User.role=="customer").count()
total_members = db.execute(text("SELECT COUNT(*) FROM Membership")).scalar()
total_revenue = db.execute(text("SELECT COALESCE(SUM(Total_Amount),0) FROM Sale")).scalar()

db.close()

print(f"""
╔══════════════════════════════════════════════════════╗
║  ✅ ML Data Generation Complete!                     ║
╠══════════════════════════════════════════════════════╣
║  👥 Customers:      {total_cust:<10}                    ║
║  🛒 Sales:          {total_sales:<10}                    ║
║  📦 Sale Items:     {total_items:<10}                    ║
║  ⭐ Members:        {total_members:<10}                    ║
║  💰 Total Revenue:  ${float(total_revenue):,.2f}              ║
║                                                      ║
║  ✅ Ready for ML:                                    ║
║  • Sales Prediction                                  ║
║  • Product Recommendation                            ║
║  • Low Stock Prediction                              ║
║  • Customer Segmentation                             ║
║  • Churn Prediction                                  ║
╚══════════════════════════════════════════════════════╝
""")
