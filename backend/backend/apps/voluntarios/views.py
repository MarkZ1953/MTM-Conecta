from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Voluntario
from apps.personas.models import Persona
import datetime
from django.utils import timezone
from .serializers import VoluntarioSerializer, VoluntarioListSerializer

class VoluntarioViewSet(viewsets.ModelViewSet):
    queryset = Voluntario.objects.select_related('persona').all().order_by('-created_at')
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['estado', 'disponibilidad']
    search_fields = ['persona__primer_nombre', 'persona__primer_apellido', 'persona__email']
    ordering_fields = ['created_at', 'fecha_inicio']

    def get_serializer_class(self):
        if self.action == 'list':
            return VoluntarioListSerializer
        return VoluntarioSerializer

    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)

class PublicVoluntarioView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        nombre_completo = data.get('fullName', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        skills = data.get('skills', '').strip()
        availability = data.get('availability', 'flexible')

        if not nombre_completo or not email:
            return Response({'detail': 'Nombre y correo son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

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
        if not created and not persona.telefono and phone:
            persona.telefono = phone
            persona.save()

        # Buscar o crear Voluntario
        voluntario, v_created = Voluntario.objects.get_or_create(
            persona=persona,
            defaults={
                'habilidades': skills,
                'disponibilidad': availability,
                'estado': 'pendiente',
                'fecha_inicio': datetime.date.today(),
                'acepta_tratamiento_datos': True,
                'fecha_aceptacion': timezone.now() if hasattr(timezone, 'now') else datetime.datetime.now()
            }
        )

        return Response({'detail': 'Solicitud de voluntariado registrada exitosamente', 'id': voluntario.id}, status=status.HTTP_201_CREATED)
