from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Acudiente, OcupacionLaboral, Beneficiario, AcudienteBeneficiario
from .serializers import (
    AcudienteListSerializer, AcudienteSerializer,
    OcupacionLaboralSerializer,
    BeneficiarioListSerializer, BeneficiarioSerializer,
    AcudienteBeneficiarioSerializer,
)


class AcudienteViewSet(viewsets.ModelViewSet):
    queryset           = Acudiente.objects.select_related('persona', 'ocupacion').all()
    permission_classes = [permissions.IsAuthenticated]
    search_fields      = ['persona__primer_nombre', 'persona__primer_apellido',
                          'persona__numero_documento']
    filterset_fields   = ['estado_civil']
    ordering_fields    = ['persona__primer_apellido']

    def get_serializer_class(self):
        if self.action == 'list':
            return AcudienteListSerializer
        return AcudienteSerializer

    @action(detail=True, methods=['get'], url_path='beneficiarios')
    def beneficiarios(self, request, pk=None):
        """Lista los beneficiarios asociados a este acudiente."""
        acudiente    = self.get_object()
        beneficiarios = [r.beneficiario for r in acudiente.relaciones.select_related('beneficiario__persona')]
        serializer   = BeneficiarioListSerializer(beneficiarios, many=True)
        return Response(serializer.data)


class OcupacionLaboralViewSet(viewsets.ModelViewSet):
    queryset           = OcupacionLaboral.objects.select_related('acudiente').all()
    serializer_class   = OcupacionLaboralSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['acudiente', 'actualmente_trabaja', 'tipo_contrato']


class BeneficiarioViewSet(viewsets.ModelViewSet):
    queryset           = Beneficiario.objects.select_related('persona').prefetch_related('relaciones').all()
    permission_classes = [permissions.IsAuthenticated]
    search_fields      = ['persona__primer_nombre', 'persona__primer_apellido',
                          'persona__numero_documento', 'diagnostico']
    filterset_fields   = ['activo']
    ordering_fields    = ['persona__primer_apellido', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return BeneficiarioListSerializer
        return BeneficiarioSerializer

    @action(detail=True, methods=['get'], url_path='acudientes')
    def acudientes(self, request, pk=None):
        """Lista los acudientes de este beneficiario."""
        beneficiario = self.get_object()
        relaciones   = beneficiario.relaciones.select_related('acudiente__persona').all()
        data = [
            {
                'id':                     r.acudiente.id,
                'nombre_completo':        r.acudiente.persona.nombre_completo,
                'parentesco':             r.parentesco,
                'es_acudiente_principal': r.es_acudiente_principal,
                'telefono':               r.acudiente.persona.telefono,
            }
            for r in relaciones
        ]
        return Response(data)

    @action(detail=True, methods=['get'], url_path='historial')
    def historial(self, request, pk=None):
        """Resumen completo: caracterizaciones, inscripciones y seguimientos."""
        from apps.caracterizaciones.serializers import CaracterizacionListSerializer
        from apps.programas.serializers import InscripcionProgramaListSerializer, SeguimientoListSerializer

        beneficiario = self.get_object()
        return Response({
            'caracterizaciones': CaracterizacionListSerializer(
                beneficiario.caracterizaciones.all(), many=True).data,
            'inscripciones': InscripcionProgramaListSerializer(
                beneficiario.inscripciones.all(), many=True).data,
            'seguimientos': SeguimientoListSerializer(
                beneficiario.seguimientos.all()[:10], many=True).data,
        })


class AcudienteBeneficiarioViewSet(viewsets.ModelViewSet):
    queryset           = AcudienteBeneficiario.objects.select_related('acudiente', 'beneficiario').all()
    serializer_class   = AcudienteBeneficiarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['acudiente', 'beneficiario', 'parentesco']
