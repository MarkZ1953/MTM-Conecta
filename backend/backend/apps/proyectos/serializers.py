from rest_framework import serializers
from .models import Proyecto, ProyectoBeneficiario


class ProyectoListSerializer(serializers.ModelSerializer):
    estado_display       = serializers.ReadOnlyField(source='get_estado_display')
    responsable_nombre   = serializers.ReadOnlyField(source='responsable.nombre_completo')
    porcentaje_recaudado = serializers.ReadOnlyField()
    beneficiarios_count  = serializers.SerializerMethodField()

    class Meta:
        model  = Proyecto
        fields = ['id', 'nombre', 'estado', 'estado_display', 'fecha_inicio', 'fecha_fin',
                  'presupuesto', 'monto_recaudado', 'porcentaje_recaudado',
                  'responsable', 'responsable_nombre', 'beneficiarios_count']

    def get_beneficiarios_count(self, obj):
        return obj.beneficiarios.count()


class ProyectoBeneficiarioSerializer(serializers.ModelSerializer):
    beneficiario_nombre = serializers.ReadOnlyField(source='beneficiario.persona.nombre_completo')

    class Meta:
        model  = ProyectoBeneficiario
        fields = ['id', 'beneficiario', 'beneficiario_nombre', 'fecha_vinculacion']


class ProyectoSerializer(serializers.ModelSerializer):
    estado_display       = serializers.ReadOnlyField(source='get_estado_display')
    porcentaje_recaudado = serializers.ReadOnlyField()
    responsable_nombre   = serializers.ReadOnlyField(source='responsable.nombre_completo')
    beneficiarios_vinculados = ProyectoBeneficiarioSerializer(
        source='proyectobeneficiario_set', many=True, read_only=True
    )

    class Meta:
        model  = Proyecto
        fields = ['id', 'nombre', 'descripcion', 'objetivo',
                  'fecha_inicio', 'fecha_fin', 'presupuesto', 'monto_recaudado',
                  'porcentaje_recaudado', 'estado', 'estado_display',
                  'responsable', 'responsable_nombre',
                  'beneficiarios_vinculados', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
