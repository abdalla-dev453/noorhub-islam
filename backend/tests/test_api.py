# File: backend/tests/test_api.py
import pytest
from backend.app import create_app
from backend.extensions import db
from backend.models import User, LessonProgress


@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret-key-that-is-long-enough-for-testing",
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert data["service"] == "NoorHub API"


def test_register_and_login_flow(client):
    reg_payload = {
        "name": "Bilal",
        "email": "bilal@example.com",
        "password": "strongPassword123"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    reg_data = reg_res.get_json()
    assert "access_token" in reg_data
    assert "refresh_token" in reg_data
    assert reg_data["user"]["email"] == "bilal@example.com"

    login_res = client.post("/api/auth/login", json={
        "email": "bilal@example.com",
        "password": "strongPassword123"
    })
    assert login_res.status_code == 200
    login_data = login_res.get_json()
    assert "access_token" in login_data
    assert login_data["user"]["email"] == "bilal@example.com"


def test_me_and_progress_flow(client):
    reg_res = client.post("/api/auth/register", json={
        "name": "Khadija",
        "email": "khadija@example.com",
        "password": "securePassword456"
    })
    token = reg_res.get_json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    me_res = client.get("/api/user/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.get_json()["user"]["email"] == "khadija@example.com"

    prog_post = client.post(
        "/api/user/progress",
        headers=headers,
        json={"course_id": "basics-101", "lesson_id": "lesson-1", "completed": True}
    )
    assert prog_post.status_code == 200
    assert prog_post.get_json()["progress"]["lesson_id"] == "lesson-1"

    prog_get = client.get("/api/user/progress", headers=headers)
    assert prog_get.status_code == 200
    progress_list = prog_get.get_json()["progress"]
    assert len(progress_list) == 1
    assert progress_list[0]["lesson_id"] == "lesson-1"
