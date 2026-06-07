import json
from urllib.parse import urlencode
from urllib.request import urlopen

from django.conf import settings
from django.utils import timezone
from django.utils.dateparse import parse_datetime

from .models import InstagramPost


class InstagramSyncError(Exception):
    pass


def _parse_timestamp(value):
    parsed = parse_datetime(value or '')
    if parsed is None:
        return timezone.now()
    if timezone.is_naive(parsed):
        return timezone.make_aware(parsed)
    return parsed


def _request_instagram_media():
    account_id = settings.INSTAGRAM_BUSINESS_ACCOUNT_ID
    access_token = settings.INSTAGRAM_ACCESS_TOKEN

    if not account_id or not access_token:
        raise InstagramSyncError(
            'Faltan INSTAGRAM_BUSINESS_ACCOUNT_ID o INSTAGRAM_ACCESS_TOKEN en el entorno.'
        )

    fields = (
        'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,'
        'children{id,media_type,media_url,permalink,thumbnail_url,timestamp}'
    )
    params = urlencode({
        'fields': fields,
        'limit': settings.INSTAGRAM_SYNC_LIMIT,
        'access_token': access_token,
    })
    url = (
        f'https://graph.facebook.com/{settings.INSTAGRAM_GRAPH_API_VERSION}/'
        f'{account_id}/media?{params}'
    )

    try:
        with urlopen(url, timeout=settings.INSTAGRAM_SYNC_TIMEOUT_SECONDS) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as exc:
        raise InstagramSyncError(f'No se pudo sincronizar Instagram: {exc}') from exc


def sync_instagram_posts():
    payload = _request_instagram_media()
    items = payload.get('data', [])
    created = 0
    updated = 0

    for item in items:
        instagram_id = item.get('id')
        if not instagram_id:
            continue

        defaults = {
            'caption': item.get('caption', ''),
            'media_type': item.get('media_type', InstagramPost.MEDIA_TYPE_IMAGE),
            'media_url': item.get('media_url', ''),
            'thumbnail_url': item.get('thumbnail_url', ''),
            'permalink': item.get('permalink', ''),
            'timestamp': _parse_timestamp(item.get('timestamp')),
            'children': item.get('children', {}).get('data', []),
            'is_active': True,
        }
        _, was_created = InstagramPost.objects.update_or_create(
            instagram_id=instagram_id,
            defaults=defaults,
        )
        if was_created:
            created += 1
        else:
            updated += 1

    return {
        'created': created,
        'updated': updated,
        'total': len(items),
    }

