from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db
from ..core.dependencies import require_admin
from ..models.product import Product
from .stock import get_stock, ensure_inventory_row

router = APIRouter()


@router.get("/", dependencies=[Depends(require_admin)])
def get_inventory(db: Session = Depends(get_db)):
    try:
        rows = db.execute(text("""
            SELECT
                p.Product_ID,
                p.Name,
                p.Brand,
                p.Unit,
                p.Unit_Price,
                p.Reorder_Level,
                p.Is_Perishable,
                p.Product_Image,
                p.Category_ID,
                COALESCE(c.Category_Name, 'General') as Category_Name,
                COALESCE(inv.Quantity, 0) as Quantity
            FROM Product p
            LEFT JOIN Category c    ON c.Category_ID  = p.Category_ID
            LEFT JOIN Inventory inv ON inv.Product_ID = p.Product_ID
            ORDER BY p.Name
        """)).fetchall()

        result = []
        for p in rows:
            d = dict(p._mapping)
            stock   = int(d['Quantity'])
            reorder = int(d.get('Reorder_Level') or 10)
            if stock <= 0:
                status = "Out of Stock"
            elif stock <= reorder:
                status = "Low Stock"
            else:
                status = "In Stock"
            d['Quantity'] = stock
            d['Status']   = status
            result.append(d)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/restock", dependencies=[Depends(require_admin)])
def restock(data: dict, db: Session = Depends(get_db)):
    pid = data.get("product_id")
    qty = int(data.get("quantity", 0))
    if not pid or qty <= 0:
        raise HTTPException(status_code=400, detail="product_id and quantity > 0 required")

    ensure_inventory_row(pid, db)

    db.execute(text("""
        UPDATE Inventory SET Quantity = Quantity + :qty, Last_Updated = NOW()
        WHERE Product_ID = :pid
    """), {"qty": qty, "pid": pid})

    db.execute(text("""
        INSERT INTO StockMovement (Product_ID, Movement_Type, Quantity, Note)
        VALUES (:pid, 'in', :qty, 'Restock')
    """), {"pid": pid, "qty": qty})

    db.commit()
    new_stock = get_stock(pid, db)
    return {"message": f"Restocked {qty} units", "new_stock": new_stock}


@router.put("/{product_id}", dependencies=[Depends(require_admin)])
def adjust_stock(product_id: int, data: dict, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.Product_ID == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    new_qty = int(data.get("quantity", 0))
    old_qty = get_stock(product_id, db)
    diff    = new_qty - old_qty

    ensure_inventory_row(product_id, db)

    db.execute(text("""
        UPDATE Inventory SET Quantity = :qty, Last_Updated = NOW()
        WHERE Product_ID = :pid
    """), {"qty": new_qty, "pid": product_id})

    if diff != 0:
        db.execute(text("""
            INSERT INTO StockMovement (Product_ID, Movement_Type, Quantity, Note)
            VALUES (:pid, 'adjustment', :qty, :note)
        """), {
            "pid":  product_id,
            "qty":  abs(diff),
            "note": f"Manual adjustment: {old_qty} to {new_qty}"
        })

    db.commit()
    return {"message": "Stock adjusted", "new_stock": new_qty}


@router.get("/low-stock", dependencies=[Depends(require_admin)])
def low_stock(db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT p.Product_ID, p.Name, p.Reorder_Level, COALESCE(inv.Quantity, 0) as Quantity
        FROM Product p
        LEFT JOIN Inventory inv ON inv.Product_ID = p.Product_ID
        WHERE COALESCE(inv.Quantity, 0) <= COALESCE(p.Reorder_Level, 10)
        ORDER BY COALESCE(inv.Quantity, 0) ASC
    """)).fetchall()
    return [dict(r._mapping) for r in rows]
