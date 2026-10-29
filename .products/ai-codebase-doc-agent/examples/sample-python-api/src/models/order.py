"""Order data model."""

from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel


class OrderItem(BaseModel):
    """A single item within an order."""
    product_id: int
    product_name: str
    quantity: int
    unit_price: Decimal


class OrderCreate(BaseModel):
    """Fields required to create an order."""
    user_id: int
    items: list[OrderItem]
    shipping_address: str


class Order(BaseModel):
    """Complete order model with system fields."""
    id: int
    user_id: int
    items: list[OrderItem]
    total_amount: Decimal
    status: str  # pending, confirmed, shipped, delivered, cancelled
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    """Status update for an order."""
    status: str