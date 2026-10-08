from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile


UPLOAD_DIR = Path("uploads")
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

ALLOWED_EXTENSIONS = {
    ".csv",
    ".json",
    ".txt",
}


async def save_uploaded_file(
    file: UploadFile,
    user_id: int,
    request_id: int,
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File name is required"
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {extension}"
        )

    upload_path = (
        UPLOAD_DIR
        / str(user_id)
        / str(request_id)
    )

    upload_path.mkdir(parents=True, exist_ok=True)

    stored_filename = f"{uuid4()}{extension}"
    file_path = upload_path / stored_filename

    total_size = 0

    with file_path.open("wb") as output:
        while chunk := await file.read(1024 * 1024):
            total_size += len(chunk)

            if total_size > MAX_FILE_SIZE:
                file_path.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=413,
                    detail="File size exceeds 50 MB limit"
                )

            output.write(chunk)

    return {
        "original_filename": file.filename,
        "stored_filename": stored_filename,
        "file_path": str(file_path),
        "file_size": total_size,
    }