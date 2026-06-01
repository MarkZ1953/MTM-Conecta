import django_filters
from .models import Donor, Donation


class DonorFilter(django_filters.FilterSet):
    class Meta:
        model = Donor
        fields = {
            'donor_type': ['exact'],
            'organization_name': ['exact', 'icontains'],
            'first_name': ['exact', 'icontains', 'istartswith'],
            'last_name': ['exact', 'icontains', 'istartswith'],
            'email': ['exact', 'icontains'],
            'category': ['exact'],
            'is_active': ['exact'],
        }


class DonationFilter(django_filters.FilterSet):
    class Meta:
        model = Donation
        fields = {
            'donor': ['exact'],
            'donation_type': ['exact'],
            'amount': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'date': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'status': ['exact'],
            'is_active': ['exact'],
        }
