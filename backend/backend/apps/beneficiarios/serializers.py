from rest_framework import serializers
from apps.personas.serializers import PersonaSerializer, PersonaListSerializer
from .models import Acudiente, OcupacionLaboral, Beneficiario, AcudienteBeneficiario


class OcupacionLaboralSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OcupacionLaboral
        fields = ['id', 'actualmente_trabaja', 'lugar_trabajo', 'horario_laboral',
                    'actividad_desempenada', 'tipo_contrato']


class AcudienteListSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField(source='persona.nombre_completo')
    documento       = serializers.ReadOnlyField(source='persona.numero_documento')
    telefono        = serializers.ReadOnlyField(source='persona.telefono')

    class Meta:
        model  = Acudiente
        fields = ['id', 'nombre_completo', 'documento', 'telefono', 'estado_civil', 'profesion']


class AcudienteSerializer(serializers.ModelSerializer):
    persona   = PersonaSerializer()
    ocupacion = OcupacionLaboralSerializer(read_only=True)

    class Meta:
        model  = Acudiente
        fields = ['id', 'persona', 'estado_civil', 'profesion', 'numero_hijos',
                    'ocupacion', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        persona_data = validated_data.pop('persona')
        persona_data['tipo_persona'] = 'acudiente'
        from apps.personas.models import Persona
        persona   = Persona.objects.create(**persona_data)
        acudiente = Acudiente.objects.create(persona=persona, **validated_data)
        return acudiente

    def update(self, instance, validated_data):
        persona_data = validated_data.pop('persona', None)
        if persona_data:
            for attr, value in persona_data.items():
                setattr(instance.persona, attr, value)
            instance.persona.save()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class BeneficiarioListSerializer(serializers.ModelSerializer):
    nombre_completo    = serializers.ReadOnlyField(source='persona.nombre_completo')
    documento          = serializers.ReadOnlyField(source='persona.numero_documento')
    fecha_nacimiento   = serializers.ReadOnlyField(source='persona.fecha_nacimiento')

    class Meta:
        model  = Beneficiario
        fields = ['id', 'nombre_completo', 'documento', 'fecha_nacimiento',
                    'diagnostico', 'grado_escolar', 'activo']


class BeneficiarioSerializer(serializers.ModelSerializer):
    persona   = PersonaSerializer()
    acudientes = serializers.SerializerMethodField()

    class Meta:
        model  = Beneficiario
        fields = ['id', 'persona', 'diagnostico', 'ultima_evolucion', 'grado_escolar',
                    'fecha_ingreso_hosp', 'lugar_nacimiento', 'activo',
                    'acudientes', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_acudientes(self, obj):
        relaciones = obj.relaciones.select_related('acudiente__persona').all()
        return [
            {
                'id':                    r.acudiente.id,
                'nombre_completo':       r.acudiente.persona.nombre_completo,
                'parentesco':            r.parentesco,
                'es_acudiente_principal': r.es_acudiente_principal,
            }
            for r in relaciones
        ]

    def create(self, validated_data):
        persona_data = validated_data.pop('persona')
        persona_data['tipo_persona'] = 'beneficiario'
        from apps.personas.models import Persona
        persona      = Persona.objects.create(**persona_data)
        beneficiario = Beneficiario.objects.create(persona=persona, **validated_data)
        return beneficiario

    def update(self, instance, validated_data):
        persona_data = validated_data.pop('persona', None)
        if persona_data:
            for attr, value in persona_data.items():
                setattr(instance.persona, attr, value)
            instance.persona.save()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class AcudienteBeneficiarioSerializer(serializers.ModelSerializer):
    class Meta:
        model  = AcudienteBeneficiario
        fields = ['id', 'acudiente', 'beneficiario', 'parentesco', 'es_acudiente_principal']
