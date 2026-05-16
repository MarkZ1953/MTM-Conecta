from django_filters.rest_framework import DjangoFilterBackend
from app.mixins.soft_delete_mixin import SoftDeleteMixin
from app.mixins.export_mixin import ExportMixin
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, filters, status

from beneficiaries.serializers import BeneficiarySerializer
from beneficiaries.models import Beneficiary

from .serializers import ProjectSerializer
from .paginations import ProjectPagination
from .filters import ProjectFilter
from .models import Project


PROJECTS_EXPORT_COLUMNS = [
    {"header": "Nombre", "accessor": lambda obj: obj.name},
    {"header": "Descripción", "accessor": lambda obj: obj.description or ""},
    {"header": "Fecha de inicio", "accessor": lambda obj: obj.start_date},
    {"header": "Fecha de fin", "accessor": lambda obj: obj.end_date or ""},
    {"header": "Estado", "accessor": lambda obj: obj.get_status_display()},
]


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
    ordering_fields = ['id', 'name', 'start_date', 'end_date', 'status']
    ordering = ['-id']

    export_columns = PROJECTS_EXPORT_COLUMNS
    export_filename = "proyectos"

    soft_delete_model_name = "el proyecto"
    soft_delete_model_name_plural = "los proyectos"

    @action(detail=True, methods=["get"], url_path="beneficiaries")
    def list_beneficiaries(self, request, pk=None):
        project = self.get_object()
        beneficiaries = project.beneficiaries.filter(is_active=True)
        serializer = BeneficiarySerializer(beneficiaries, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="add-beneficiary")
    def add_beneficiary(self, request, pk=None):
        project = self.get_object()
        beneficiary_id = request.data.get("beneficiary_id")

        if not beneficiary_id:
            return Response(
                {"message": "El campo beneficiary_id es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            beneficiary = Beneficiary.objects.get(id=beneficiary_id, is_active=True)
        except Beneficiary.DoesNotExist:
            return Response(
                {"message": "Beneficiario no encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        project.beneficiaries.add(beneficiary)

        return Response(
            {"message": "Beneficiario asociado correctamente."},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"], url_path="remove-beneficiary")
    def remove_beneficiary(self, request, pk=None):
        project = self.get_object()
        beneficiary_id = request.data.get("beneficiary_id")

        if not beneficiary_id:
            return Response(
                {"message": "El campo beneficiary_id es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            beneficiary = Beneficiary.objects.get(id=beneficiary_id)
        except Beneficiary.DoesNotExist:
            return Response(
                {"message": "Beneficiario no encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        project.beneficiaries.remove(beneficiary)

        return Response(
            {"message": "Beneficiario desasociado correctamente."},
            status=status.HTTP_200_OK,
        )
