from app.api.uploads import router as upload_router
from app.api.validation import router as validation_router
from app.api.compatibility import router as compatibility_router
from app.api.quality import router as quality_router
from app.api.standardization import router as standardization_router
from app.api.duplicates import router as duplicate_router
from app.api.integration import router as integration_router
from fastapi import FastAPI

from app.api.contributions import router as contribution_router


app = FastAPI(
    title="CrowdMine API",
    description="CrowdMine collaborative data collection and dataset generation platform",
    version="0.1.0"
)


app.include_router(contribution_router)
app.include_router(upload_router)
app.include_router(validation_router)
app.include_router(compatibility_router)
app.include_router(quality_router)
app.include_router(standardization_router)
app.include_router(duplicate_router)
app.include_router(integration_router)

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