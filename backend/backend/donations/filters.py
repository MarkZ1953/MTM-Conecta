import django_filters
from .models import Donor, Donation


class DonorFilter(django_filters.FilterSet):
    class Meta:
        model = Donor
        fields = {
            'first_name': ['exact', 'icontains', 'istartswith'],
            'last_name': ['exact', 'icontains', 'istartswith'],
            'email': ['exact', 'icontains'],
            'is_active': ['exact'],
        }


class DonationFilter(django_filters.FilterSet):
    class Meta:
        model = Donation
        fields = {
            'donor': ['exact'],
            'amount': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'date': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'status': ['exact'],
            'is_active': ['exact'],
        }