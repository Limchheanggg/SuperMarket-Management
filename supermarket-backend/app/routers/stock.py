from sqlalchemy.orm import Session
from sqlalchemy import text

def get_stock(product_id: int, db: Session) -> int:
    row = db.execute(text("SELECT Quantity FROM Inventory WHERE Product_ID=:pid"), {"pid": product_id}).fetchone()
    return row.Quantity if row else 0

def ensure_inventory_row(product_id: int, db: Session):
    exists = db.execute(text("SELECT 1 FROM Inventory WHERE Product_ID=:pid"), {"pid": product_id}).fetchone()
    if not exists:
        db.execute(text("INSERT INTO Inventory (Product_ID, Quantity) VALUES (:pid, 0)"), {"pid": product_id})
        db.commit()
