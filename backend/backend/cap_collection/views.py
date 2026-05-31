from django_filters.rest_framework import DjangoFilterBackend
from app.mixins.soft_delete_mixin import SoftDeleteMixin
from app.mixins.export_mixin import ExportMixin
from .serializers import CompanySerializer, CollectionPointSerializer, CollectionRequestSerializer
from .paginations import CompanyPagination, CollectionPointPagination, CollectionRequestPagination
from .models import Company, CollectionPoint, CollectionRequest
from .filters import CompanyFilter, CollectionPointFilter, CollectionRequestFilter
from rest_framework import viewsets, filters


class CompanyViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Company.objects.filter(is_active=True)
    serializer_class = CompanySerializer
    pagination_class = CompanyPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = CompanyFilter
    search_fields = ['nit', 'business_name', 'contact_name', 'contact_email']
    ordering_fields = ['id', 'nit', 'business_name', 'contact_name']
    ordering = ['-id']


class CollectionPointViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = CollectionPoint.objects.filter(is_active=True)
    serializer_class = CollectionPointSerializer
    pagination_class = CollectionPointPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = CollectionPointFilter
    search_fields = ['name', 'address', 'municipality', 'department']
    ordering_fields = ['id', 'name', 'municipality', 'department']
    ordering = ['-id']


class CollectionRequestViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = CollectionRequest.objects.filter(is_active=True)
    serializer_class = CollectionRequestSerializer
    pagination_class = CollectionRequestPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = CollectionRequestFilter
    search_fields = ['collection_point__name', 'driver_name', 'notes']
    ordering_fields = ['id', 'status', 'estimated_weight_kg', 'scheduled_date']
    ordering = ['-scheduled_date']
