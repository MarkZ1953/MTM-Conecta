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
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    pagination_class = AuditLogPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = AuditLogFilter
    ordering_fields = ['id', 'timestamp', 'action', 'user']
    ordering = ['-timestamp']