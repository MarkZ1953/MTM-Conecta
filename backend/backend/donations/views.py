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
    search_fields = ['first_name', 'last_name', 'email', 'organization_name']
    ordering_fields = [
        'id', 'donor_type', 'organization_name',
        'first_name', 'last_name', 'email'
    ]
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
    search_fields = [
        'donor__first_name', 'donor__last_name',
        'donor__email', 'donor__organization_name'
    ]
    ordering_fields = ['id', 'amount', 'donation_type', 'date', 'status']
    ordering = ['-date']
