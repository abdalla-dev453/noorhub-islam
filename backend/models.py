import sys
from datetime import datetime, timezone
from pathlib import Path

# Ensure backend directory is in sys.path
_DIR = Path(__file__).resolve().parent
if str(_DIR) not in sys.path:
    sys.path.insert(0, str(_DIR))

from extensions import db


class User(db.Model):
    """Registered user account."""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    name = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationship to progress records
    progress_records = db.relationship(
        "UserProgress", back_populates="user", cascade="all, delete-orphan"
    )

    def to_dict(self):
        """Safe public representation — never includes the password hash."""
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "created_at": self.created_at.isoformat(),
        }


class UserProgress(db.Model):
    """Tracks lesson completion per user. Replaces frontend localStorage."""

    __tablename__ = "user_progress"
    __table_args__ = (
        db.UniqueConstraint("user_id", "track_id", "lesson_id", name="uq_user_lesson"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    track_id = db.Column(db.Integer, nullable=False)
    lesson_id = db.Column(db.String(20), nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = db.relationship("User", back_populates="progress_records")

    def to_dict(self):
        return {
            "id": self.id,
            "track_id": self.track_id,
            "lesson_id": self.lesson_id,
            "completed": self.completed,
            "updated_at": self.updated_at.isoformat(),
        }


class RevokedToken(db.Model):
    """JWT identifiers invalidated by logout or refresh-token rotation."""

    __tablename__ = "revoked_tokens"

    jti = db.Column(db.String(64), primary_key=True)
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False, index=True)
    revoked_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


# Alias UserProgress as LessonProgress for backward/test compatibility
LessonProgress = UserProgress

# Alias module in sys.modules
sys.modules["backend.models"] = sys.modules[__name__]
