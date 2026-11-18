from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


Language = Literal["uz", "ru", "en"]
Theme = Literal["light", "dark"]


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=150)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    lang: Language = "uz"
    theme: Theme = "light"


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(ORMModel):
    id: int
    full_name: str
    email: EmailStr
    lang: Language
    theme: Theme
    created_at: datetime


UserRead = UserResponse


class CategoryCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=100)
    name_uz: str = Field(min_length=1, max_length=150)
    name_ru: str = Field(min_length=1, max_length=150)
    name_en: str = Field(min_length=1, max_length=150)
    icon: str = Field(min_length=1, max_length=100)


class CategoryResponse(ORMModel):
    id: int
    slug: str
    name_uz: str
    name_ru: str
    name_en: str
    icon: str


CategoryRead = CategoryResponse


class TemplateCreate(BaseModel):
    category_id: int = Field(gt=0)
    name_uz: str = Field(min_length=1, max_length=150)
    name_ru: str = Field(min_length=1, max_length=150)
    name_en: str = Field(min_length=1, max_length=150)
    style_config: dict[str, object] = Field(default_factory=dict)
    preview_img: str | None = Field(default=None, max_length=500)


class TemplateResponse(ORMModel):
    id: int
    category_id: int
    name_uz: str
    name_ru: str
    name_en: str
    style_config: dict[str, object]
    preview_img: str | None


TemplateRead = TemplateResponse


class QuoteCreate(BaseModel):
    category_id: int = Field(gt=0)
    relation: str | None = Field(default=None, max_length=100)
    mood: str | None = Field(default=None, max_length=100)
    text_uz: str = Field(min_length=1)
    text_ru: str = Field(min_length=1)
    text_en: str = Field(min_length=1)


class QuoteResponse(ORMModel):
    id: int
    category_id: int
    relation: str | None
    mood: str | None
    text_uz: str
    text_ru: str
    text_en: str


QuoteRead = QuoteResponse


class CardCreate(BaseModel):
    user_id: int = Field(gt=0)
    template_id: int = Field(gt=0)
    slug: str = Field(min_length=1, max_length=150)
    sender_name: str = Field(min_length=1, max_length=150)
    recipient_name: str = Field(min_length=1, max_length=150)
    message: str = Field(min_length=1)
    lang: Language = "uz"
    theme_mode: Theme = "light"


class CardRead(ORMModel):
    id: int
    user_id: int
    template_id: int
    slug: str
    sender_name: str
    recipient_name: str
    message: str
    lang: Language
    theme_mode: Theme
