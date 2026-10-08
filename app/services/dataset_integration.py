import json


def _record_key(
    record: dict,
    key_columns: list[str] | None = None,
):
    if key_columns:
        return tuple(
            record.get(column)
            for column in key_columns
        )

    return json.dumps(
        record,
        sort_keys=True,
        ensure_ascii=False,
        separators=(",", ":"),
        default=str,
    )


def integrate_datasets(
    existing_records: list[dict],
    new_records: list[dict],
    key_columns: list[str] | None = None,
) -> dict:
    integrated_records = list(existing_records)

    seen = {
        _record_key(record, key_columns)
        for record in existing_records
    }

    added_records = 0
    skipped_duplicates = 0

    for record in new_records:
        key = _record_key(record, key_columns)

        if key in seen:
            skipped_duplicates += 1
            continue

        integrated_records.append(record)
        seen.add(key)
        added_records += 1

    return {
        "existing_records": len(existing_records),
        "new_records": len(new_records),
        "added_records": added_records,
        "skipped_duplicates": skipped_duplicates,
        "total_records": len(integrated_records),
        "records": integrated_records,
    }