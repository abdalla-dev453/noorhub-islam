import os
import sys
import logging
from pathlib import Path
from flask import Flask, jsonify
from flask_cors import CORS

# ── Ensure backend directory is in sys.path ──────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))
if str(BASE_DIR.parent) not in sys.path:
    sys.path.insert(0, str(BASE_DIR.parent))

# ── Extension singletons ─────────────────────────────────────────────────────
from extensions import db, jwt, migrate
from config import Config

# Configure logging for production: errors only, no stack traces to clients
logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)


def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # ── Initialise extensions ─────────────────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    @jwt.token_in_blocklist_loader
    def token_is_revoked(_jwt_header, jwt_payload):
        from models import RevokedToken

        return db.session.get(RevokedToken, jwt_payload.get("jti")) is not None

    # ── CORS: restrict to configured frontend origin ───────────────────────────
    CORS(
        app,
        origins=[app.config.get("ALLOWED_ORIGIN", "http://localhost:5173")],
        supports_credentials=True,
    )

    # ── Security headers ──────────────────────────────────────────────────────
    @app.after_request
    def set_security_headers(response):
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data:; "
            "font-src 'self' https://fonts.gstatic.com; "
            f"connect-src 'self' {app.config['API_ORIGIN']}"
        )
        return response

    # ── Register blueprints ───────────────────────────────────────────────────
    from blueprints.auth import auth_bp
    from blueprints.user import user_bp
    from blueprints.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/user")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    # ── Create tables on startup ──────────────────────────────────────────────
    with app.app_context():
        try:
            from models import RevokedToken, User, UserProgress  # noqa: F401

            db.create_all()
        except Exception as e:
            logger.warning("Could not auto-create database tables: %s", e)

    # ── Health check ──────────────────────────────────────────────────────────
    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "NoorHub API"}), 200

    # ── Error handlers ────────────────────────────────────────────────────────
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad request."}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"error": "Authentication required."}), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found."}), 404

    @app.errorhandler(422)
    def unprocessable(e):
        return jsonify({"error": "Unprocessable request."}), 422

    @app.errorhandler(500)
    def internal_error(e):
        logger.exception("Internal server error: %s", e)
        return jsonify({"error": "An internal error occurred. Please try again."}), 500

    return app


# Expose app for `flask run`
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=app.config["DEBUG"])
