def check_compatibility(
    expected_columns: list[str],
    actual_columns: list[str],
) -> dict:
    expected = {column.strip().lower() for column in expected_columns}
    actual = {column.strip().lower() for column in actual_columns}

    if not expected:
        return {
            "compatible": True,
            "score": 1.0,
            "missing_columns": [],
            "extra_columns": sorted(actual),
        }

    missing = expected - actual
    matched = expected & actual

    score = len(matched) / len(expected)

    return {
        "compatible": len(missing) == 0,
        "score": round(score, 2),
        "missing_columns": sorted(missing),
        "extra_columns": sorted(actual - expected),
    }