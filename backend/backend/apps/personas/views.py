from rest_framework import viewsets, permissions
from .models import Persona, ContactoEmergencia
from .serializers import PersonaSerializer, PersonaListSerializer, ContactoEmergenciaSerializer


class PersonaViewSet(viewsets.ModelViewSet):
    queryset           = Persona.objects.prefetch_related('contactos_emergencia').all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['tipo_persona', 'sexo', 'tipo_documento']
    search_fields      = ['primer_nombre', 'primer_apellido', 'numero_documento', 'email']
    ordering_fields    = ['primer_apellido', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return PersonaListSerializer
        return PersonaSerializer


class ContactoEmergenciaViewSet(viewsets.ModelViewSet):
    queryset           = ContactoEmergencia.objects.select_related('persona').all()
    serializer_class   = ContactoEmergenciaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['persona']
