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

from rest_framework.views import APIView
from rest_framework import status
from django.utils import timezone
from apps.personas.models import Persona
import datetime

class PublicDonacionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        nombre_completo = data.get('fullName', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        tipo_donacion = data.get('type', 'dinero')
        monto = data.get('amount')
        descripcion = data.get('description', '').strip()

        if not nombre_completo or not email:
            return Response({'detail': 'Nombre y correo son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        # Basic validation
        if tipo_donacion == 'dinero':
            try:
                monto_float = float(monto)
                if monto_float <= 0:
                    return Response({'detail': 'El monto debe ser mayor a 0'}, status=status.HTTP_400_BAD_REQUEST)
            except (ValueError, TypeError):
                return Response({'detail': 'Monto inválido'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            monto = None
            if not descripcion:
                return Response({'detail': 'La descripción es requerida para donaciones en especie'}, status=status.HTTP_400_BAD_REQUEST)

        # Splitting name
        partes = nombre_completo.split(' ', 1)
        primer_nombre = partes[0]
        primer_apellido = partes[1] if len(partes) > 1 else ''

        # Buscar o crear Persona
        persona, created = Persona.objects.get_or_create(
            email=email,
            defaults={
                'primer_nombre': primer_nombre,
                'primer_apellido': primer_apellido,
                'telefono': phone
            }
        )

        # Buscar o crear Donante
        donante, d_created = Donante.objects.get_or_create(
            persona=persona,
            defaults={
                'tipo_donante': 'persona_natural',
                'telefono': phone,
                'email': email,
                'fecha_registro': datetime.date.today()
            }
        )

        # Crear Donacion
        donacion = Donacion.objects.create(
            donante=donante,
            tipo_donacion=tipo_donacion,
            monto=monto,
            descripcion=descripcion,
            fecha_donacion=datetime.date.today(),
            estado='recibida'
        )

        return Response({'detail': 'Donación registrada exitosamente', 'id': donacion.id}, status=status.HTTP_201_CREATED)
