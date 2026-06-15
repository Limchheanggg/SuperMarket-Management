from sqlalchemy import Column, Integer, String
from ..core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255))
    phone = Column(String(20))
    role = Column(String(20), default="customer")
    address = Column(String(255), nullable=True)
