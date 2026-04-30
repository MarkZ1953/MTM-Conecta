from django.utils import timezone
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import Group

from .models import Usuario, Auditoria
from .serializers import (
    MtmTokenObtainPairSerializer,
    UsuarioListSerializer, UsuarioDetailSerializer, UsuarioCreateSerializer,
    CambiarPasswordSerializer, GroupSerializer, AuditoriaSerializer,
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


class GroupViewSet(viewsets.ModelViewSet):
    queryset           = Group.objects.all()
    serializer_class   = GroupSerializer
    permission_classes = [permissions.IsAdminUser]
    search_fields      = ['name']


class AuditoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """Solo lectura — el log de auditoría no se edita."""
    queryset           = Auditoria.objects.select_related('usuario').all()
    serializer_class   = AuditoriaSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields   = ['accion', 'tabla_afectada', 'usuario']
    search_fields      = ['tabla_afectada', 'usuario__email']
    ordering_fields    = ['created_at']


# ── Dashboard Metrics ─────────────────────────────────────
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.beneficiarios.models import Beneficiario
from apps.donantes.models import Donacion, Donante
from apps.proyectos.models import Proyecto
from apps.voluntarios.models import Voluntario

class DashboardMetricsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_beneficiarios = Beneficiario.objects.count()
        total_donaciones = Donacion.objects.count()
        proyectos_activos = Proyecto.objects.filter(estado='activo').count()
        donantes_registrados = Donante.objects.count()
        total_voluntarios = Voluntario.objects.exclude(estado='rechazado').count()

        # Donaciones por mes
        donaciones_mes_qs = (
            Donacion.objects.filter(monto__isnull=False)
            .annotate(month=TruncMonth('fecha_donacion'))
            .values('month')
            .annotate(total=Sum('monto'))
            .order_by('month')
        )
        
        meses = {1:'Ene',2:'Feb',3:'Mar',4:'Abr',5:'May',6:'Jun',7:'Jul',8:'Ago',9:'Sep',10:'Oct',11:'Nov',12:'Dic'}
        donaciones_mes = []
        for d in donaciones_mes_qs:
            if d['month']:
                mes_str = meses.get(d['month'].month, str(d['month'].month))
                donaciones_mes.append({'mes': mes_str, 'monto': float(d['total'] or 0)})

        # Donaciones por tipo
        colores = ['#3B82F6', '#06B6D4', '#10B981', '#F97316', '#8B5CF6', '#EC4899']
        tipos_qs = (
            Donacion.objects.values('tipo_donacion')
            .annotate(cantidad=Count('id'))
            .order_by('-cantidad')
        )
        
        donaciones_por_tipo = []
        for idx, t in enumerate(tipos_qs):
            donaciones_por_tipo.append({
                'name': str(t['tipo_donacion']).capitalize(),
                'cantidad': t['cantidad'],
                'color': colores[idx % len(colores)]
            })

        return Response({
            'totalBeneficiarios': total_beneficiarios,
            'totalDonaciones': total_donaciones,
            'proyectosActivos': proyectos_activos,
            'donantesRegistrados': donantes_registrados,
            'totalVoluntarios': total_voluntarios,
            'donacionesMes': donaciones_mes,
            'donacionesPorTipo': donaciones_por_tipo
        })
