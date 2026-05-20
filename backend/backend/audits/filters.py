import django_filters
from .models import AuditLog


class CharInFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    pass


class AuditLogFilter(django_filters.FilterSet):
    action__in = CharInFilter(field_name='action', lookup_expr='in')
    model_name__in = CharInFilter(field_name='model_name', lookup_expr='in')

    class Meta:
        model = AuditLog
        fields = {
            'user': ['exact'],
            'action': ['exact'],
            'model_name': ['exact', 'icontains'],
            'object_id': ['exact'],
            'timestamp': ['exact', 'date', 'date__lt', 'date__gt', 'lt', 'lte', 'gt', 'gte'],
        }
