from rest_framework import serializers
from .models import Voluntario
from apps.personas.serializers import PersonaListSerializer

class VoluntarioListSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()
    email = serializers.ReadOnlyField(source='persona.email')
    telefono = serializers.ReadOnlyField(source='persona.telefono')
    estado_display = serializers.ReadOnlyField(source='get_estado_display')
    disponibilidad_display = serializers.ReadOnlyField(source='get_disponibilidad_display')

    class Meta:
        model = Voluntario
        fields = ['id', 'nombre_completo', 'email', 'telefono', 'disponibilidad', 
                  'disponibilidad_display', 'estado', 'estado_display', 'fecha_inicio']

class VoluntarioSerializer(serializers.ModelSerializer):
    persona_detalle = PersonaListSerializer(source='persona', read_only=True)

    class Meta:
        model = Voluntario
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'registrado_por']
