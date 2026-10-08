import csv
import json
from pathlib import Path


def validate_file(file_path: str) -> dict:
    path = Path(file_path)

    if not path.exists():
        return {
            "valid": False,
            "errors": ["File does not exist"]
        }

    extension = path.suffix.lower()

    try:
        if extension == ".csv":
            with path.open("r", encoding="utf-8", newline="") as file:
                rows = list(csv.reader(file))

            if not rows:
                return {"valid": False, "errors": ["CSV file is empty"]}

            column_count = len(rows[0])

            if column_count == 0:
                return {"valid": False, "errors": ["CSV has no columns"]}

            inconsistent_rows = [
                index + 1
                for index, row in enumerate(rows[1:], start=1)
                if len(row) != column_count
            ]

            if inconsistent_rows:
                return {
                    "valid": False,
                    "errors": [
                        f"Inconsistent columns at rows: {inconsistent_rows[:10]}"
                    ]
                }

        elif extension == ".json":
            with path.open("r", encoding="utf-8") as file:
                json.load(file)

        elif extension == ".txt":
            if path.stat().st_size == 0:
                return {
                    "valid": False,
                    "errors": ["Text file is empty"]
                }

        else:
            return {
                "valid": False,
                "errors": [f"Validation not yet supported for {extension}"]
            }

        return {
            "valid": True,
            "errors": []
        }

    except (UnicodeDecodeError, json.JSONDecodeError, csv.Error) as error:
        return {
            "valid": False,
            "errors": [f"Invalid file content: {error}"]
        }