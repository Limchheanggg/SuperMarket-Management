from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.dependencies import require_admin
from ..models.user import User as UserModel
from ..models.customer import Customer as CustomerModel
import bcrypt

router = APIRouter()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

@router.get("/employees", dependencies=[Depends(require_admin)])
def get_employees(db: Session = Depends(get_db)):
    users = db.query(UserModel).all()
    return [
        {
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "phone": u.phone,
            "role": u.role or "customer"
        }
        for u in users
    ]

@router.post("/employees", dependencies=[Depends(require_admin)])
def create_employee(data: dict, db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.email == data["email"]).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = UserModel(
        full_name=data.get("full_name", ""),
        email=data["email"],
        password=hash_password(data["password"]),
        phone=data.get("phone", ""),
        role=data.get("role", "employee")
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    if user.role in STAFF_ROLES:
        ensure_default_shift(db, user.id)
    return {"id": user.id, "full_name": user.full_name, "email": user.email, "role": user.role}

@router.put("/employees/{user_id}", dependencies=[Depends(require_admin)])
def update_employee(user_id: int, data: dict, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if "full_name" in data: user.full_name = data["full_name"]
    if "phone"     in data: user.phone     = data["phone"]
    if "role"      in data: user.role      = data["role"]
    if "password"  in data and data["password"]:
        user.password = hash_password(data["password"])
    db.commit()
    if user.role in STAFF_ROLES:
        ensure_default_shift(db, user.id)
    return {"id": user.id, "full_name": user.full_name, "email": user.email, "role": user.role}

@router.delete("/employees/{user_id}", dependencies=[Depends(require_admin)])
def delete_employee(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}

@router.get("/customers", dependencies=[Depends(require_admin)])
def get_customers(db: Session = Depends(get_db)):
    return db.query(CustomerModel).all()

@router.post("/customers", dependencies=[Depends(require_admin)])
def create_customer(data: dict, db: Session = Depends(get_db)):
    customer = CustomerModel(
        First_Name=data.get("First_Name", ""),
        Last_Name=data.get("Last_Name", ""),
        Join_Day=data.get("Join_Day", 1),
        Join_Month=data.get("Join_Month", 1),
        Join_Year=data.get("Join_Year", 2025),
        Loyalty_Points=0
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

@router.put("/customers/{customer_id}", dependencies=[Depends(require_admin)])
def update_customer(customer_id: int, data: dict, db: Session = Depends(get_db)):
    customer = db.query(CustomerModel).filter(CustomerModel.Customer_ID == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    for key, value in data.items():
        if hasattr(customer, key):
            setattr(customer, key, value)
    db.commit()
    return customer

@router.delete("/customers/{customer_id}", dependencies=[Depends(require_admin)])
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(CustomerModel).filter(CustomerModel.Customer_ID == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted"}
