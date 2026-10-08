from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routes import products as products_router
from .routes import cart as cart_router
from .routes import orders as orders_router
from .routes import auth as auth_router

# Base.metadata.create_all(bind=engine)  # Skip if tables exist

app = FastAPI(title="AgriConnect API", version="1.0.0")


app.add_middleware(
    CORSMiddleware,
allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router.router, prefix="/auth", tags=["auth"])
app.include_router(products_router.router, prefix="/products", tags=["products"])
app.include_router(cart_router.router, prefix="/cart", tags=["cart"])
app.include_router(orders_router.router, prefix="/orders", tags=["orders"])

@app.get("/")
def read_root():
    return {"message": "AgriConnect E-Commerce API - Flipkart for Farmers"}



