import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    
    if not SQLALCHEMY_DATABASE_URI:
        raise ValueError("Missing DATABASE_URL environment variable")
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_secret")

config = Config()
