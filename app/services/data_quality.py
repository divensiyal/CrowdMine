def calculate_quality(
    total_records: int,
    valid_records: int,
    missing_values: int = 0,
    duplicate_records: int = 0,
) -> dict:
    if total_records <= 0:
        return {
            "quality_score": 0.0,
            "validity_rate": 0.0,
            "completeness_rate": 0.0,
            "duplicate_rate": 0.0,
        }

    validity_rate = valid_records / total_records

    missing_rate = min(missing_values / total_records, 1)
    completeness_rate = 1 - missing_rate

    duplicate_rate = min(duplicate_records / total_records, 1)

    quality_score = (
        validity_rate * 0.5
        + completeness_rate * 0.3
        + (1 - duplicate_rate) * 0.2
    )

    return {
        "quality_score": round(quality_score, 2),
        "validity_rate": round(validity_rate, 2),
        "completeness_rate": round(completeness_rate, 2),
        "duplicate_rate": round(duplicate_rate, 2),
    }