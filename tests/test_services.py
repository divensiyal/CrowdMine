from app.services.compatibility import check_compatibility
from app.services.data_quality import calculate_quality
from app.services.standardization import standardize_records
from app.services.duplicate_detection import detect_duplicates
from app.services.dataset_integration import integrate_datasets


def test_compatibility():
    result = check_compatibility(
        ["name", "email"],
        ["name", "email", "age"]
    )

    assert result["compatible"] is True
    assert result["score"] == 1.0


def test_data_quality():
    result = calculate_quality(
        total_records=100,
        valid_records=90,
        missing_values=10,
        duplicate_records=5
    )

    assert result["quality_score"] > 0
    assert result["validity_rate"] == 0.9


def test_standardization():
    result = standardize_records([
        {" Name ": " John   Doe ", "EMAIL": " john@example.com "}
    ])

    assert result["records_processed"] == 1
    assert result["records"][0]["name"] == "John Doe"


def test_duplicate_detection():
    result = detect_duplicates([
        {"name": "John"},
        {"name": "John"},
        {"name": "Jane"}
    ])

    assert result["duplicate_records"] == 1
    assert result["unique_records"] == 2


def test_dataset_integration():
    result = integrate_datasets(
        [{"id": 1}],
        [{"id": 1}, {"id": 2}]
    )

    assert result["added_records"] == 1
    assert result["skipped_duplicates"] == 1
    assert result["total_records"] == 2