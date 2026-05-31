import django_filters
from .models import Beneficiary, Guardian, AidLogEntry


class BeneficiaryFilter(django_filters.FilterSet):
    full_name = django_filters.CharFilter(
        method='filter_full_name', label='Full Name')

    class Meta:
        model = Beneficiary
        fields = {
            'first_name': ['exact', 'icontains', 'istartswith'],
            'last_name': ['exact', 'icontains', 'istartswith'],
            'identification_number': ['exact', 'icontains'],
            'municipality': ['exact', 'icontains'],
            'treatment_stage': ['exact'],
            'treatment_status': ['exact', 'icontains'],
            'birth_date': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'is_active': ['exact'],
        }

    def filter_full_name(self, queryset, name, value):
        return queryset.filter(
            first_name__icontains=value
        ) | queryset.filter(
            last_name__icontains=value
        )


class GuardianFilter(django_filters.FilterSet):
    full_name = django_filters.CharFilter(
        method='filter_full_name', label='Full Name')

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

    def filter_full_name(self, queryset, name, value):
        return queryset.filter(
            first_name__icontains=value
        ) | queryset.filter(
            last_name__icontains=value
        )


class AidLogEntryFilter(django_filters.FilterSet):
    class Meta:
        model = AidLogEntry
        fields = {
            'beneficiary': ['exact'],
            'aid_type': ['exact', 'icontains'],
            'missionary_program': ['exact', 'icontains'],
            'delivery_date': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'is_active': ['exact'],
        }
