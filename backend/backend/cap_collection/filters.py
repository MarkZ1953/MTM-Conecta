import django_filters
from .models import Company, CollectionPoint, CollectionRequest


class CompanyFilter(django_filters.FilterSet):
    class Meta:
        model = Company
        fields = {
            'nit': ['exact', 'icontains'],
            'business_name': ['exact', 'icontains', 'istartswith'],
            'contact_email': ['exact', 'icontains'],
            'is_active': ['exact'],
        }


class CollectionPointFilter(django_filters.FilterSet):
    class Meta:
        model = CollectionPoint
        fields = {
            'company': ['exact'],
            'name': ['exact', 'icontains', 'istartswith'],
            'municipality': ['exact', 'icontains'],
            'department': ['exact', 'icontains'],
            'is_active': ['exact'],
        }


class CollectionRequestFilter(django_filters.FilterSet):
    class Meta:
        model = CollectionRequest
        fields = {
            'collection_point': ['exact'],
            'status': ['exact'],
            'estimated_weight_kg': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'scheduled_date': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'driver_name': ['exact', 'icontains'],
            'is_active': ['exact'],
        }
