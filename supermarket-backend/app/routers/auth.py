from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import User as UserModel
from ..core.config import settings
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

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def user_to_dict(user):
    return {
        "id":    user.id,
        "name":  user.full_name,
        "email": user.email,
        "phone": user.phone,
        "role":  user.role or "customer",
    }

@router.post("/register")
def register(data: dict, db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.email == data["email"]).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = UserModel(
        full_name=data.get("name", ""),
        email=data["email"],
        password=hash_password(data["password"]),
        phone=data.get("phone", ""),
        role=data.get("role", "customer")
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_token(user.id, user.email, user.role or "customer")
    return {"access_token": token, "token_type": "bearer", "user": user_to_dict(user)}

@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == data["email"]).first()
    if not user or not verify_password(data["password"], user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user.id, user.email, user.role or "customer")
    return {"access_token": token, "token_type": "bearer", "user": user_to_dict(user)}

@router.get("/me")
def get_me(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No token provided")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    user = db.query(UserModel).filter(UserModel.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user_to_dict(user)

@router.put("/me")
def update_me(data: dict, authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No token provided")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    user = db.query(UserModel).filter(UserModel.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if "name" in data:      user.full_name = data["name"]
    if "phone" in data:     user.phone     = data["phone"]
    if "password" in data and data["password"]:
        user.password = hash_password(data["password"])
    db.commit()
    db.refresh(user)
    return user_to_dict(user)

@router.post("/me")
def get_me_post(data: dict, db: Session = Depends(get_db)):
    payload = decode_token(data.get("token", ""))
    user = db.query(UserModel).filter(UserModel.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user_to_dict(user)
