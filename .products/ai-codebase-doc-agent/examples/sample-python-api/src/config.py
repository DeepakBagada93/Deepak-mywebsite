"""Application configuration management."""

import os
from typing import Optional


class Settings:
    """Application settings loaded from environment variables."""

    def __init__(self):
        self.DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./data.db")
        self.REDIS_URL: Optional[str] = os.getenv("REDIS_URL")
        self.SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production")
        self.API_V1_PREFIX: str = "/api/v1"
        self.PROJECT_NAME: str = "Sample Python API"
        self.VERSION: str = "0.1.0"
        self.DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
        self.ALLOWED_HOSTS: list[str] = os.getenv("ALLOWED_HOSTS", "*").split(",")


settings = Settings()