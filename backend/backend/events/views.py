from django_filters.rest_framework import DjangoFilterBackend
from app.mixins.soft_delete_mixin import SoftDeleteMixin
from app.mixins.export_mixin import ExportMixin
from .serializers import (
    EventSerializer, EventDetailSerializer,
    AttendanceSerializer, EventActSerializer, EvidenceSerializer
)
from .paginations import (
    EventPagination, AttendancePagination,
    EventActPagination, EvidencePagination
)
from .models import Event, Attendance, EventAct, Evidence
from .filters import EventFilter, AttendanceFilter, EventActFilter, EvidenceFilter
from rest_framework import viewsets, filters
from rest_framework.generics import ListAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from access.permissions import DjangoModelPermissionsWithView


class EventViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Event.objects.filter(is_active=True)
    serializer_class = EventSerializer
    pagination_class = EventPagination
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    permission_classes = [DjangoModelPermissionsWithView]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = EventFilter
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['id', 'title', 'start_date', 'end_date', 'location']
    ordering = ['-start_date']

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return EventDetailSerializer
        return super().get_serializer_class()


class PublicEventListView(ListAPIView):
    queryset = Event.objects.filter(is_active=True).order_by('start_date')
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    pagination_class = AttendancePagination
    permission_classes = [DjangoModelPermissionsWithView]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = AttendanceFilter
    search_fields = ['notes']
    ordering_fields = ['id', 'beneficiary', 'event', 'attended']
    ordering = ['-id']


class EventActViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = EventAct.objects.filter(is_active=True)
    serializer_class = EventActSerializer
    pagination_class = EventActPagination
    permission_classes = [DjangoModelPermissionsWithView]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = EventActFilter
    search_fields = ['content']
    ordering_fields = ['id', 'event']
    ordering = ['-id']


class EvidenceViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Evidence.objects.filter(is_active=True)
    serializer_class = EvidenceSerializer
    pagination_class = EvidencePagination
    permission_classes = [DjangoModelPermissionsWithView]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = EvidenceFilter
    search_fields = ['description']
    ordering_fields = ['id', 'event', 'description']
    ordering = ['-id']
