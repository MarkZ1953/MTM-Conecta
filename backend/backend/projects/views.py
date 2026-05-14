from django_filters.rest_framework import DjangoFilterBackend
from app.mixins.soft_delete_mixin import SoftDeleteMixin
from app.mixins.export_mixin import ExportMixin
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets, filters, status
from beneficiaries.models import Beneficiary
from beneficiaries.serializers import BeneficiarySerializer
from .serializers import ProjectSerializer
from .paginations import ProjectPagination
from .filters import ProjectFilter
from .models import Project


class ProjectViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Project.objects.filter(is_active=True)
    serializer_class = ProjectSerializer
    pagination_class = ProjectPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = ProjectFilter
    ordering_fields = ['id', 'name', 'start_date', 'status']
    ordering = ['-id']

    @action(detail=True, methods=['get'], url_path='beneficiaries')
    def list_beneficiaries(self, request, pk=None):
        project = self.get_object()
        beneficiaries = project.beneficiaries.filter(is_active=True)
        serializer = BeneficiarySerializer(beneficiaries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='add-beneficiary')
    def add_beneficiary(self, request, pk=None):
        project = self.get_object()
        beneficiary_id = request.data.get('beneficiary_id')

        if not beneficiary_id:
            return Response(
                {'detail': 'El campo beneficiary_id es requerido.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            beneficiary = Beneficiary.objects.get(id=beneficiary_id, is_active=True)
        except Beneficiary.DoesNotExist:
            return Response(
                {'detail': 'Beneficiario no encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )

        project.beneficiaries.add(beneficiary)
        return Response(
            {'detail': f'Beneficiario {beneficiary} agregado al proyecto {project}.'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], url_path='remove-beneficiary')
    def remove_beneficiary(self, request, pk=None):
        project = self.get_object()
        beneficiary_id = request.data.get('beneficiary_id')

        if not beneficiary_id:
            return Response(
                {'detail': 'El campo beneficiary_id es requerido.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            beneficiary = Beneficiary.objects.get(id=beneficiary_id)
        except Beneficiary.DoesNotExist:
            return Response(
                {'detail': 'Beneficiario no encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )

        project.beneficiaries.remove(beneficiary)
        return Response(
            {'detail': f'Beneficiario {beneficiary} removido del proyecto {project}.'},
            status=status.HTTP_200_OK
        )