import hashlib
import json


def _record_hash(record: dict) -> str:
    canonical = json.dumps(
        record,
        sort_keys=True,
        ensure_ascii=False,
        separators=(",", ":"),
        default=str,
    )

    return hashlib.sha256(
        canonical.encode("utf-8")
    ).hexdigest()


def detect_duplicates(records: list[dict]) -> dict:
    seen = {}
    duplicates = []

    for index, record in enumerate(records):
        record_hash = _record_hash(record)

        if record_hash in seen:
            duplicates.append({
                "index": index,
                "duplicate_of": seen[record_hash],
            })
        else:
            seen[record_hash] = index

    return {
        "total_records": len(records),
        "unique_records": len(seen),
        "duplicate_records": len(duplicates),
        "duplicates": duplicates,
    }