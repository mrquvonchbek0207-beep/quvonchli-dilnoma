import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import EmailStr, TypeAdapter, ValidationError
from sqlalchemy import inspect, select, text

from app.auth import hash_password
from app.database import Base, SessionLocal, engine
from app import models  # noqa: F401 - registers models with Base.metadata
from app.models import Category, Template, User
from app.routers.admin import router as admin_router
from app.routers.templates import router as templates_router
from app.routers.users import router as users_router
from seed_data import seed_data


DEFAULT_ADMIN_EMAIL = "mr.quvonchbek0207@gmail.com"


def ensure_user_admin_column() -> None:
    columns = {column["name"] for column in inspect(engine).get_columns("users")}
    if "is_admin" not in columns:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE"
                )
            )


def ensure_default_admin() -> None:
    raw_email = os.getenv("ADMIN_EMAIL", DEFAULT_ADMIN_EMAIL).strip()
    password = os.getenv("ADMIN_PASSWORD", "")
    full_name = os.getenv("ADMIN_FULL_NAME", "Joyful Dilnoma Admin").strip()
    if not raw_email or not password:
        raise RuntimeError(
            f"Set ADMIN_PASSWORD to bootstrap the default admin account "
            f"({raw_email or DEFAULT_ADMIN_EMAIL}). ADMIN_EMAIL may override "
            "the default address."
        )
    if not 8 <= len(password) <= 128:
        raise RuntimeError("ADMIN_PASSWORD must contain between 8 and 128 characters.")
    if not 1 <= len(full_name) <= 150:
        raise RuntimeError("ADMIN_FULL_NAME must contain between 1 and 150 characters.")

    try:
        email = str(TypeAdapter(EmailStr).validate_python(raw_email)).lower()
    except ValidationError as exc:
        raise RuntimeError("ADMIN_EMAIL must be a valid email address.") from exc

    with SessionLocal.begin() as session:
        admin = session.scalar(select(User).where(User.email == email))
        if admin is None:
            session.add(
                User(
                    full_name=full_name,
                    email=email,
                    password_hash=hash_password(password),
                    is_admin=True,
                )
            )
        elif not admin.is_admin:
            admin.is_admin = True
    print(f"Default admin account is ready: {email}")


def seed_catalog_if_empty() -> None:
    with SessionLocal() as session:
        categories_exist = session.scalar(select(Category.id).limit(1)) is not None
        templates_exist = session.scalar(select(Template.id).limit(1)) is not None
    if not categories_exist or not templates_exist:
        seed_data()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    ensure_user_admin_column()
    ensure_default_admin()
    seed_catalog_if_empty()
    yield


app = FastAPI(title="Joyful Dilnoma API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(templates_router)
app.include_router(admin_router)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
