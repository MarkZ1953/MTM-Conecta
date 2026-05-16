"""
Service for logging audit events from anywhere in the application.

Usage:
    from audits.service import log_event

    log_event(
        request=request,
        user=user,
        action="login",
        instance=user,
        description="User logged in successfully",
    )
"""
from .models import AuditLog


def get_client_ip(request):
    """Extract the client IP address from the request."""
    if request is None:
        return None

    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()

    return request.META.get('REMOTE_ADDR')


def log_event(request=None, user=None, action='', instance=None, description=''):
    """
    Create an audit log entry.

    Parameters
    ----------
    request : HttpRequest, optional
        Used to extract the IP address and (if no user is given) the
        authenticated user.
    user : User, optional
        The user performing the action. If not provided, attempts to read
        it from ``request.user`` when the user is authenticated.
    action : str
        The action being performed (use values from ``AuditAction``).
    instance : Model, optional
        The model instance affected by the action. Used to record
        ``model_name`` and ``object_id``.
    description : str
        Free-text description of the event.
    """
    resolved_user = user
    if resolved_user is None and request is not None:
        candidate = getattr(request, 'user', None)
        if candidate is not None and getattr(candidate, 'is_authenticated', False):
            resolved_user = candidate

    try:
        AuditLog.objects.create(
            user=resolved_user,
            action=action,
            model_name=instance.__class__.__name__ if instance is not None else '',
            object_id=str(instance.id) if instance is not None and getattr(instance, 'id', None) else None,
            description=description,
            ip_address=get_client_ip(request),
        )
    except Exception as log_error:
        # Never let audit logging crash the actual request
        print(f"[audits] Failed to write audit log: {log_error}")
