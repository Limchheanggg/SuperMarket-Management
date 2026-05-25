from sqlalchemy import Column, Integer, String, Text
from ..core.database import Base

class Customer(Base):
    __tablename__ = "Customer"

    Customer_ID = Column(Integer, primary_key=True, autoincrement=True)
    First_Name = Column(String(50), nullable=False)
    Last_Name = Column(String(50), nullable=False)
    Join_Day = Column(Integer)
    Join_Month = Column(Integer)
    Join_Year = Column(Integer)
    Loyalty_Points = Column(Integer, default=0)
