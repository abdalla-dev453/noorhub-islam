import re
import sys
from pathlib import Path
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    get_jwt,
    jwt_required,
    decode_token,
)

# Ensure backend directory is in sys.path
_DIR = Path(__file__).resolve().parent.parent
if str(_DIR) not in sys.path:
    sys.path.insert(0, str(_DIR))

from extensions import db
from models import RevokedToken, User
from datetime import datetime, timezone
from sqlalchemy.exc import IntegrityError

auth_bp = Blueprint("auth", __name__)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _revoke_claims(claims: dict) -> None:
    jti = claims["jti"]
    if db.session.get(RevokedToken, jti) is None:
        db.session.add(RevokedToken(
            jti=jti,
            expires_at=datetime.fromtimestamp(claims["exp"], tz=timezone.utc),
        ))


def _validate_register(data: dict) -> list[str]:
    """Return a list of validation error strings, empty if valid."""
    errors = []
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or len(name) < 2:
        errors.append("Name must be at least 2 characters.")
    if len(name) > 120:
        errors.append("Name must be 120 characters or fewer.")
    if not email or not EMAIL_RE.match(email):
        errors.append("A valid email address is required.")
    if len(email) > 255:
        errors.append("Email address is too long.")
    if len(password) < 8:
        errors.append("Password must be at least 8 characters.")
    if len(password) > 128:
        errors.append("Password must be 128 characters or fewer.")
    return errors


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    errors = _validate_register(data)
    if errors:
        return jsonify({"errors": errors}), 422

    email = data["email"].strip().lower()
    name = data["name"].strip()
    password = data["password"]

    if User.query.filter_by(email=email).first():
        return jsonify({"errors": ["An account with this email already exists."]}), 409

    password_hash = generate_password_hash(password)
    user = User(email=email, name=name, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return (
        jsonify(
            {
                "user": user.to_dict(),
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
        ),
        201,
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"errors": ["Email and password are required."]}), 422

    user = User.query.filter_by(email=email).first()

    # Constant-time verification check
    dummy_hash = "scrypt:32768:8:1$dummy$00000000000000000000000000000000"
    hash_to_check = user.password_hash if user else dummy_hash

    password_correct = check_password_hash(hash_to_check, password)

    if not user or not password_correct or not user.is_active:
        return jsonify({"errors": ["Invalid email or password."]}), 401

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return (
        jsonify(
            {
                "user": user.to_dict(),
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
        ),
        200,
    )


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user or not user.is_active:
        return jsonify({"errors": ["Account is no longer active."]}), 401

    claims = get_jwt()
    _revoke_claims(claims)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"errors": ["Refresh token has already been used."]}), 401

    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    claims = get_jwt()
    identity = get_jwt_identity()
    _revoke_claims(claims)
    refresh_token = (request.get_json(silent=True) or {}).get("refresh_token")
    if refresh_token:
        try:
            refresh_claims = decode_token(refresh_token)
            if refresh_claims.get("type") == "refresh" and refresh_claims.get("sub") == identity:
                _revoke_claims(refresh_claims)
        except Exception:
            # An invalid/expired refresh token does not prevent access-token logout.
            pass
    db.session.commit()
    return jsonify({"message": "Logged out successfully."}), 200
