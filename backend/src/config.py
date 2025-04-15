from pydantic import BaseSettings
import os
from typing import Optional


class Settings(BaseSettings):
    # Authentication settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-local-development")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/llm_platform")
    
    # MongoDB settings
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://root:example@mongodb:27017/")
    MONGODB_DB: str = os.getenv("MONGODB_DB", "llm_platform")
    
    # File storage settings
    STORAGE_PATH: str = os.getenv("STORAGE_PATH", "/app/storage")
    
    # Model settings
    MODEL_REGISTRY_PATH: str = os.getenv("MODEL_REGISTRY_PATH", "/app/models")
    
    class Config:
        env_file = ".env"


settings = Settings() 