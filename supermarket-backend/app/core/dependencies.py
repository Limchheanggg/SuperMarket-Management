from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from .database import get_db
from .config import settings
from ..models.user import User as UserModel
import jwt

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    user = db.query(UserModel).filter(UserModel.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def require_admin(current_user: UserModel = Depends(get_current_user)):
    if current_user.role not in ("admin", "manager"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

def require_staff(current_user: UserModel = Depends(get_current_user)):
    if current_user.role not in ("admin", "manager", "cashier", "employee"):
        raise HTTPException(status_code=403, detail="Staff access required")
    return current_user