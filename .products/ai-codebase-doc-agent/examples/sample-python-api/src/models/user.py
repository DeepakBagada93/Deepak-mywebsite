"""User data model."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Base user fields."""
    email: EmailStr
    full_name: str
    is_active: bool = True


class UserCreate(UserBase):
    """Fields required to create a user."""
    password: str


class User(UserBase):
    """Complete user model with system fields."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """Fields that can be updated on a user."""
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None