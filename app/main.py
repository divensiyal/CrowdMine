from fastapi import FastAPI

app = FastAPI(
    title="CrowdMine API",
    description="CrowdMine collaborative data collection and dataset generation platform",
    version="0.1.0"
)

@app.get("/")
def root():
    return {
        "message": "CrowdMine API is running!"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }