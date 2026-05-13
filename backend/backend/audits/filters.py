import django_filters
from .models import AuditLog


class AuditLogFilter(django_filters.FilterSet):
    class Meta:
        model = AuditLog
        fields = {
            'user': ['exact'],
            'action': ['exact', 'icontains'],
            'model_name': ['exact', 'icontains'],
            'timestamp': ['exact', 'lt', 'gt', 'lte', 'gte', 'date'],
        }