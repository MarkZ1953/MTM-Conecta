from django.contrib.auth.models import Permission, User, Group
from rest_framework import serializers

from utils.i18n import resolve_lang
from .permissions import resolve_permissions


class PermissionSerializer(serializers.ModelSerializer):
    app_label = serializers.CharField(source='content_type.app_label', read_only=True)
    model = serializers.CharField(source='content_type.model', read_only=True)

    class Meta:
        model = Permission
        fields = ['id', 'codename', 'name', 'app_label', 'model']


class GroupSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()
    permission_ids = serializers.PrimaryKeyRelatedField(
        source='permissions',
        queryset=Permission.objects.all(),
        many=True,
        write_only=True,
        required=False,
    )
    permission_codenames = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions', 'permission_ids', 'permission_codenames']

    def get_permissions(self, obj):
        request = self.context.get('request')
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE") if request else None)

        from .i18n import get_model_label, translate_permission_name

        return [
            {
                "id": permission.id,
                "codename": permission.codename,
                "name": translate_permission_name(permission.codename, lang),
                "model": get_model_label(permission.content_type.model, lang),
                "app_label": permission.content_type.app_label,
            }
            for permission in obj.permissions.select_related('content_type').order_by(
                'content_type__app_label',
                'content_type__model',
                'codename',
            )
        ]

    def _set_permission_codenames(self, group, codenames):
        if codenames is not None:
            group.permissions.set(resolve_permissions(codenames))

    def create(self, validated_data):
        codenames = validated_data.pop('permission_codenames', None)
        group = super().create(validated_data)
        self._set_permission_codenames(group, codenames)
        return group

    def update(self, instance, validated_data):
        codenames = validated_data.pop('permission_codenames', None)
        group = super().update(instance, validated_data)
        self._set_permission_codenames(group, codenames)
        return group


class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    role_ids = serializers.PrimaryKeyRelatedField(
        source='groups',
        queryset=Group.objects.all(),
        many=True,
        write_only=True,
        required=False,
    )
    password = serializers.CharField(
        write_only=True,
        required=False,
        min_length=8,
        style={'input_type': 'password'},
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                'is_active', 'is_staff', 'date_joined', 'groups',
                'role_ids', 'password']
        read_only_fields = ['date_joined']

    def create(self, validated_data):
        groups = validated_data.pop('groups', [])
        password = validated_data.pop('password', None)
        user = User(**validated_data)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save()
        if groups:
            user.groups.set(groups)
        return user

    def update(self, instance, validated_data):
        groups = validated_data.pop('groups', None)
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        if groups is not None:
            instance.groups.set(groups)

        return instance


class PublicRegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            'min_length': "La contraseña debe tener al menos 8 caracteres.",
            'blank': "La contraseña es obligatoria.",
            'required': "La contraseña es obligatoria.",
        },
    )
    username = serializers.CharField(
        error_messages={
            'blank': "El nombre de usuario es obligatorio.",
            'required': "El nombre de usuario es obligatorio.",
        },
    )

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'password', 'confirm_password',
        ]
        extra_kwargs = {
            'email': {'required': False, 'allow_blank': True},
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está registrado.")
        return value

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({
                'confirm_password': "Las contraseñas no coinciden."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
