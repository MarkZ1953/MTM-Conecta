# Create your views here.
from django_filters.rest_framework import DjangoFilterBackend
from app.mixins.soft_delete_mixin import SoftDeleteMixin
from app.mixins.export_mixin import ExportMixin
from .serializers import BeneficiarySerializer, GuardianSerializer, AidLogEntrySerializer
from .paginations import BeneficiaryPagination, GuardianPagination, AidLogEntryPagination
from .models import Beneficiary, Guardian, AidLogEntry
from .filters import BeneficiaryFilter, GuardianFilter, AidLogEntryFilter
from rest_framework import viewsets, filters


class BeneficiaryViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Beneficiary.objects.filter(is_active=True)
    serializer_class = BeneficiarySerializer
    pagination_class = BeneficiaryPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = BeneficiaryFilter
    search_fields = ['first_name', 'last_name', 'identification_number', 'municipality', 'treatment_status']
    ordering_fields = [
        'id', 'first_name', 'last_name', 'birth_date',
        'municipality', 'treatment_stage', 'treatment_status'
    ]
    ordering = ['-id']


class GuardianViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Guardian.objects.filter(is_active=True)
    serializer_class = GuardianSerializer
    pagination_class = GuardianPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = GuardianFilter
    ordering_fields = ['id', 'first_name', 'last_name', 'beneficiary']
    ordering = ['-id']


class AidLogEntryViewSet(viewsets.ModelViewSet):
    queryset = AidLogEntry.objects.filter(is_active=True)
    serializer_class = AidLogEntrySerializer
    pagination_class = AidLogEntryPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = AidLogEntryFilter
    search_fields = ['aid_type', 'description', 'missionary_program']
    ordering_fields = ['id', 'delivery_date', 'aid_type', 'missionary_program']
    ordering = ['-delivery_date']

    def perform_create(self, serializer):
        serializer.save(registered_by=self.request.user)
