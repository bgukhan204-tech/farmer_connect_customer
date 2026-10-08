import sys
sys.path.append('app')
from app.database import SessionLocal, engine
from app.models import Base, Product, User
from app.database import SessionLocal, engine
import sys
sys.path.append('.')
from passlib.context import CryptContext

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

db = SessionLocal()

# Create farmer
farmer_check = db.query(User).filter(User.username == "farmer1").first()
if not farmer_check:
farmer = User(username="farmer1", email="farmer@example.com", hashed_password="hashedpass123") # pre-hashed 'password'

    db.add(farmer)
    db.commit()
    db.refresh(farmer)
    print("Created farmer1")

# Seed products if not exist
products_data = [
    {"name": "Premium Basmati Rice", "description": "Long grain basmati rice from Punjab farms", "price": 85, "category": "Rice", "image_url": "https://images.unsplash.com/photo-1583783733709-075a0a825b11?w=400", "farmer_id": farmer.id, "rating": 4.5},
    {"name": "Organic Brown Rice", "description": "Healthy brown rice rich in fiber", "price": 95, "category": "Rice", "image_url": "https://images.unsplash.com/photo-1621996346565-e3dbc353d2ef?w=400", "farmer_id": farmer.id, "rating": 4.7},
    {"name": "Sona Masoori Rice", "description": "Popular South Indian rice variety", "price": 75, "category": "Rice", "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400", "farmer_id": farmer.id, "rating": 4.2},
    {"name": "Red Apples", "description": "Fresh red apples from Himachal", "price": 120, "category": "Fruits", "image_url": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400", "farmer_id": farmer.id, "rating": 4.8},
    {"name": "Bananas", "description": "Robusta bananas - 12pcs pack", "price": 45, "category": "Fruits", "image_url": "https://images.unsplash.com/photo-1571771894821-ce9b6c223e00?w=400", "farmer_id": farmer.id, "rating": 4.4},
    {"name": "Fresh Mangoes", "description": "Alphonso mangoes - seasonal", "price": 250, "category": "Fruits", "image_url": "https://images.unsplash.com/photo-1580052614034-c3ef4ad6fc1c?w=400", "farmer_id": farmer.id, "rating": 4.9},
    {"name": "Organic Tomatoes", "description": "Fresh vine-ripened tomatoes", "price": 65, "category": "Vegetables", "image_url": "https://images.unsplash.com/photo-1542994983-55d35fe75467?w=400", "farmer_id": farmer.id, "rating": 4.3},
    {"name": "Red Onions", "description": "Fresh red onions from local farms", "price": 55, "category": "Vegetables", "image_url": "https://images.unsplash.com/photo-1632297899826-58d8b4b98b67?w=400", "farmer_id": farmer.id, "rating": 4.6},
    {"name": "Potatoes", "description": "Fresh potatoes - 1kg", "price": 35, "category": "Vegetables", "image_url": "https://images.unsplash.com/photo-1606716315330-874d117f8a2f?w=400", "farmer_id": farmer.id, "rating": 4.1},
    {"name": "Carrots", "description": "Organic carrots rich in beta carotene", "price": 70, "category": "Vegetables", "image_url": "https://images.unsplash.com/photo-1596329244708-6a12a5c4b00f?w=400", "farmer_id": farmer.id, "rating": 4.5},
    {"name": "Green Chilies", "price": 80, "category": "Vegetables", "image_url": "https://images.unsplash.com/photo-1581637685576-73f1b0c12f4d?w=400", "farmer_id": farmer.id, "rating": 4.4, "description": "Fresh green chilies"},
    {"name": "Cabbage", "price": 40, "category": "Vegetables", "image_url": "https://images.unsplash.com/photo-1551218809-7388a848f8a6?w=400", "farmer_id": farmer.id, "rating": 4.2, "description": "Fresh cabbage"},
]

added = 0
for data in products_data:
    if not db.query(Product).filter(Product.name == data["name"]).first():
        product = Product(**data)
        db.add(product)
        added += 1

db.commit()
print(f"Seeded {added} products! Total products: {db.query(Product).count()}")
db.close()
print("✅ Database seeded successfully!")
