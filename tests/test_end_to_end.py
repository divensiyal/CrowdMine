from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register_and_login():
    username = "autotest_user_2"
    email = "autotest2@example.com"
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

    body = login.json()
    assert "access_token" in body