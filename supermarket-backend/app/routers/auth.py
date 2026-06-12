from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db
from ..models.user import User as UserModel
from ..core.config import settings
from ..core.dependencies import decode_token
import bcrypt
import jwt
import datetime
from typing import Optional

router = APIRouter()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: int, email: str, role: str = "customer") -> str:
    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def user_to_dict(user, db=None):
    d = {
        "id":    user.id,
        "name":  user.full_name,
        "email": user.email,
        "phone": user.phone,
        "role":  user.role or "customer",
        "membership_tier": "None",
    }
    if db:
        from sqlalchemy import text as sqlt
        cust = db.execute(sqlt("SELECT Customer_ID FROM Customer WHERE User_ID=:uid"), {"uid": user.id}).fetchone()
        if cust:
            d["customer_id"] = cust.Customer_ID
            mem = db.execute(sqlt("SELECT Tier FROM Membership WHERE Customer_ID=:cid"), {"cid": cust.Customer_ID}).fetchone()
            if mem:
                d["membership_tier"] = mem.Tier
    return d

PHONE_RE = re.compile(r'^(0\d{8,9}|\+855\d{8,9})$')

@router.post("/register")
def register(data: dict, db: Session = Depends(get_db)):
    phone_clean = re.sub(r'[\s\-]', '', (data.get("phone") or "").strip())
    if not phone_clean:
        raise HTTPException(status_code=400, detail="Phone number is required")
    if not PHONE_RE.match(phone_clean):
        raise HTTPException(status_code=400, detail="Phone number must be in format 0XXXXXXXX or +855XXXXXXXX (digits only)")
    if db.query(UserModel).filter(UserModel.email == data["email"]).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = UserModel(
        full_name=data.get("name", ""),
        email=data["email"],
        password=hash_password(data["password"]),
        phone=phone_clean,
        role=data.get("role", "customer")
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    name_parts = user.full_name.strip().split(" ", 1)
    first_name = name_parts[0]
    last_name  = name_parts[1] if len(name_parts) > 1 else ""

    now = datetime.datetime.now()
    result = db.execute(text("""
        INSERT INTO Customer (First_Name, Last_Name, Join_Day, Join_Month, Join_Year, Loyalty_Points, User_ID)
        VALUES (:fn, :ln, :day, :month, :year, 0, :uid)
    """), {
        "fn": first_name, "ln": last_name,
        "day": now.day, "month": now.month, "year": now.year,
        "uid": user.id,
    })
    db.commit()
    customer_id = result.lastrowid

    db.execute(text("""
        INSERT INTO Membership (Customer_ID, Tier, Points, Total_Spent, Joined_At)
        VALUES (:cid, 'Bronze', 0, 0, NOW())
    """), {"cid": customer_id})
    db.commit()

    token = create_token(user.id, user.email, user.role or "customer")
    return {"access_token": token, "token_type": "bearer", "user": user_to_dict(user, db)}

@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == data["email"]).first()
    if not user or not verify_password(data["password"], user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user.id, user.email, user.role or "customer")
    return {"access_token": token, "token_type": "bearer", "user": user_to_dict(user, db)}

@router.get("/me")
def get_me(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No token provided")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    user = db.query(UserModel).filter(UserModel.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user_to_dict(user, db)

@router.put("/me")
def update_me(data: dict, authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No token provided")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    user = db.query(UserModel).filter(UserModel.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if "name"     in data: user.full_name = data["name"]
    if "phone"    in data: user.phone     = data["phone"]
    if "password" in data and data["password"]:
        user.password = hash_password(data["password"])
    db.commit()
    db.refresh(user)
    return user_to_dict(user, db)

@router.post("/me")
def get_me_post(data: dict, db: Session = Depends(get_db)):
    payload = decode_token(data.get("token", ""))
    user = db.query(UserModel).filter(UserModel.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user_to_dict(user, db)
