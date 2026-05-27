from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, String
from sqlalchemy.sql import func
from ..core.database import Base

class Inventory(Base):
    __tablename__ = "Inventory"

    Inventory_ID = Column(Integer, primary_key=True, autoincrement=True)
    Product_ID = Column(Integer, ForeignKey("Product.Product_ID"), nullable=False)
    Quantity = Column(Integer, default=0)
    Last_Updated = Column(DateTime, default=func.now(), onupdate=func.now())

class StockMovement(Base):
    __tablename__ = "StockMovement"

    Movement_ID = Column(Integer, primary_key=True, autoincrement=True)
    Product_ID = Column(Integer, ForeignKey("Product.Product_ID"), nullable=False)
    Movement_Type = Column(String(20))  # "in", "out", "adjustment"
    Quantity = Column(Integer, nullable=False)
    Note = Column(String(255))
    Created_At = Column(DateTime, default=func.now())