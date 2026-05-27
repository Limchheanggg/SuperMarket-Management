from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, String
from sqlalchemy.sql import func
from ..core.database import Base

class Sale(Base):
    __tablename__ = "Sale"

    Sale_ID = Column(Integer, primary_key=True, autoincrement=True)
    Customer_ID = Column(Integer, ForeignKey("Customer.Customer_ID"), nullable=True)
    Cashier_ID = Column(Integer, ForeignKey("users.id"), nullable=True)
    Total_Amount = Column(Float, nullable=False)
    Discount = Column(Float, default=0)
    Tax = Column(Float, default=0)
    Payment_Method = Column(String(50), default="Cash")
    Status = Column(String(20), default="completed")
    Created_At = Column(DateTime, default=func.now())

class SaleItem(Base):
    __tablename__ = "SaleItem"

    Item_ID = Column(Integer, primary_key=True, autoincrement=True)
    Sale_ID = Column(Integer, ForeignKey("Sale.Sale_ID"), nullable=False)
    Product_ID = Column(Integer, ForeignKey("Product.Product_ID"), nullable=False)
    Quantity = Column(Integer, nullable=False)
    Unit_Price = Column(Float, nullable=False)
    Subtotal = Column(Float, nullable=False)

class Membership(Base):
    __tablename__ = "Membership"

    Membership_ID = Column(Integer, primary_key=True, autoincrement=True)
    Customer_ID = Column(Integer, ForeignKey("Customer.Customer_ID"), nullable=False)
    Tier = Column(String(20), default="Bronze")  # Bronze, Silver, Gold, Platinum
    Points = Column(Integer, default=0)
    Total_Spent = Column(Float, default=0)
    Joined_At = Column(DateTime, default=func.now())