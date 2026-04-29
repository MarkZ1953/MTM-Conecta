from rest_framework import viewsets, permissions
from .models import Caracterizacion, MiembroFamilia
from .serializers import CaracterizacionSerializer, CaracterizacionListSerializer, MiembroFamiliaSerializer


class CaracterizacionViewSet(viewsets.ModelViewSet):
    queryset = Caracterizacion.objects.select_related(
        'beneficiario__persona', 'acudiente__persona', 'registrado_por'
    ).prefetch_related('miembros_familia').all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['beneficiario', 'acudiente', 'municipio', 'departamento',
                          'estrato', 'zona_residencia', 'tipo_vivienda']
    search_fields      = ['beneficiario__persona__primer_apellido',
                          'beneficiario__persona__numero_documento',
                          'municipio', 'departamento']
    ordering_fields    = ['fecha_registro', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return CaracterizacionListSerializer
        return CaracterizacionSerializer

    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)


class MiembroFamiliaViewSet(viewsets.ModelViewSet):
    queryset           = MiembroFamilia.objects.select_related('caracterizacion').all()
    serializer_class   = MiembroFamiliaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['caracterizacion']
