from django_filters.rest_framework import DjangoFilterBackend
from app.mixins.soft_delete_mixin import SoftDeleteMixin
from app.mixins.export_mixin import ExportMixin
from .serializers import DonorSerializer, DonationSerializer
from .paginations import DonorPagination, DonationPagination
from .models import Donor, Donation
from .filters import DonorFilter, DonationFilter
from rest_framework import viewsets, filters


class DonorViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Donor.objects.filter(is_active=True)
    serializer_class = DonorSerializer
    pagination_class = DonorPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = DonorFilter
    ordering_fields = ['id', 'first_name', 'last_name', 'email']
    ordering = ['-id']


class DonationViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Donation.objects.filter(is_active=True)
    serializer_class = DonationSerializer
    pagination_class = DonationPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = DonationFilter
    ordering_fields = ['id', 'amount', 'date', 'status']
    ordering = ['-date']