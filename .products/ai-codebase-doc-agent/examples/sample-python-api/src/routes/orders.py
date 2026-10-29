"""Order management endpoints."""

from typing import List
from datetime import datetime
from fastapi import APIRouter, HTTPException

from src.models.order import Order, OrderCreate, OrderStatusUpdate
from src.services.payments import process_payment

router = APIRouter()

# In-memory storage for demonstration
_orders_db: dict[int, Order] = {}
_next_id = 1


@router.get("/", response_model=List[Order])
async def list_orders(skip: int = 0, limit: int = 100):
    """List all orders with pagination."""
    return list(_orders_db.values())[skip : skip + limit]


@router.post("/", response_model=Order, status_code=201)
async def create_order(order: OrderCreate):
    """Create a new order and process payment."""
    global _next_id
    total = sum(item.unit_price * item.quantity for item in order.items)
    payment_successful = await process_payment(order.user_id, total)
    if not payment_successful:
        raise HTTPException(status_code=402, detail="Payment failed")

    new_order = Order(
        id=_next_id,
        user_id=order.user_id,
        items=order.items,
        total_amount=total,
        status="confirmed" if payment_successful else "pending",
        created_at=datetime.utcnow(),
    )
    _orders_db[_next_id] = new_order
    _next_id += 1
    return new_order


@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: int):
    """Get a specific order by ID."""
    order = _orders_db.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.patch("/{order_id}/status", response_model=Order)
async def update_order_status(order_id: int, status_update: OrderStatusUpdate):
    """Update an order's status (e.g., shipped, delivered, cancelled)."""
    order = _orders_db.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    valid_statuses = {"pending", "confirmed", "shipped", "delivered", "cancelled"}
    if status_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    updated_order = order.model_copy(update={"status": status_update.status, "updated_at": datetime.utcnow()})
    _orders_db[order_id] = updated_order
    return updated_order