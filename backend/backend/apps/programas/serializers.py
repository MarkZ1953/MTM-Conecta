from rest_framework import serializers
from .models import Programa, InscripcionPrograma, Seguimiento


class ProgramaSerializer(serializers.ModelSerializer):
    inscritos_count = serializers.SerializerMethodField()

    class Meta:
        model  = Programa
        fields = ['id', 'nombre', 'descripcion', 'beneficios', 'activo',
                  'inscritos_count', 'created_at']
        read_only_fields = ['created_at']

    def get_inscritos_count(self, obj):
        return obj.inscripciones.filter(estado='activo').count()


class InscripcionProgramaListSerializer(serializers.ModelSerializer):
    beneficiario_nombre = serializers.ReadOnlyField(source='beneficiario.persona.nombre_completo')
    programa_nombre     = serializers.ReadOnlyField(source='programa.nombre')
    estado_display      = serializers.ReadOnlyField(source='get_estado_display')

    class Meta:
        model  = InscripcionPrograma
        fields = ['id', 'beneficiario', 'beneficiario_nombre', 'programa', 'programa_nombre',
                  'fecha_inscripcion', 'estado', 'estado_display', 'fecha_egreso']


class InscripcionProgramaSerializer(serializers.ModelSerializer):
    class Meta:
        model  = InscripcionPrograma
        fields = ['id', 'beneficiario', 'programa', 'fecha_inscripcion', 'estado',
                  'fecha_egreso', 'motivo_egreso', 'observaciones', 'registrado_por', 'created_at']
        read_only_fields = ['created_at']


class SeguimientoListSerializer(serializers.ModelSerializer):
    beneficiario_nombre  = serializers.ReadOnlyField(source='beneficiario.persona.nombre_completo')
    tipo_display         = serializers.ReadOnlyField(source='get_tipo_seguimiento_display')
    estado_display       = serializers.ReadOnlyField(source='get_estado_display')
    usuario_nombre       = serializers.ReadOnlyField(source='usuario.nombre_completo')

    class Meta:
        model  = Seguimiento
        fields = ['id', 'beneficiario', 'beneficiario_nombre', 'programa',
                  'usuario', 'usuario_nombre', 'fecha_seguimiento',
                  'tipo_seguimiento', 'tipo_display', 'estado', 'estado_display']


class SeguimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Seguimiento
        fields = ['id', 'beneficiario', 'programa', 'usuario', 'fecha_seguimiento',
                  'tipo_seguimiento', 'descripcion', 'estado', 'created_at']
        read_only_fields = ['created_at']
