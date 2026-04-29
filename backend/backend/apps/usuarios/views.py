from django.utils import timezone
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Usuario, Rol, Permiso, UsuarioRol, Auditoria
from .serializers import (
    MtmTokenObtainPairSerializer,
    UsuarioListSerializer, UsuarioDetailSerializer, UsuarioCreateSerializer,
    CambiarPasswordSerializer, RolSerializer, PermisoSerializer,
    UsuarioRolSerializer, AuditoriaSerializer,
)


class MtmTokenObtainPairView(TokenObtainPairView):
    """Login — devuelve access + refresh + datos del usuario."""
    serializer_class = MtmTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Registrar en auditoría
            try:
                user = Usuario.objects.get(email=request.data.get('email'))
                user.ultimo_acceso = timezone.now()
                user.save(update_fields=['ultimo_acceso'])
                Auditoria.objects.create(
                    usuario=user, accion='LOGIN',
                    ip_address=request.META.get('REMOTE_ADDR'),
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                )
            except Usuario.DoesNotExist:
                pass
        return response


class LogoutView(TokenObtainPairView):
    """Logout — invalida el refresh token."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            Auditoria.objects.create(
                usuario=request.user, accion='LOGOUT',
                ip_address=request.META.get('REMOTE_ADDR'),
            )
            return Response({'detail': 'Sesión cerrada correctamente.'})
        except Exception:
            return Response({'detail': 'Token inválido.'}, status=status.HTTP_400_BAD_REQUEST)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('primer_apellido')
    permission_classes = [permissions.IsAuthenticated]
    search_fields  = ['email', 'primer_nombre', 'primer_apellido']
    ordering_fields = ['primer_apellido', 'email', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return UsuarioListSerializer
        if self.action == 'create':
            return UsuarioCreateSerializer
        return UsuarioDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """Retorna los datos del usuario autenticado."""
        serializer = UsuarioDetailSerializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='cambiar-password')
    def cambiar_password(self, request, pk=None):
        usuario   = self.get_object()
        serializer = CambiarPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        if not usuario.check_password(serializer.validated_data['password_actual']):
            return Response({'password_actual': 'Contraseña incorrecta.'}, status=status.HTTP_400_BAD_REQUEST)
        usuario.set_password(serializer.validated_data['password_nueva'])
        usuario.save()
        return Response({'detail': 'Contraseña actualizada correctamente.'})

    @action(detail=True, methods=['post'], url_path='activar')
    def activar(self, request, pk=None):
        usuario = self.get_object()
        usuario.is_active = True
        usuario.save()
        return Response({'detail': 'Usuario activado.'})

    @action(detail=True, methods=['post'], url_path='desactivar')
    def desactivar(self, request, pk=None):
        usuario = self.get_object()
        usuario.is_active = False
        usuario.save()
        return Response({'detail': 'Usuario desactivado.'})


class RolViewSet(viewsets.ModelViewSet):
    queryset           = Rol.objects.all()
    serializer_class   = RolSerializer
    permission_classes = [permissions.IsAdminUser]
    search_fields      = ['nombre']


class PermisoViewSet(viewsets.ModelViewSet):
    queryset           = Permiso.objects.all()
    serializer_class   = PermisoSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields   = ['modulo']
    search_fields      = ['codigo', 'descripcion']


class UsuarioRolViewSet(viewsets.ModelViewSet):
    queryset           = UsuarioRol.objects.select_related('usuario', 'rol').all()
    serializer_class   = UsuarioRolSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields   = ['usuario', 'rol']


class AuditoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """Solo lectura — el log de auditoría no se edita."""
    queryset           = Auditoria.objects.select_related('usuario').all()
    serializer_class   = AuditoriaSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields   = ['accion', 'tabla_afectada', 'usuario']
    search_fields      = ['tabla_afectada', 'usuario__email']
    ordering_fields    = ['created_at']
