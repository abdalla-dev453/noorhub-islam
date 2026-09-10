import os
from datetime import timedelta
from pathlib import Path

# Load .env file explicitly if python-dotenv is available
try:
    from dotenv import load_dotenv

    env_path = Path(__file__).resolve().parent / ".env"
    load_dotenv(dotenv_path=env_path)
except ImportError:
    pass


def _get_env(key: str, default: str) -> str:
    """Read an environment variable with a safe default."""
    return os.getenv(key, default)


class Config:
    """Flask configuration loaded from environment variables."""

    # ── Core Flask ───────────────────────────────────────────────────────────
    SECRET_KEY = _get_env(
        "FLASK_SECRET_KEY",
        "dev-secret-key-noorhub-2026-change-in-production-abcdef123456",
    )
    DEBUG = os.getenv("FLASK_DEBUG", "true").lower() == "true"

    # ── Database ─────────────────────────────────────────────────────────────
    # Use sqlite:///noorhub_dev.db by default
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///noorhub_dev.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ── JWT ──────────────────────────────────────────────────────────────────
    JWT_SECRET_KEY = _get_env(
        "JWT_SECRET_KEY",
        "dev-jwt-key-noorhub-2026-change-in-production-xyz789uvw",
    )
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "3600")))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(
        seconds=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES", "2592000"))
    )
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    # ── CORS ─────────────────────────────────────────────────────────────────
    ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:5173")

    # ── Google OAuth (optional) ───────────────────────────────────────────────
    GOOGLE_OAUTH_CLIENT_ID = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
    GOOGLE_OAUTH_CLIENT_SECRET = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")
