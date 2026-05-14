import django_filters
from .models import Project


class ProjectFilter(django_filters.FilterSet):
    class Meta:
        model = Project
        fields = {
            'name': ['exact', 'icontains', 'istartswith'],
            'status': ['exact'],
            'start_date': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'end_date': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'is_active': ['exact'],
        }