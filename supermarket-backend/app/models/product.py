from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from ..core.database import Base

class Product(Base):
    __tablename__ = "Product"

    Product_ID    = Column(Integer, primary_key=True, autoincrement=True)
    Barcode       = Column(String(50), unique=True, nullable=False)
    Name          = Column(String(100), nullable=False)
    Description   = Column(Text)
    Category_ID   = Column(Integer, ForeignKey("Category.Category_ID"))
    Brand         = Column(String(100))
    Unit          = Column(String(20), nullable=False)
    Unit_Price    = Column(Float, nullable=False)
    Unit_Mass_Kg  = Column(Float)
    Reorder_Level = Column(Integer, default=10)
    Is_Perishable = Column(Integer, default=0)
    Product_Image = Column(Text)   # ← Text instead of String(255)
