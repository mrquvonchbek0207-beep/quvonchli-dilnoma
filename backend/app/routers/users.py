from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth import create_access_token, get_current_user, hash_password, verify_password
from app.database import get_db
from app.models import User
from app.schemas import (
    Token,
    UserCreate,
    UserLogin,
    UserRegistrationResponse,
    UserResponse,
)


router = APIRouter(prefix="/api/users", tags=["users"])


@router.post(
    "/register",
    response_model=UserRegistrationResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    user_data: UserCreate,
    db: Annotated[Session, Depends(get_db)],
) -> UserRegistrationResponse:
    email = str(user_data.email).lower()
    existing_user = db.scalar(select(User).where(User.email == email))
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )

    user = User(
        full_name=user_data.full_name,
        email=email,
        password_hash=hash_password(user_data.password),
        lang=user_data.lang,
        theme=user_data.theme,
        is_admin=False,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        ) from exc

    db.refresh(user)
    return UserRegistrationResponse(
        access_token=create_access_token(subject=user.email),
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=Token)
def login_user(
    credentials: UserLogin,
    db: Annotated[Session, Depends(get_db)],
) -> Token:
    email = str(credentials.email).lower()
    user = db.scalar(select(User).where(User.email == email))
    if user is None or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return Token(access_token=create_access_token(subject=user.email))


@router.get("/me", response_model=UserResponse)
def read_current_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    return current_user
