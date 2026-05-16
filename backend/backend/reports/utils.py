"""Shared helpers for the reports module."""
from datetime import datetime


def parse_date(value):
    """Parse a date string in YYYY-MM-DD format. Returns None if invalid."""
    if not value:
        return None
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return None


def apply_date_range(qs, request, field='created_at'):
    """
    Apply ``from`` and ``to`` query params as a date range on ``field``.
    """
    date_from = parse_date(request.query_params.get('from'))
    date_to = parse_date(request.query_params.get('to'))

    if date_from:
        qs = qs.filter(**{f"{field}__date__gte": date_from})
    if date_to:
        qs = qs.filter(**{f"{field}__date__lte": date_to})

    return qs
