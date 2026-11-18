from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Category, Quote, Template
from app.schemas import CategoryResponse, QuoteResponse, TemplateResponse


router = APIRouter(prefix="/api", tags=["categories", "templates"])


def get_category_or_404(category_id: int, db: Session) -> Category:
    category = db.get(Category, category_id)
    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    return category


@router.get("/categories", response_model=list[CategoryResponse])
def list_categories(
    db: Annotated[Session, Depends(get_db)],
) -> list[Category]:
    return list(db.scalars(select(Category).order_by(Category.id)).all())


@router.get(
    "/categories/{category_id}/templates",
    response_model=list[TemplateResponse],
)
def list_category_templates(
    category_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> list[Template]:
    get_category_or_404(category_id, db)
    return list(
        db.scalars(
            select(Template)
            .where(Template.category_id == category_id)
            .order_by(Template.id)
        ).all()
    )


@router.get(
    "/categories/{category_id}/quotes",
    response_model=list[QuoteResponse],
)
def list_category_quotes(
    category_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> list[Quote]:
    get_category_or_404(category_id, db)
    return list(
        db.scalars(
            select(Quote)
            .where(Quote.category_id == category_id)
            .order_by(Quote.id)
        ).all()
    )
