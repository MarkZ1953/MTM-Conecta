from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Usuario, Rol, Permiso, RolPermiso, UsuarioRol, Auditoria


# ── Auth ──────────────────────────────────────────────────────────

class MtmTokenObtainPairSerializer(TokenObtainPairSerializer):
    """JWT personalizado: incluye datos del usuario en el token."""
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email']          = user.email
        token['nombre_completo'] = user.nombre_completo
        token['is_staff']       = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['usuario'] = {
            'id':             self.user.id,
            'email':          self.user.email,
            'nombre_completo': self.user.nombre_completo,
            'is_staff':       self.user.is_staff,
        }
        return data


# ── Usuarios ──────────────────────────────────────────────────────

class UsuarioListSerializer(serializers.ModelSerializer):
    """Vista resumida para listados."""
    nombre_completo = serializers.ReadOnlyField()

    class Meta:
        model  = Usuario
        fields = ['id', 'email', 'nombre_completo', 'primer_nombre', 'primer_apellido',
                  'is_active', 'is_staff', 'ultimo_acceso']


class UsuarioDetailSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()

    class Meta:
        model  = Usuario
        fields = ['id', 'email', 'nombre_completo', 'primer_nombre', 'primer_apellido',
                  'is_active', 'is_staff', 'ultimo_acceso', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'ultimo_acceso']


class UsuarioCreateSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label='Confirmar contraseña')

    class Meta:
        model  = Usuario
        fields = ['email', 'primer_nombre', 'primer_apellido', 'password', 'password2',
                  'is_active', 'is_staff']

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({'password2': 'Las contraseñas no coinciden.'})
        return attrs

    def create(self, validated_data):
        return Usuario.objects.create_user(**validated_data)


class CambiarPasswordSerializer(serializers.Serializer):
    password_actual = serializers.CharField(write_only=True)
    password_nueva  = serializers.CharField(write_only=True, min_length=8)
    password_nueva2 = serializers.CharField(write_only=True, label='Confirmar nueva contraseña')

    def validate(self, attrs):
        if attrs['password_nueva'] != attrs['password_nueva2']:
            raise serializers.ValidationError({'password_nueva2': 'Las contraseñas no coinciden.'})
        return attrs


# ── Roles y Permisos ──────────────────────────────────────────────

class PermisoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Permiso
        fields = '__all__'


class RolSerializer(serializers.ModelSerializer):
    permisos = serializers.SerializerMethodField()

    class Meta:
        model  = Rol
        fields = ['id', 'nombre', 'descripcion', 'activo', 'permisos', 'created_at']
        read_only_fields = ['created_at']

    def get_permisos(self, obj):
        codigos = obj.rol_permisos.select_related('permiso').values_list('permiso__codigo', flat=True)
        return list(codigos)


class UsuarioRolSerializer(serializers.ModelSerializer):
    rol_nombre   = serializers.ReadOnlyField(source='rol.nombre')
    asignado_por_nombre = serializers.ReadOnlyField(source='asignado_por.nombre_completo')

    class Meta:
        model  = UsuarioRol
        fields = ['id', 'usuario', 'rol', 'rol_nombre', 'asignado_por', 'asignado_por_nombre', 'asignado_en']
        read_only_fields = ['asignado_en']


# ── Auditoría ─────────────────────────────────────────────────────

class AuditoriaSerializer(serializers.ModelSerializer):
    usuario_email = serializers.ReadOnlyField(source='usuario.email')

    class Meta:
        model  = Auditoria
        fields = ['id', 'usuario', 'usuario_email', 'accion', 'tabla_afectada',
                  'registro_id', 'datos_anteriores', 'datos_nuevos',
                  'ip_address', 'created_at']
        read_only_fields = fields
