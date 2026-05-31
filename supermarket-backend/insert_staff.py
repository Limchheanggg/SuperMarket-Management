import bcrypt
from app.core.database import SessionLocal
from app.models.user import User
from sqlalchemy import text

db = SessionLocal()

def hash_password(p):
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()

staff = [
    # Managers
    ("Sovann PHAN",       "sovann.phan@freshmart.kh",      "+855 12 111 001", "manager"),
    ("Chanthy MEAS",      "chanthy.meas@freshmart.kh",     "+855 12 111 002", "manager"),

    # Cashiers
    ("Dara CHAN",         "dara.chan@freshmart.kh",         "+855 12 222 001", "cashier"),
    ("Sreyleak KON",      "sreyleak.kon@freshmart.kh",     "+855 12 222 002", "cashier"),
    ("Bopha SRUN",        "bopha.srun@freshmart.kh",       "+855 12 222 003", "cashier"),
    ("Ratana SOK",        "ratana.sok@freshmart.kh",       "+855 12 222 004", "cashier"),
    ("Pisach LIM",        "pisach.lim@freshmart.kh",       "+855 12 222 005", "cashier"),
    ("Channary HENG",     "channary.heng@freshmart.kh",    "+855 12 222 006", "cashier"),

    # Employees (stock, shelving, security, cleaning)
    ("Kosal PRUM",        "kosal.prum@freshmart.kh",       "+855 12 333 001", "employee"),
    ("Phearum KEO",       "phearum.keo@freshmart.kh",      "+855 12 333 002", "employee"),
    ("Mealea TOUCH",      "mealea.touch@freshmart.kh",     "+855 12 333 003", "employee"),
    ("Vibol ROS",         "vibol.ros@freshmart.kh",        "+855 12 333 004", "employee"),
    ("Sokhom PEN",        "sokhom.pen@freshmart.kh",       "+855 12 333 005", "employee"),
    ("Kakada TEP",        "kakada.tep@freshmart.kh",       "+855 12 333 006", "employee"),
    ("Malika YEM",        "malika.yem@freshmart.kh",       "+855 12 333 007", "employee"),
    ("Bunna NGET",        "bunna.nget@freshmart.kh",       "+855 12 333 008", "employee"),
    ("Leakhena CHEA",     "leakhena.chea@freshmart.kh",    "+855 12 333 009", "employee"),
    ("Visal KONG",        "visal.kong@freshmart.kh",       "+855 12 333 010", "employee"),
    ("Sokha SAM",         "sokha.sam@freshmart.kh",        "+855 12 333 011", "employee"),
    ("Ratha TAN",         "ratha.tan@freshmart.kh",        "+855 12 333 012", "employee"),
]

print("👥 Inserting FreshMart staff...")
created = 0
skipped = 0

for full_name, email, phone, role in staff:
    if db.query(User).filter(User.email == email).first():
        print(f"  ⏭  Skipped (exists): {full_name}")
        skipped += 1
        continue
    db.add(User(
        full_name = full_name,
        email     = email,
        password  = hash_password("staff123"),
        phone     = phone,
        role      = role,
    ))
    created += 1
    print(f"  ✅ {role.upper():10} | {full_name}")

db.commit()
db.close()

print(f"""
╔══════════════════════════════════════════╗
║  ✅ Staff Insert Complete!               ║
║                                          ║
║  Created : {created:<5}  Skipped: {skipped:<5}         ║
║  Password: staff123 (all accounts)       ║
║                                          ║
║  Roles added:                            ║
║  👔 Manager  × 2                         ║
║  💰 Cashier  × 6                         ║
║  📦 Employee × 12                        ║
╚══════════════════════════════════════════╝
""")
