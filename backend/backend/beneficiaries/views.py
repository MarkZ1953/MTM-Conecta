# Create your views here.
from django_filters.rest_framework import DjangoFilterBackend
from app.mixins.soft_delete_mixin import SoftDeleteMixin
from app.mixins.export_mixin import ExportMixin
from .serializers import BeneficiarySerializer, GuardianSerializer
from .paginations import BeneficiaryPagination, GuardianPagination
from .models import Beneficiary, Guardian
from .filters import BeneficiaryFilter, GuardianFilter
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
    ordering_fields = ['id', 'first_name', 'last_name', 'birth_date']
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