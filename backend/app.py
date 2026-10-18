import os
import sys
import logging
import concurrent.futures
import json
import time
import threading
import xml.etree.ElementTree as ET
from urllib.parse import urlencode
from urllib.request import Request, urlopen
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

LESSON_CHANNELS = [
    {"id": "UC3vHW2h22WE-pNi5WJtRIjg", "name": "Yaqeen Institute", "speaker": "Yaqeen Institute", "category": "Theology"},
    {"id": "UClUa7-iHJNKEM2e_zWYSPQg", "name": "Yasir Qadhi", "speaker": "Dr. Yasir Qadhi", "category": "History"},
    {"id": "UCNB_OaI4524fASt8h0IL8dw", "name": "Mufti Menk", "speaker": "Mufti Menk", "category": "Theology"},
    {"id": "UCNdUFOtzSx3FS71pHkQLxhQ", "name": "FreeQuranEducation", "speaker": "FreeQuranEducation", "category": "Recitation"},
]
_lesson_cache = {"expires": 0, "data": None}
_lesson_cache_lock = threading.Lock()
_lesson_search_cache = {}
_lesson_search_lock = threading.Lock()


def _fetch_channel_videos(channel):
    feed_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel['id']}"
    request = Request(feed_url, headers={"User-Agent": "NoorHub/1.0 (lesson feed)"})
    with urlopen(request, timeout=8) as response:
        root = ET.fromstring(response.read())
    ns = {"atom": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
    videos = []
    for entry in root.findall("atom:entry", ns):
        video_id = entry.findtext("yt:videoId", default="", namespaces=ns)
        title = entry.findtext("atom:title", default="", namespaces=ns)
        published = entry.findtext("atom:published", default="", namespaces=ns)
        if not video_id or not title:
            continue
        videos.append({
            "id": video_id,
            "title": title,
            "speaker": channel["speaker"],
            "institution": channel["name"],
            "category": channel["category"],
            "status": "Recent Lecture",
            "isLive": False,
            "duration": "New upload",
            "date": published[:10],
            "publishedAt": published,
            "videoUrl": f"https://www.youtube.com/watch?v={video_id}",
            "thumbnail": f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
            "description": f"Latest video published by {channel['name']}.",
            "keyPoints": [],
        })
    return videos


def _latest_lessons():
    now = time.time()
    with _lesson_cache_lock:
        if _lesson_cache["data"] is not None and now < _lesson_cache["expires"]:
            return _lesson_cache["data"]
    videos = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(LESSON_CHANNELS)) as pool:
        jobs = [pool.submit(_fetch_channel_videos, channel) for channel in LESSON_CHANNELS]
        for channel, job in zip(LESSON_CHANNELS, jobs):
            try:
                videos.extend(job.result(timeout=10))
            except Exception as error:
                logger.warning("Could not refresh YouTube feed for %s: %s", channel["name"], error)
    videos.sort(key=lambda item: item["publishedAt"], reverse=True)
    result = {"items": videos[:40], "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "sourceCount": len({item["institution"] for item in videos})}
    with _lesson_cache_lock:
        _lesson_cache.update(data=result, expires=now + 900)
    return result


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
            "script-src 'self' https://www.youtube.com; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https://i.ytimg.com https://img.youtube.com; "
            "frame-src https://www.youtube.com https://www.youtube-nocookie.com; "
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

    @app.route("/api/lessons/latest")
    def latest_lessons():
        return jsonify(_latest_lessons()), 200

    @app.route("/api/lessons/search")
    def search_lessons():
        from flask import request

        query = " ".join(request.args.get("q", "").split())[:100]
        if len(query) < 2:
            return jsonify({"error": "Enter at least two characters to search for lessons."}), 400
        api_key = app.config.get("YOUTUBE_API_KEY")
        if not api_key:
            return jsonify({"error": "On-site video search is not configured yet. Set YOUTUBE_API_KEY on the backend."}), 503
        cache_key = query.casefold()
        page_token = request.args.get("pageToken", "")[:512]
        cache_key = f"{cache_key}:{page_token}"
        now = time.time()
        with _lesson_search_lock:
            cached = _lesson_search_cache.get(cache_key)
            if cached and now < cached[0]:
                return jsonify(cached[1]), 200
        params = urlencode({
            "part": "snippet",
            "type": "video",
            "videoEmbeddable": "true",
            "safeSearch": "strict",
            "order": "relevance",
            "maxResults": 20,
            "q": query,
            "key": api_key,
        })
        if page_token:
            params += "&" + urlencode({"pageToken": page_token})
        api_request = Request(
            f"https://www.googleapis.com/youtube/v3/search?{params}",
            headers={"Accept": "application/json", "User-Agent": "NoorHub/1.0"},
        )
        try:
            with urlopen(api_request, timeout=10) as response:
                payload = json.loads(response.read())
        except Exception as error:
            logger.warning("YouTube lesson search failed: %s", error)
            return jsonify({"error": "YouTube search is temporarily unavailable. Try again shortly."}), 502
        items = []
        for item in payload.get("items", []):
            video_id = item.get("id", {}).get("videoId")
            snippet = item.get("snippet", {})
            if not video_id or not snippet.get("title"):
                continue
            items.append({
                "id": video_id,
                "title": snippet["title"],
                "speaker": snippet.get("channelTitle", "YouTube channel"),
                "institution": snippet.get("channelTitle", "YouTube"),
                "category": "Search result",
                "status": "YouTube video",
                "isLive": False,
                "duration": "Video",
                "date": (snippet.get("publishedAt") or "")[:10],
                "videoUrl": f"https://www.youtube.com/watch?v={video_id}",
                "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
                "description": snippet.get("description", ""),
                "keyPoints": [],
            })
        result = {"items": items, "query": query, "nextPageToken": payload.get("nextPageToken", "")}
        with _lesson_search_lock:
            _lesson_search_cache[cache_key] = (now + 600, result)
        return jsonify(result), 200

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
