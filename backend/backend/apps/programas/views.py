from rest_framework import viewsets, permissions
from .models import Programa, InscripcionPrograma, Seguimiento
from .serializers import (
    ProgramaSerializer,
    InscripcionProgramaSerializer, InscripcionProgramaListSerializer,
    SeguimientoSerializer, SeguimientoListSerializer,
)


class ProgramaViewSet(viewsets.ModelViewSet):
    queryset           = Programa.objects.prefetch_related('inscripciones').all()
    serializer_class   = ProgramaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['activo']
    search_fields      = ['nombre']


class InscripcionProgramaViewSet(viewsets.ModelViewSet):
    queryset = InscripcionPrograma.objects.select_related(
        'beneficiario__persona', 'programa', 'registrado_por'
    ).all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['programa', 'beneficiario', 'estado']
    search_fields      = ['beneficiario__persona__primer_apellido',
                          'beneficiario__persona__numero_documento']
    ordering_fields    = ['fecha_inscripcion']

    def get_serializer_class(self):
        if self.action == 'list':
            return InscripcionProgramaListSerializer
        return InscripcionProgramaSerializer

    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)


class SeguimientoViewSet(viewsets.ModelViewSet):
    queryset = Seguimiento.objects.select_related(
        'beneficiario__persona', 'programa', 'usuario'
    ).all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['beneficiario', 'programa', 'usuario',
                          'tipo_seguimiento', 'estado']
    search_fields      = ['beneficiario__persona__primer_apellido', 'descripcion']
    ordering_fields    = ['fecha_seguimiento', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return SeguimientoListSerializer
        return SeguimientoSerializer

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
