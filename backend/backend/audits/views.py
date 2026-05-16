from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins, filters

from .serializers import AuditLogSerializer
from .paginations import AuditLogPagination
from .filters import AuditLogFilter
from .models import AuditLog


class AuditLogViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """
    Read-only ViewSet for audit logs.

    Logs are created exclusively from ``audits.service.log_event`` — they
    cannot be created, updated or deleted via the API.
    """
    queryset = AuditLog.objects.all().select_related('user')
    serializer_class = AuditLogSerializer
    pagination_class = AuditLogPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = AuditLogFilter
    search_fields = ['description', 'model_name', 'user__username']
    ordering_fields = ['id', 'timestamp', 'action']
    ordering = ['-timestamp']
