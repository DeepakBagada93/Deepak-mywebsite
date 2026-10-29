"""User CRUD endpoints."""

from typing import List
from fastapi import APIRouter, HTTPException, Depends

from src.models.user import User, UserCreate, UserUpdate

router = APIRouter()

# In-memory storage for demonstration
_users_db: dict[int, User] = {}
_next_id = 1


def _get_user_or_404(user_id: int) -> User:
    """Get a user by ID or raise 404."""
    user = _users_db.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/", response_model=List[User])
async def list_users(skip: int = 0, limit: int = 100):
    """List all users with pagination."""
    return list(_users_db.values())[skip : skip + limit]


@router.post("/", response_model=User, status_code=201)
async def create_user(user: UserCreate):
    """Create a new user."""
    global _next_id
    new_user = User(
        id=_next_id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        created_at=datetime.utcnow(),
    )
    _users_db[_next_id] = new_user
    _next_id += 1
    return new_user


@router.get("/{user_id}", response_model=User)
async def get_user(user_id: int):
    """Get a specific user by ID."""
    return _get_user_or_404(user_id)


@router.patch("/{user_id}", response_model=User)
async def update_user(user_id: int, update: UserUpdate):
    """Update a user's fields."""
    user = _get_user_or_404(user_id)
    update_data = update.model_dump(exclude_unset=True)
    updated_user = user.model_copy(update=update_data)
    _users_db[user_id] = updated_user
    return updated_user


@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: int):
    """Delete a user."""
    _get_user_or_404(user_id)  # Verify exists
    del _users_db[user_id]