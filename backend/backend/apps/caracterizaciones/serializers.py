from rest_framework import serializers
from .models import Caracterizacion, MiembroFamilia


class MiembroFamiliaSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MiembroFamilia
        fields = ['id', 'nombre', 'edad', 'parentesco', 'ocupacion']


class CaracterizacionListSerializer(serializers.ModelSerializer):
    beneficiario_nombre = serializers.ReadOnlyField(source='beneficiario.persona.nombre_completo')
    acudiente_nombre    = serializers.ReadOnlyField(source='acudiente.persona.nombre_completo')

    class Meta:
        model  = Caracterizacion
        fields = ['id', 'beneficiario', 'beneficiario_nombre', 'acudiente',
                  'acudiente_nombre', 'fecha_registro', 'municipio', 'departamento', 'estrato']


class CaracterizacionSerializer(serializers.ModelSerializer):
    miembros_familia = MiembroFamiliaSerializer(many=True, required=False)

    class Meta:
        model  = Caracterizacion
        fields = [
            'id', 'beneficiario', 'acudiente', 'registrado_por', 'fecha_registro',
            # Vivienda
            'tipo_vivienda', 'zona_residencia', 'direccion', 'barrio', 'municipio',
            'departamento', 'estrato',
            # Grupos poblacionales
            'grupo_afrocolombiano', 'grupo_indigena', 'grupo_lgbtq', 'grupo_migrante',
            'grupo_desplazado', 'grupo_rom', 'grupo_otro',
            # Salud
            'tiene_eps', 'nombre_eps', 'tipo_eps',
            'tiene_sisben', 'nivel_sisben',
            'tiene_caja_comp', 'nombre_caja_comp',
            # Servicios
            'servicio_luz', 'servicio_agua', 'servicio_gas',
            'servicio_television', 'servicio_internet',
            'tiene_transporte', 'tipo_transporte',
            # Familia
            'convivientes_cantidad', 'ingreso_mensual_familiar', 'descripcion_relacion_fam',
            # Derechos fundamentales
            'forma_suplir_alimentacion', 'alimentos_comidas',
            'nna_en_sistema_educativo', 'actividades_tiempo_libre', 'frecuencia_actividades',
            # Cierre
            'observaciones', 'miembros_familia', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        miembros_data = validated_data.pop('miembros_familia', [])
        caracterizacion = Caracterizacion.objects.create(**validated_data)
        for miembro in miembros_data:
            MiembroFamilia.objects.create(caracterizacion=caracterizacion, **miembro)
        return caracterizacion

    def update(self, instance, validated_data):
        miembros_data = validated_data.pop('miembros_familia', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if miembros_data is not None:
            instance.miembros_familia.all().delete()
            for miembro in miembros_data:
                MiembroFamilia.objects.create(caracterizacion=instance, **miembro)
        return instance
