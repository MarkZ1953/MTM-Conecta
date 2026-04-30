from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Proyecto, ProyectoBeneficiario
from .serializers import ProyectoSerializer, ProyectoListSerializer, ProyectoBeneficiarioSerializer


class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.select_related('responsable').prefetch_related('beneficiarios').all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['estado', 'responsable']
    search_fields      = ['nombre', 'descripcion', 'objetivo']
    ordering_fields    = ['fecha_inicio', 'created_at', 'nombre']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProyectoListSerializer
        return ProyectoSerializer

    @action(detail=True, methods=['get'], url_path='donaciones')
    def donaciones(self, request, pk=None):
        """Lista las donaciones asociadas a este proyecto."""
        from apps.donantes.serializers import DonacionListSerializer
        proyecto   = self.get_object()
        donaciones = proyecto.donaciones.select_related('donante__persona').all()
        serializer = DonacionListSerializer(donaciones, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='vincular-beneficiario')
    def vincular_beneficiario(self, request, pk=None):
        """Vincula un beneficiario al proyecto."""
        proyecto        = self.get_object()
        beneficiario_id = request.data.get('beneficiario_id')
        fecha           = request.data.get('fecha_vinculacion')
        if not beneficiario_id:
            return Response({'error': 'beneficiario_id es requerido.'}, status=400)
        vinculo, created = ProyectoBeneficiario.objects.get_or_create(
            proyecto=proyecto, beneficiario_id=beneficiario_id,
            defaults={'fecha_vinculacion': fecha},
        )
        return Response({'created': created, 'id': vinculo.id})


class ProyectoBeneficiarioViewSet(viewsets.ModelViewSet):
    queryset           = ProyectoBeneficiario.objects.select_related('proyecto', 'beneficiario__persona').all()
    serializer_class   = ProyectoBeneficiarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['proyecto', 'beneficiario']
