from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.database import Base, engine
from app.routers import auth, products, inventory, users, sales, membership, shifts, coupons, upload, suppliers
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Supermarket Management API", version="2.0.0")

origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_dir = os.path.join(os.path.dirname(__file__), "../static/images")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static/images", StaticFiles(directory=static_dir), name="images")

app.include_router(auth.router,       prefix="/api/auth",       tags=["Auth"])
app.include_router(products.router,   prefix="/api/products",   tags=["Products"])
app.include_router(inventory.router,  prefix="/api/inventory",  tags=["Inventory"])
app.include_router(users.router,      prefix="/api/users",      tags=["Users"])
app.include_router(sales.router,      prefix="/api/sales",      tags=["Sales"])
app.include_router(membership.router, prefix="/api/membership", tags=["Membership"])
app.include_router(shifts.router,     prefix="/api/shifts",     tags=["Shifts"])
app.include_router(coupons.router,    prefix="/api/coupons",    tags=["Coupons"])
app.include_router(upload.router,     prefix="/api/upload",     tags=["Upload"])
app.include_router(suppliers.router,  prefix="/api/suppliers",  tags=["Suppliers"])

@app.get("/")
def root():
    return {"message": "Supermarket API is running!"}
