from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# Product
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: str
    farmer_id: int
    rating: float = 0.0

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

class ProductDetail(Product):
    farmer: Optional['User'] = None

# Cart
class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: int
    product: Product

    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    items: List[CartItem] = []

# Order
class OrderCreate(BaseModel):
    items: List[CartItemCreate]
    address: str
    payment_method: str = "COD"

class OrderBase(BaseModel):
    id: int
    total: float
    status: str
    address: str
    payment_method: str
    created_at: datetime

    class Config:
        from_attributes = True

class Order(OrderBase):
    items: List['OrderItem'] = []

class OrderItem(BaseModel):
    id: int
    quantity: int
    price: float
    product: Product

    class Config:
        from_attributes = True

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
