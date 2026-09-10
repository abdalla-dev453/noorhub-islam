import sys
from pathlib import Path
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

# Ensure backend directory is in sys.path
_DIR = Path(__file__).resolve().parent.parent
if str(_DIR) not in sys.path:
    sys.path.insert(0, str(_DIR))

from extensions import db
from models import User, UserProgress

user_bp = Blueprint("user", __name__)


@user_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return jsonify({"user": user.to_dict()}), 200


@user_bp.route("/progress", methods=["GET"])
@jwt_required()
def get_progress():
    user_id = int(get_jwt_identity())
    records = UserProgress.query.filter_by(user_id=user_id).all()
    return jsonify({"progress": [r.to_dict() for r in records]}), 200


@user_bp.route("/progress", methods=["POST"])
@jwt_required()
def upsert_progress():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    track_id = data.get("track_id")
    lesson_id = data.get("lesson_id")
    completed = data.get("completed")

    if track_id is None or not lesson_id or completed is None:
        return jsonify({"errors": ["track_id, lesson_id, and completed are required."]}), 422

    if not isinstance(track_id, int) or not isinstance(lesson_id, str):
        return jsonify({"errors": ["Invalid field types."]}), 422

    if not isinstance(completed, bool):
        return jsonify({"errors": ["completed must be a boolean."]}), 422

    record = UserProgress.query.filter_by(
        user_id=user_id, track_id=track_id, lesson_id=lesson_id
    ).first()

    if record:
        record.completed = completed
    else:
        record = UserProgress(
            user_id=user_id,
            track_id=track_id,
            lesson_id=lesson_id,
            completed=completed,
        )
        db.session.add(record)

    db.session.commit()
    return jsonify({"progress": record.to_dict()}), 200
