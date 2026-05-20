import django_filters
from .models import Project


class CharInFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    pass


class ProjectFilter(django_filters.FilterSet):
    name__in = CharInFilter(field_name='name', lookup_expr='in')
    status__in = CharInFilter(field_name='status', lookup_expr='in')

    name__not_icontains = django_filters.CharFilter(
        field_name='name', lookup_expr='icontains', exclude=True
    )

    class Meta:
        model = Project
        fields = {
            'name': ['exact', 'icontains', 'istartswith'],
            'status': ['exact'],
            'start_date': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'end_date': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'is_active': ['exact'],
        }
