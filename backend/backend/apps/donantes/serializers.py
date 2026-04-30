from rest_framework import serializers
from apps.personas.serializers import PersonaListSerializer
from .models import Donante, Donacion


class DonanteListSerializer(serializers.ModelSerializer):
    nombre_display = serializers.SerializerMethodField()

    class Meta:
        model  = Donante
        fields = ['id', 'tipo_donante', 'nombre_display', 'telefono', 'email', 'ciudad', 'activo']

    def get_nombre_display(self, obj):
        if obj.tipo_donante == 'empresa':
            return obj.nombre_empresa
        return obj.persona.nombre_completo if obj.persona else '—'


class DonanteSerializer(serializers.ModelSerializer):
    persona_detalle = PersonaListSerializer(source='persona', read_only=True)

    class Meta:
        model  = Donante
        fields = ['id', 'tipo_donante', 'persona', 'persona_detalle',
                  'nombre_empresa', 'nit', 'representante',
                  'telefono', 'email', 'ciudad', 'activo', 'notas',
                  'fecha_registro', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, attrs):
        if attrs.get('tipo_donante') == 'empresa' and not attrs.get('nombre_empresa'):
            raise serializers.ValidationError(
                {'nombre_empresa': 'El nombre de la empresa es obligatorio para personas jurídicas.'}
            )
        if attrs.get('tipo_donante') == 'persona_natural' and not attrs.get('persona'):
            raise serializers.ValidationError(
                {'persona': 'Debe asociar una persona natural al donante.'}
            )
        return attrs


class DonacionListSerializer(serializers.ModelSerializer):
    donante_nombre    = serializers.SerializerMethodField()
    tipo_display      = serializers.ReadOnlyField(source='get_tipo_donacion_display')
    estado_display    = serializers.ReadOnlyField(source='get_estado_display')

    class Meta:
        model  = Donacion
        fields = ['id', 'donante', 'donante_nombre', 'proyecto', 'tipo_donacion', 'tipo_display',
                  'monto', 'fecha_donacion', 'estado', 'estado_display']

    def get_donante_nombre(self, obj):
        if obj.donante.tipo_donante == 'empresa':
            return obj.donante.nombre_empresa
        return obj.donante.persona.nombre_completo if obj.donante.persona else '—'


class DonacionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Donacion
        fields = ['id', 'donante', 'proyecto', 'tipo_donacion', 'monto', 'descripcion',
                  'fecha_donacion', 'comprobante', 'estado', 'registrado_por', 'created_at']
        read_only_fields = ['created_at']
