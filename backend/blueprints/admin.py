import sys
from pathlib import Path
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

# Ensure backend directory is in sys.path
_DIR = Path(__file__).resolve().parent.parent
if str(_DIR) not in sys.path:
    sys.path.insert(0, str(_DIR))

from models import User

admin_bp = Blueprint("admin", __name__)


def _require_admin(user_id: int) -> bool:
    """Placeholder role check. In production, add an 'is_admin' field to User."""
    return False


@admin_bp.before_request
@jwt_required()
def check_admin():
    user_id = int(get_jwt_identity())
    if not _require_admin(user_id):
        return jsonify({"error": "Admin access required."}), 403


@admin_bp.route("/users", methods=["GET"])
def list_users():
    users = User.query.filter_by(is_active=True).all()
    return jsonify({"users": [u.to_dict() for u in users]}), 200
