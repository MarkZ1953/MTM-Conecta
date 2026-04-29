from rest_framework import viewsets, permissions
from .models import Consentimiento
from .serializers import ConsentimientoSerializer, ConsentimientoListSerializer


class ConsentimientoViewSet(viewsets.ModelViewSet):
    queryset = Consentimiento.objects.select_related(
        'beneficiario__persona', 'acudiente__persona', 'registrado_por'
    ).all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['tipo', 'beneficiario', 'acudiente',
                          'acepta_uso_imagen', 'acepta_datos_sensibles']
    search_fields      = ['firmante_nombre', 'firmante_cedula', 'menor_nombre']
    ordering_fields    = ['fecha_firma', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ConsentimientoListSerializer
        return ConsentimientoSerializer

    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)
