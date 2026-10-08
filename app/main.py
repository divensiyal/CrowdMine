from fastapi import FastAPI

from app.api import auth, requests, schema, users, datasets
from app.database.init_db import init_db


init_db()

app = FastAPI(title="CrowdMine API")

app.include_router(auth.router)
app.include_router(requests.router)
app.include_router(schema.router)
app.include_router(users.router)
app.include_router(datasets.router)


@app.get("/")
def home():
    return {
        "message": "CrowdMine backend is running!"
    }