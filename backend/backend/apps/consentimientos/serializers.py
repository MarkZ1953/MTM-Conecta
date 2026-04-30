from rest_framework import serializers
from .models import Consentimiento


class ConsentimientoListSerializer(serializers.ModelSerializer):
    tipo_display = serializers.ReadOnlyField(source='get_tipo_display')

    class Meta:
        model  = Consentimiento
        fields = ['id', 'tipo', 'tipo_display', 'firmante_nombre', 'firmante_cedula',
                  'fecha_firma', 'acepta_uso_imagen', 'acepta_datos_sensibles',
                  'beneficiario', 'acudiente']


class ConsentimientoSerializer(serializers.ModelSerializer):
    tipo_display = serializers.ReadOnlyField(source='get_tipo_display')

    class Meta:
        model  = Consentimiento
        fields = [
            'id', 'tipo', 'tipo_display', 'beneficiario', 'acudiente',
            'firmante_nombre', 'firmante_cedula', 'firmante_ciudad_exp',
            'firmante_telefono', 'firmante_es_rep_legal',
            'menor_nombre', 'menor_tipo_documento', 'menor_numero_documento',
            'acepta_uso_imagen', 'acepta_datos_sensibles', 'acepta_publicacion_redes',
            'ciudad_firma', 'fecha_firma', 'firma_imagen',
            'registrado_por', 'created_at',
        ]
        read_only_fields = ['created_at']

    def validate(self, attrs):
        # Si es de tipo menor_edad, el nombre del menor es obligatorio
        if attrs.get('tipo') == 'menor_edad' and not attrs.get('menor_nombre'):
            raise serializers.ValidationError(
                {'menor_nombre': 'El nombre del menor es obligatorio para consentimientos de menores de edad.'}
            )
        return attrs
