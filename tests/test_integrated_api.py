from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200


def test_health():
    response = client.get("/health")
    assert response.status_code == 200


def test_protected_endpoint_without_token():
    response = client.get("/api/users/me")
    assert response.status_code in [401, 403]