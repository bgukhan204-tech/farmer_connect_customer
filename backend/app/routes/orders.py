from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import get_db
from app.auth import get_current_user
from app.models import User

router = APIRouter()

@router.post("/", response_model=schemas.Order)
def create_order(
    order: schemas.OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.create_order(db, order, current_user.id)

@router.get("/", response_model=List[schemas.Order])
def get_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_orders(db, current_user.id)

