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
    APP_ENV = os.getenv("APP_ENV", "development").lower()
    SECRET_KEY = _get_env(
        "FLASK_SECRET_KEY",
        "dev-secret-key-noorhub-2026-change-in-production-abcdef123456",
    )
    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    # ── Database ─────────────────────────────────────────────────────────────
    # Use sqlite:///noorhub_dev.db by default.
    # On Render and other platforms, PostgreSQL URLs may start with postgres://
    # or DATABASE_URL might be empty string. We clean and format it for SQLAlchemy.
    _raw_db_url = os.getenv("DATABASE_URL", "").strip()
    if _raw_db_url.startswith("postgres://"):
        _raw_db_url = _raw_db_url.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = _raw_db_url if _raw_db_url else "sqlite:///noorhub_dev.db"
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
    API_ORIGIN = os.getenv("API_ORIGIN", "http://localhost:5000")
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")

    if APP_ENV == "production":
        if DEBUG:
            raise RuntimeError("FLASK_DEBUG must be false in production.")
        required = ["FLASK_SECRET_KEY", "JWT_SECRET_KEY", "DATABASE_URL", "ALLOWED_ORIGIN", "API_ORIGIN"]
        missing = [name for name in required if not os.getenv(name)]
        if missing:
            raise RuntimeError("Missing required production configuration: " + ", ".join(missing))
        if not os.getenv("ALLOWED_ORIGIN", "").startswith("https://"):
            raise RuntimeError("ALLOWED_ORIGIN must use HTTPS in production.")
        if not os.getenv("API_ORIGIN", "").startswith("https://"):
            raise RuntimeError("API_ORIGIN must use HTTPS in production.")

    # ── Google OAuth (optional) ───────────────────────────────────────────────
    GOOGLE_OAUTH_CLIENT_ID = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
    GOOGLE_OAUTH_CLIENT_SECRET = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")
