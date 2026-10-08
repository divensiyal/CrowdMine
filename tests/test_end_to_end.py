from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register_login_create_request():
    username = "workflow_user_01"
    email = "workflow01@example.com"
    password = "Test12345!"

    register = client.post(
        "/api/auth/register",
        json={
            "username": username,
            "email": email,
            "password": password
        }
    )

    assert register.status_code in [200, 201, 400]

    login = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": password
        }
    )

    assert login.status_code == 200

    token = login.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    request = client.post(
        "/api/requests/",
        json={
            "title": "Automated Integration Test Dataset",
            "description": "Testing the CrowdMine integrated workflow",
            "target_records": 100
        },
        headers=headers
    )

    assert request.status_code == 200

    request_data = request.json()
    assert "request_id" in request_data