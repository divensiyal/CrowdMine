def standardize_records(records: list[dict]) -> dict:
    standardized_records = []

    for record in records:
        standardized = {}

        for key, value in record.items():
            normalized_key = (
                str(key)
                .strip()
                .lower()
                .replace("_", " ")
                .replace("-", " ")
            )

            normalized_key = " ".join(normalized_key.split())

            if isinstance(value, str):
                value = " ".join(value.strip().split())

                if value == "":
                    value = None

            standardized[normalized_key] = value

        standardized_records.append(standardized)

    return {
        "records_processed": len(records),
        "records": standardized_records,
    }