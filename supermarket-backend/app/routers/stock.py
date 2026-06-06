from sqlalchemy.orm import Session
from sqlalchemy import text

def get_stock(product_id: int, db: Session = None) -> int:
    if db is None:
        return 0
    row = db.execute(
        text("SELECT Quantity FROM Inventory WHERE Product_ID = :pid LIMIT 1"),
        {"pid": product_id}
    ).fetchone()
    return int(row.Quantity) if row else 0

def ensure_inventory_row(product_id: int, db: Session) -> None:
    existing = db.execute(
        text("SELECT Inventory_ID FROM Inventory WHERE Product_ID = :pid"),
        {"pid": product_id}
    ).fetchone()
    if not existing:
        db.execute(
            text("INSERT INTO Inventory (Product_ID, Quantity) VALUES (:pid, 0)"),
            {"pid": product_id}
        )
        db.commit()
