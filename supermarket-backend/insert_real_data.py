from app.core.database import SessionLocal
from app.models.category import Category
from app.models.product import Product

db = SessionLocal()

# Insert Categories
categories = [
    "Beverages", "Dairy", "Snacks", "Bakery", "Meat & Seafood",
    "Fruits & Vegetables", "Frozen Foods", "Personal Care", 
    "Household", "Canned Goods"
]

for name in categories:
    if not db.query(Category).filter(Category.Category_Name == name).first():
        db.add(Category(Category_Name=name))

db.commit()
print("✅ Categories inserted!")

# Insert Products (Sample from your data)
products_data = [
    {"Barcode":"8991000000001","Name":"Mineral Water 600ml","Description":"Purified drinking water","Category_ID":1,"Brand":"AquaPure","Unit":"Bottle","Unit_Price":0.75,"Unit_Mass_Kg":0.600,"Reorder_Level":50,"Is_Perishable":0,"emoji":"💧"},
    {"Barcode":"8991000000004","Name":"Fresh Milk 1L","Description":"Full cream pasteurized milk","Category_ID":2,"Brand":"DairyBest","Unit":"Carton","Unit_Price":1.20,"Unit_Mass_Kg":1.030,"Reorder_Level":30,"Is_Perishable":1,"emoji":"🥛"},
    {"Barcode":"8991000000007","Name":"Potato Chips 100g","Description":"Salted crispy chips","Category_ID":3,"Brand":"CrunchTime","Unit":"Bag","Unit_Price":1.00,"Unit_Mass_Kg":0.100,"Reorder_Level":40,"Is_Perishable":0,"emoji":"🥔"},
    {"Barcode":"8991000000009","Name":"Whole Wheat Bread 400g","Description":"Freshly baked whole wheat loaf","Category_ID":4,"Brand":"BakeMate","Unit":"Loaf","Unit_Price":1.80,"Unit_Mass_Kg":0.400,"Reorder_Level":25,"Is_Perishable":1,"emoji":"🍞"},
    {"Barcode":"8991000000011","Name":"Chicken Breast 500g","Description":"Boneless skinless chicken breast","Category_ID":5,"Brand":"FreshFarm","Unit":"Pack","Unit_Price":3.50,"Unit_Mass_Kg":0.500,"Reorder_Level":20,"Is_Perishable":1,"emoji":"🍗"},
]

for p in products_data:
    if not db.query(Product).filter(Product.Barcode == p["Barcode"]).first():
        db.add(Product(**p))

db.commit()
print("✅ Sample Products inserted successfully!")
db.close()
