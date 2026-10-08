from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app import schemas, crud
from app.auth import get_current_user

router = APIRouter()

SIMILAR_PRODUCTS = {
    1: [2,3],  # Tomato -> Onion, Potato
    # Add more
}

@router.get("/", response_model=List[schemas.Product])
def read_products(
    skip: int = 0,
    limit: int = Query(20, le=100),
    category: Optional[str] = None,
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    sort: str = "id",
    db: Session = Depends(get_db)
):
    products = crud.get_products(db, skip, limit, category, min_price, max_price, sort)
    return products

@router.get("/{product_id}", response_model=schemas.ProductDetail)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    # Fake recs
    similar_ids = SIMILAR_PRODUCTS.get(product_id, [])
    product.similar = [crud.get_product(db, sid) for sid in similar_ids if sid]
    return product

@router.get("/search")
def search_products(q: str, db: Session = Depends(get_db)):
    products = db.query(schemas.Product).filter(schemas.Product.name.contains(q)).limit(10).all()
    return products
