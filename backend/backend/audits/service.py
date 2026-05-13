from .models import AuditLog


def get_client_ip(request):
    if request is None:
        return None
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0]
    return request.META.get('REMOTE_ADDR')


def log_event(request=None, user=None, action='', instance=None, description=''):
    AuditLog.objects.create(
        user=user or (request.user if request and request.user.is_authenticated else None),
        action=action,
        model_name=instance.__class__.__name__ if instance else '',
        object_id=str(instance.id) if instance else None,
        description=description,
        ip_address=get_client_ip(request),
    )