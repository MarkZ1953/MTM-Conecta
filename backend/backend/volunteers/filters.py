import django_filters
from .models import Volunteer, VolunteerAvailability, VolunteerTask


class VolunteerFilter(django_filters.FilterSet):
    class Meta:
        model = Volunteer
        fields = {
            'status': ['exact'],
            'support_area': ['exact'],
            'profession': ['exact', 'icontains'],
            'identification_number': ['exact', 'icontains'],
            'is_active': ['exact'],
        }


class VolunteerAvailabilityFilter(django_filters.FilterSet):
    class Meta:
        model = VolunteerAvailability
        fields = {
            'volunteer': ['exact'],
            'day_of_week': ['exact'],
            'is_active': ['exact'],
        }


class VolunteerTaskFilter(django_filters.FilterSet):
    class Meta:
        model = VolunteerTask
        fields = {
            'volunteer': ['exact'],
            'project': ['exact'],
            'date': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'is_active': ['exact'],
        }
