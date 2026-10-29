"""Authentication service."""

from typing import Optional
from datetime import datetime, timedelta


class AuthService:
    """Handles user authentication and token management."""

    def __init__(self, secret_key: str, token_expiry_hours: int = 24):
        self.secret_key = secret_key
        self.token_expiry = timedelta(hours=token_expiry_hours)

    async def authenticate(self, email: str, password: str) -> Optional[str]:
        """Authenticate a user and return a JWT token.

        Args:
            email: User's email address
            password: User's password (plain text)

        Returns:
            JWT token string if authentication succeeds, None otherwise.
        """
        # In a real implementation, this would verify against a database
        # and generate a proper JWT
        if email and password:
            return f"mock_token_{email}"
        return None

    async def verify_token(self, token: str) -> Optional[dict]:
        """Verify a JWT token and return its payload.

        Args:
            token: JWT token string

        Returns:
            Decoded token payload if valid, None otherwise.
        """
        # Mock implementation
        if token.startswith("mock_token_"):
            email = token.replace("mock_token_", "")
            return {"sub": email, "exp": datetime.utcnow() + self.token_expiry}
        return None


auth_service = AuthService(secret_key="your-secret-key-here")