from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from app.mixins.soft_delete_mixin import SoftDeleteMixin
from app.mixins.export_mixin import ExportMixin
from access.permissions import DjangoModelPermissionsWithView
from .models import Volunteer, VolunteerAvailability, VolunteerTask
from .serializers import VolunteerSerializer, VolunteerAvailabilitySerializer, VolunteerTaskSerializer
from .paginations import VolunteerPagination, VolunteerAvailabilityPagination, VolunteerTaskPagination
from .filters import VolunteerFilter, VolunteerAvailabilityFilter, VolunteerTaskFilter


class VolunteerViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Volunteer.objects.filter(is_active=True)
    serializer_class = VolunteerSerializer
    pagination_class = VolunteerPagination
    permission_classes = [DjangoModelPermissionsWithView]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = VolunteerFilter
    search_fields = ['first_name', 'last_name', 'email', 'profession', 'identification_number']
    ordering_fields = ['id', 'first_name', 'last_name', 'status', 'support_area']
    ordering = ['-id']

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='public-register')
    def public_register(self, request):
        """Endpoint público para la postulación en línea de nuevos voluntarios."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            volunteer = serializer.save(status='PENDING')
            return Response(VolunteerSerializer(volunteer).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VolunteerAvailabilityViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = VolunteerAvailability.objects.filter(is_active=True)
    serializer_class = VolunteerAvailabilitySerializer
    pagination_class = VolunteerAvailabilityPagination
    permission_classes = [DjangoModelPermissionsWithView]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = VolunteerAvailabilityFilter
    ordering_fields = ['id', 'day_of_week']
    ordering = ['day_of_week', 'start_time']


class VolunteerTaskViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = VolunteerTask.objects.filter(is_active=True)
    serializer_class = VolunteerTaskSerializer
    pagination_class = VolunteerTaskPagination
    permission_classes = [DjangoModelPermissionsWithView]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = VolunteerTaskFilter
    ordering_fields = ['id', 'date', 'hours_spent']
    ordering = ['-date']
