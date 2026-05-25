from app.core.database import SessionLocal
from app.models.product import Product

db = SessionLocal()

products = [
    {"name":"Organic Tomatoes","category":"Produce","price":2.49,"old_price":3.20,"unit":"1kg","brand":"Green Valley","stock":85,"description":"Sun-ripened organic tomatoes","emoji":"🍅"},
    {"name":"Fresh Whole Milk","category":"Dairy","price":1.89,"old_price":None,"unit":"1L","brand":"Sunrise Dairy","stock":120,"description":"Fresh whole milk","emoji":"🥛"},
    {"name":"Sourdough Loaf","category":"Bakery","price":4.50,"old_price":5.00,"unit":"500g","brand":"Artisan Bakers","stock":45,"description":"Hand-crafted sourdough","emoji":"🍞"},
    {"name":"Free Range Chicken","category":"Meat","price":8.99,"old_price":10.50,"unit":"1kg","brand":"Premium Meats","stock":30,"description":"Hormone-free chicken","emoji":"🍗"},
]

for p in products:
    existing = db.query(Product).filter(Product.name == p["name"]).first()
    if not existing:
        db_product = Product(**p)
        db.add(db_product)

db.commit()
print("✅ Sample products inserted successfully!")
db.close()
