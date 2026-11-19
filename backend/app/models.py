from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, String, Text, false, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    lang: Mapped[str] = mapped_column(String(2), nullable=False, default="uz")
    theme: Mapped[str] = mapped_column(String(10), nullable=False, default="light")
    is_admin: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default=false()
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    cards: Mapped[list["Card"]] = relationship(back_populates="user")


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    name_uz: Mapped[str] = mapped_column(String(150), nullable=False)
    name_ru: Mapped[str] = mapped_column(String(150), nullable=False)
    name_en: Mapped[str] = mapped_column(String(150), nullable=False)
    icon: Mapped[str] = mapped_column(String(100), nullable=False)

    templates: Mapped[list["Template"]] = relationship(back_populates="category")
    quotes: Mapped[list["Quote"]] = relationship(back_populates="category")


class Template(Base):
    __tablename__ = "templates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"), nullable=False, index=True
    )
    name_uz: Mapped[str] = mapped_column(String(150), nullable=False)
    name_ru: Mapped[str] = mapped_column(String(150), nullable=False)
    name_en: Mapped[str] = mapped_column(String(150), nullable=False)
    style_config: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    preview_img: Mapped[str | None] = mapped_column(String(500), nullable=True)

    category: Mapped["Category"] = relationship(back_populates="templates")
    cards: Mapped[list["Card"]] = relationship(back_populates="template")


class Quote(Base):
    __tablename__ = "quotes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"), nullable=False, index=True
    )
    relation: Mapped[str | None] = mapped_column(String(100), nullable=True)
    mood: Mapped[str | None] = mapped_column(String(100), nullable=True)
    text_uz: Mapped[str] = mapped_column(Text, nullable=False)
    text_ru: Mapped[str] = mapped_column(Text, nullable=False)
    text_en: Mapped[str] = mapped_column(Text, nullable=False)

    category: Mapped["Category"] = relationship(back_populates="quotes")


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    template_id: Mapped[int] = mapped_column(
        ForeignKey("templates.id"), nullable=False, index=True
    )
    slug: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    sender_name: Mapped[str] = mapped_column(String(150), nullable=False)
    recipient_name: Mapped[str] = mapped_column(String(150), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    lang: Mapped[str] = mapped_column(String(2), nullable=False, default="uz")
    theme_mode: Mapped[str] = mapped_column(String(10), nullable=False, default="light")

    user: Mapped["User"] = relationship(back_populates="cards")
    template: Mapped["Template"] = relationship(back_populates="cards")
