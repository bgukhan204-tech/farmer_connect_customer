from sqlalchemy.orm import Session
from sqlalchemy import or_
from passlib.context import CryptContext
from . import models, schemas
from .auth import verify_password
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User CRUD
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Product CRUD
def get_products(db: Session, skip: int = 0, limit: int = 100, category: Optional[str] = None, min_price: Optional[float] = None, max_price: Optional[float] = None, sort: str = "id"):
    query = db.query(models.Product)
    if category:
        query = query.filter(models.Product.category == category)
    if min_price:
        query = query.filter(models.Product.price >= min_price)
    if max_price:
        query = query.filter(models.Product.price <= max_price)
    if sort == "price":
        query = query.order_by(models.Product.price.asc())
    elif sort == "popularity":
        query = query.order_by(models.Product.rating.desc())
    return query.offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products_by_search(db: Session, q: str):
    return db.query(models.Product).filter(models.Product.name.contains(q)).limit(10).all()

# Cart CRUD
def create_cart_item(db: Session, cart_item: schemas.CartItemCreate, user_id: int):
    db_cart = models.CartItem(**cart_item.dict(), user_id=user_id)
    db.add(db_cart)
    db.commit()
    db.refresh(db_cart)
    return db_cart

def get_cart_items(db: Session, user_id: int):
    return db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()

def delete_cart_item(db: Session, cart_item_id: int, user_id: int):
    cart_item = db.query(models.CartItem).filter(models.CartItem.id == cart_item_id, models.CartItem.user_id == user_id).first()
    if cart_item:
        db.delete(cart_item)
        db.commit()
    return cart_item

# Order CRUD
def create_order(db: Session, order: schemas.OrderCreate, user_id: int):
    total = 0.0
    for item in order.items:
        product = get_product(db, item.product_id)
        if product:
            total += product.price * item.quantity
    db_order = models.Order(user_id=user_id, total=total, address=order.address, payment_method=order.payment_method)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    for item in order.items:
        product = get_product(db, item.product_id)
        db_item = models.OrderItem(order_id=db_order.id, product_id=item.product_id, quantity=item.quantity, price=product.price)
        db.add(db_item)
    db.commit()
    # Clear cart
    db.query(models.CartItem).filter(models.CartItem.user_id == user_id).delete()
    db.commit()
    return db_order

def get_orders(db: Session, user_id: int):
    return db.query(models.Order).filter(models.Order.user_id == user_id).all()

def get_password_hash(password):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.hash(password[:72])

