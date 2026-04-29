from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Donante, Donacion
from .serializers import (
    DonanteListSerializer, DonanteSerializer,
    DonacionListSerializer, DonacionSerializer,
)


class DonanteViewSet(viewsets.ModelViewSet):
    queryset = Donante.objects.select_related('persona').all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['tipo_donante', 'activo', 'ciudad']
    search_fields      = ['nombre_empresa', 'nit', 'representante',
                          'persona__primer_nombre', 'persona__primer_apellido',
                          'persona__numero_documento']
    ordering_fields    = ['created_at', 'fecha_registro']

    def get_serializer_class(self):
        if self.action == 'list':
            return DonanteListSerializer
        return DonanteSerializer

    @action(detail=True, methods=['get'], url_path='donaciones')
    def donaciones(self, request, pk=None):
        """Historial de donaciones del donante."""
        donante    = self.get_object()
        donaciones = donante.donaciones.select_related('proyecto').all()
        serializer = DonacionListSerializer(donaciones, many=True)
        return Response(serializer.data)


class DonacionViewSet(viewsets.ModelViewSet):
    queryset = Donacion.objects.select_related(
        'donante__persona', 'proyecto', 'registrado_por'
    ).all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['donante', 'proyecto', 'tipo_donacion', 'estado']
    search_fields      = ['donante__nombre_empresa', 'donante__persona__primer_apellido', 'descripcion']
    ordering_fields    = ['fecha_donacion', 'monto']

    def get_serializer_class(self):
        if self.action == 'list':
            return DonacionListSerializer
        return DonacionSerializer

    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)
