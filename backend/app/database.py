import os
from collections.abc import Generator
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


BACKEND_DIR = Path(__file__).resolve().parents[1]
DEFAULT_DATABASE_URL = f"sqlite:///{(BACKEND_DIR / 'joyful_dilnoma.db').as_posix()}"


def normalize_database_url(database_url: str | None) -> str:
    if not database_url:
        return DEFAULT_DATABASE_URL
    if database_url.startswith("postgres://"):
        return database_url.replace("postgres://", "postgresql+psycopg://", 1)
    if database_url.startswith("postgresql://"):
        return database_url.replace("postgresql://", "postgresql+psycopg://", 1)
    return database_url


DATABASE_URL = normalize_database_url(os.getenv("DATABASE_URL"))

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
