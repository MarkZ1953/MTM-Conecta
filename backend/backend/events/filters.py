import django_filters
from .models import Event, Attendance, EventAct, Evidence


class EventFilter(django_filters.FilterSet):
    class Meta:
        model = Event
        fields = {
            'title': ['exact', 'icontains', 'istartswith'],
            'location': ['exact', 'icontains', 'istartswith'],
            'start_date': ['exact', 'date', 'date__lt', 'date__gt', 'lt', 'gt', 'lte', 'gte'],
            'end_date': ['exact', 'date', 'date__lt', 'date__gt', 'lt', 'gt', 'lte', 'gte'],
            'is_active': ['exact'],
        }


class AttendanceFilter(django_filters.FilterSet):
    class Meta:
        model = Attendance
        fields = {
            'beneficiary': ['exact'],
            'event': ['exact'],
            'attended': ['exact'],
        }


class EventActFilter(django_filters.FilterSet):
    class Meta:
        model = EventAct
        fields = {
            'event': ['exact'],
            'is_active': ['exact'],
        }


class EvidenceFilter(django_filters.FilterSet):
    class Meta:
        model = Evidence
        fields = {
            'event': ['exact'],
            'description': ['exact', 'icontains'],
            'is_active': ['exact'],
        }
