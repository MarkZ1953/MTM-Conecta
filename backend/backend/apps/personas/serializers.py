from rest_framework import serializers
from .models import Persona, ContactoEmergencia


class ContactoEmergenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ContactoEmergencia
        fields = ['id', 'nombre', 'telefono', 'parentesco']


class PersonaSerializer(serializers.ModelSerializer):
    nombre_completo        = serializers.ReadOnlyField()
    contactos_emergencia   = ContactoEmergenciaSerializer(many=True, read_only=True)

    class Meta:
        model  = Persona
        fields = [
            'id', 'tipo_persona', 'nombre_completo',
            'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido',
            'tipo_documento', 'numero_documento', 'ciudad_exp_documento',
            'fecha_nacimiento', 'sexo', 'telefono', 'email',
            'contactos_emergencia', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class PersonaListSerializer(serializers.ModelSerializer):
    """Vista resumida para listados y selectores."""
    nombre_completo = serializers.ReadOnlyField()

    class Meta:
        model  = Persona
        fields = ['id', 'nombre_completo', 'tipo_documento', 'numero_documento',
                  'telefono', 'email', 'tipo_persona']
