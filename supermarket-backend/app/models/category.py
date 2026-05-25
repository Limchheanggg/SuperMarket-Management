from sqlalchemy import Column, Integer, String
from ..core.database import Base

class Category(Base):
    __tablename__ = "Category"

    Category_ID = Column(Integer, primary_key=True, autoincrement=True)
    Category_Name = Column(String(100), nullable=False)
