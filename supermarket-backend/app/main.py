from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.routers import auth, products, cart, orders, inventory, users, sales, membership, shifts

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Supermarket Management API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,       prefix="/api/auth",       tags=["Auth"])
app.include_router(products.router,   prefix="/api/products",   tags=["Products"])
app.include_router(cart.router,       prefix="/api/cart",       tags=["Cart"])
app.include_router(orders.router,     prefix="/api/orders",     tags=["Orders"])
app.include_router(inventory.router,  prefix="/api/inventory",  tags=["Inventory"])
app.include_router(users.router,      prefix="/api/users",      tags=["Users"])
app.include_router(sales.router,      prefix="/api/sales",      tags=["Sales"])
app.include_router(membership.router, prefix="/api/membership", tags=["Membership"])
app.include_router(shifts.router,     prefix="/api/shifts",     tags=["Shifts"])

@app.get("/")
def root():
    return {"message": "🌿 Supermarket API is running!"}
