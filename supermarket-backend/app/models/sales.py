from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, String, Numeric, Time, Enum
from sqlalchemy.sql import func
from ..core.database import Base

class Sale(Base):
    __tablename__ = "Sale"

    Sale_ID        = Column(Integer, primary_key=True, autoincrement=True)
    Sale_Day       = Column(Integer, nullable=False, default=1)
    Sale_Month     = Column(Integer, nullable=False, default=1)
    Sale_Year      = Column(Integer, nullable=False, default=2025)
    Sale_Time      = Column(Time, nullable=False)
    Employee_ID    = Column(Integer, ForeignKey("users.id"), nullable=False, default=1)
    Customer_ID    = Column(Integer, ForeignKey("Customer.Customer_ID"), nullable=True)
    Payment_Method = Column(String(50), default="Cash")
    Discount       = Column(Float, default=0)
    Tax            = Column(Float, default=0)
    Total_Amount   = Column(Float, nullable=False)

class SaleItem(Base):
    __tablename__ = "SaleItem"

    Item_ID    = Column(Integer, primary_key=True, autoincrement=True)
    Sale_ID    = Column(Integer, ForeignKey("Sale.Sale_ID"), nullable=False)
    Product_ID = Column(Integer, ForeignKey("Product.Product_ID"), nullable=False)
    Quantity   = Column(Integer, nullable=False)
    Unit_Price = Column(Float, nullable=False)
    Subtotal   = Column(Float, nullable=False)

class Membership(Base):
    __tablename__ = "Membership"

    Membership_ID = Column(Integer, primary_key=True, autoincrement=True)
    Customer_ID   = Column(Integer, ForeignKey("Customer.Customer_ID"), nullable=False)
    Tier          = Column(String(20), default="Bronze")
    Points        = Column(Integer, default=0)
    Total_Spent   = Column(Float, default=0)
    Joined_At     = Column(DateTime, default=func.now())