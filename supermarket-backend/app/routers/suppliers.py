from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db
from ..core.dependencies import require_admin

router = APIRouter()

@router.get("/")
def get_suppliers(db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT s.Supplier_ID, s.Company_Name, s.Contact_Person,
               s.Phone, s.Email, s.City, s.Country,
               COUNT(p.Product_ID) as Product_Count
        FROM Supplier s
        LEFT JOIN Product p ON p.Supplier_ID = s.Supplier_ID
        GROUP BY s.Supplier_ID, s.Company_Name, s.Contact_Person,
                 s.Phone, s.Email, s.City, s.Country
        ORDER BY s.Supplier_ID
    """)).fetchall()
    return [dict(r._mapping) for r in rows]

@router.get("/{supplier_id}")
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    s = db.execute(text("""
        SELECT s.*, COUNT(p.Product_ID) as Product_Count
        FROM Supplier s
        LEFT JOIN Product p ON p.Supplier_ID = s.Supplier_ID
        WHERE s.Supplier_ID = :id
        GROUP BY s.Supplier_ID
    """), {"id": supplier_id}).fetchone()
    if not s:
        raise HTTPException(status_code=404, detail="Supplier not found")
    products = db.execute(text("""
        SELECT p.Product_ID, p.Name, p.Barcode, p.Unit_Price, p.Unit,
               c.Category_Name, COALESCE(inv.Quantity, 0) as Stock
        FROM Product p
        LEFT JOIN Category c ON c.Category_ID = p.Category_ID
        LEFT JOIN Inventory inv ON inv.Product_ID = p.Product_ID
        WHERE p.Supplier_ID = :id
        ORDER BY p.Name
    """), {"id": supplier_id}).fetchall()
    result = dict(s._mapping)
    result["products"] = [dict(r._mapping) for r in products]
    return result

@router.post("/", dependencies=[Depends(require_admin)])
def create_supplier(data: dict, db: Session = Depends(get_db)):
    result = db.execute(text("""
        INSERT INTO Supplier (Company_Name, Contact_Person, Phone, Email, City, Country)
        VALUES (:name, :contact, :phone, :email, :city, :country)
    """), {
        "name":    data.get("Company_Name", ""),
        "contact": data.get("Contact_Person", ""),
        "phone":   data.get("Phone", ""),
        "email":   data.get("Email", ""),
        "city":    data.get("City", ""),
        "country": data.get("Country", "Cambodia"),
    })
    db.commit()
    return {"Supplier_ID": result.lastrowid, "message": "Supplier created"}

@router.put("/{supplier_id}", dependencies=[Depends(require_admin)])
def update_supplier(supplier_id: int, data: dict, db: Session = Depends(get_db)):
    s = db.execute(text("SELECT Supplier_ID FROM Supplier WHERE Supplier_ID=:id"),
                   {"id": supplier_id}).fetchone()
    if not s:
        raise HTTPException(status_code=404, detail="Supplier not found")
    db.execute(text("""
        UPDATE Supplier SET
            Company_Name   = :name,
            Contact_Person = :contact,
            Phone          = :phone,
            Email          = :email,
            City           = :city,
            Country        = :country
        WHERE Supplier_ID = :id
    """), {
        "name":    data.get("Company_Name", ""),
        "contact": data.get("Contact_Person", ""),
        "phone":   data.get("Phone", ""),
        "email":   data.get("Email", ""),
        "city":    data.get("City", ""),
        "country": data.get("Country", "Cambodia"),
        "id":      supplier_id,
    })
    db.commit()
    return {"message": "Supplier updated"}

@router.delete("/{supplier_id}", dependencies=[Depends(require_admin)])
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    db.execute(text("UPDATE Product SET Supplier_ID=NULL WHERE Supplier_ID=:id"),
               {"id": supplier_id})
    db.execute(text("DELETE FROM Supplier WHERE Supplier_ID=:id"),
               {"id": supplier_id})
    db.commit()
    return {"message": "Supplier deleted"}
