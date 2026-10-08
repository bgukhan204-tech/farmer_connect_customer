from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import get_db
from app.auth import get_current_user
from app.models import User

router = APIRouter()

@router.post("/", response_model=schemas.CartItem)
def add_to_cart(
    cart_item: schemas.CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.create_cart_item(db, cart_item, current_user.id)

@router.get("/", response_model=schemas.CartResponse)
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = crud.get_cart_items(db, current_user.id)
    return schemas.CartResponse(items=items)

@router.delete("/{cart_id}")
def remove_from_cart(
    cart_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart_item = crud.delete_cart_item(db, cart_id, current_user.id)
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Removed"}

