import django_filters
from .models import Beneficiary, Guardian


class BeneficiaryFilter(django_filters.FilterSet):
    class Meta:
        model = Beneficiary
        fields = {
            'first_name': ['exact', 'icontains', 'istartswith'],
            'last_name': ['exact', 'icontains', 'istartswith'],
            'identification_number': ['exact', 'icontains'],
            'birth_date': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'is_active': ['exact'],
        }


class GuardianFilter(django_filters.FilterSet):
    class Meta:
        model = Guardian
        fields = {
            'first_name': ['exact', 'icontains', 'istartswith'],
            'last_name': ['exact', 'icontains', 'istartswith'],
            'identification_number': ['exact', 'icontains'],
            'email': ['exact', 'icontains'],
            'beneficiary': ['exact'],
            'is_active': ['exact'],
        }