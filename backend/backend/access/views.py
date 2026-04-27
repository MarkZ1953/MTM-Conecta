from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.contenttypes.models import ContentType
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer, GroupSerializer
from .paginations import UserPagination, GroupPagination
from utils.exporters import export_xlsx, export_csv
from django.contrib.auth.models import Group, User
from django.contrib.auth.models import Permission
from rest_framework.response import Response
from rest_framework.decorators import action
from .filters import UserFilter, GroupFilter
from rest_framework import viewsets, status
from rest_framework.views import APIView
from django.db.models import Case, When
from audits.service import log_event
from collections import defaultdict
from rest_framework import filters


EXCLUDED_APPS = [
    'admin',
    'contenttypes',
    'sessions',
]

EXCLUDED_MODELS = [
    'historicalreports',
    'historicalclients',
    'historicalsignatures',
    'historicaltreatments',
    'historicalmanagers',
    'historicalletterheads',
    'historicalwastestates',
    'historicalwastetypes',
    'historicalreporttextparagraphs',
    'historicalreporttexttemplates',
    'historicalwastemanagement',
    'historicalreporttextparagraphswastetypes',
    'logentry',
    'contenttype',
    'session',
    'permission',
    'reporttexttemplates',
    'reportimages',
]

ACTION_TRANSLATIONS = {
    "add": "Agregar",
    "change": "Editar",
    "delete": "Eliminar",
    "view": "Ver",
}

MODEL_TRANSLATIONS = {
    "user": "usuarios",
    "group": "roles",
    "audits": "auditorías",
    "clients": "clientes",
    "reports": "reportes",
    "signatures": "firmas",
    "treatment": "tratamientos",
    "wastemanagement": "gestión de residuos",
    "wastestates": "estados de residuos",
    "wastetypes": "tipos de residuos",
    "clientemails": "correos de clientes",
    "letterheads": "membretes",
    "managers": "gestores",
    "treatments": "tratamientos",
    "reporttextparagraphs": "Parrafos de texto",
    'reporttextparagraphswastetypes': "Párrafos por tipos de residuos",
}

USERS_EXPORT_COLUMNS = [
    {
        "header": "Usuario",
        "accessor": lambda obj: obj.username,
    },
    {
        "header": "Nombres",
        "accessor": lambda obj: obj.first_name,
    },
    {
        "header": "Apellidos",
        "accessor": lambda obj: obj.last_name,
    },
    {
        "header": "Correo Electrónico",
        "accessor": lambda obj: obj.email,
    }
]

ROLES_EXPORT_COLUMNS = [
    {
        "header": "Nombre",
        "accessor": lambda obj: obj.name,
    },
    {
        "header": "Permisos",
        "accessor": lambda obj: len(obj.permissions.all()),
    }
]


def translate_permission_name(codename: str) -> str:
    """
    add_user -> Agregar usuario
    change_group -> Editar grupo
    """
    parts = codename.split("_", 1)

    if len(parts) != 2:
        return codename

    action, model = parts

    action_es = ACTION_TRANSLATIONS.get(action, action.capitalize())
    model_es = MODEL_TRANSLATIONS.get(model, model.replace("_", " "))

    return f"{action_es} {model_es}"


def translate_model_name(model_name: str) -> str:
    return MODEL_TRANSLATIONS.get(model_name, model_name.replace("_", " ").capitalize())


from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from audits.service import log_event


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)

        except AuthenticationFailed:
            username = request.data.get("username", "desconocido")

            try:
                log_event(
                    request=request,
                    instance=None,
                    action="login_failed",
                    description=f"Intento fallido de login para {username}"
                )
            except Exception as log_error:
                print("Error guardando auditoría:", log_error)

            return Response(
                {"detail": "Credenciales inválidas"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = serializer.user
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        log_event(
            request=request,
            user=user,
            action="login",
            instance=user,
            description=f"El usuario {user.username} inició sesión"
        )

        refresh_token = response.data.get('refresh')
        access_token = response.data.get('access')

        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite='Lax',
        )

        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=False,
            samesite='Lax',
        )

        response.data['access'] = access_token

        return response
    
    
class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response(
                {'detail': 'Refresh token not found in cookies.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            refresh = RefreshToken(refresh_token)
            user_id = refresh.payload.get('user_id')

            if user_id:
                user = User.objects.get(id=user_id)

                # Obtener grupos del usuario
                groups = user.groups.all().values('id', 'name')

                # --- CORRECCIÓN: Manejar superusuario ---
                if user.is_superuser:
                    # Superusuario: obtener TODOS los permisos del sistema
                    all_perms = Permission.objects.exclude(
                        content_type__model__in=EXCLUDED_MODELS
                    ).distinct()

                    # Agrupar por app
                    grouped = defaultdict(list)

                    for perm in all_perms:
                        app = perm.content_type.app_label
                        codename = perm.codename
                        name = perm.name

                        grouped[app].append({
                            "id": perm.id,
                            "name": name,
                            "codename": codename,
                        })
                else:
                    # Usuario normal: obtener solo sus permisos asignados
                    user_permissions_qs = user.user_permissions.all(
                    ) | Permission.objects.filter(group__user=user)

                    # Excluir modelos no deseados
                    excluded_content_types = ContentType.objects.filter(
                        model__in=EXCLUDED_MODELS)
                    user_permissions_qs = user_permissions_qs.exclude(
                        content_type__in=excluded_content_types)

                    # Agrupar por app
                    grouped = defaultdict(list)

                    for perm in user_permissions_qs.distinct():
                        app = perm.content_type.app_label
                        codename = perm.codename
                        name = perm.name

                        grouped[app].append({
                            "id": perm.id,
                            "name": name,
                            "codename": codename,
                        })

                profile_data = {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "is_active": user.is_active,
                    "is_superuser": user.is_superuser,
                    # ← CORREGIDO: grouped, no result
                    "permissions": dict(grouped),
                    "groups": list(groups),
                }
            else:
                profile_data = None

        except (TokenError, User.DoesNotExist) as e:
            return Response(
                {'detail': 'Invalid refresh token or user not found.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Proceder con el refresh normal
        request.data['refresh'] = refresh_token
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')

            # Agregar datos del usuario a la respuesta
            if profile_data:
                response.data['user'] = profile_data

            # Configurar la cookie del access token
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=60 * 15,
            )

        return response


class LogoutViewSet(viewsets.ViewSet):
    permission_classes = []

    def create(self, request):
        try: 
            log_event(
                request=request,
                user=request.user,
                action="logout",
                description=f"El usuario {request.user.username} cerró sesión",
                instance=request.user
            )

            response = Response(
                {"message": "Logged out successfully"}, status=status.HTTP_200_OK)
            
            response.delete_cookie('refresh_token')
            response.delete_cookie('access_token')

            return response
        except Exception as e:
            print(e)


class PermissionListView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        perms = Permission.objects.exclude(
            content_type__model__in=EXCLUDED_MODELS,
        )

        grouped = defaultdict(list)

        for p in perms:
            app = translate_model_name(p.content_type.model)
            codename = p.codename
            name = translate_permission_name(codename)

            grouped[app].append({
                "id": p.id,
                "name": name,
                "codename": codename,
            })

        return Response(grouped)


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    serializer_class = GroupSerializer
    pagination_class = GroupPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = GroupFilter
    ordering_fields = ['id', 'name']
    ordering = ['-id']

    def perform_update(self, serializer):
        permissions = self.request.data.get('permissions', None)

        group = serializer.save()

        if permissions is not None:
            perms = Permission.objects.filter(id__in=permissions)
            group.permissions.set(perms)

    @action(detail=False, methods=["post"], url_path="export")
    def export_users(self, request):
        body = request.data

        mode = body.get("mode", "selected")
        format = body.get("format", "xlsx")
        ids = body.get("ids", [])

        qs = Group.objects.all()

        if mode == "selected" and ids:
            qs = qs.filter(id__in=ids)

            preserved = Case(
                *[When(id=pk, then=pos) for pos, pk in enumerate(ids)]
            )
            qs = qs.order_by(preserved)

        if format == "csv":
            return export_csv(
                qs,
                ROLES_EXPORT_COLUMNS,
                filename="roles.csv",
            )

        return export_xlsx(
            qs,
            ROLES_EXPORT_COLUMNS,
            filename="roles.xlsx",
            sheet_name="Roles",
        )


class RolePermissionUpdateView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, role_id):
        perms_ids = request.data["permissions"]

        group = Group.objects.get(id=role_id)
        permissions = Permission.objects.filter(id__in=perms_ids)

        group.permissions.set(permissions)
        return Response({"ok": True})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer

    serializer_class = UserSerializer
    pagination_class = UserPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = UserFilter
    ordering_fields = ['id', 'username', 'email', 'first_name', 'last_name']
    ordering = ['-id']

    @action(detail=True, methods=['post'], url_path='change-password')
    def change_password(self, request, pk=None, *args, **kwargs):
        user = self.get_object()
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not new_password or not confirm_password:
            return Response(
                {"detail": "Current password, new password, and confirm password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if current_password is not None:
            if not user.check_password(current_password):
                return Response(
                    {"detail": "Current password is incorrect."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if new_password != confirm_password:
            return Response(
                {"detail": "New passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if current_password == new_password:
            return Response(
                {"detail": "New password must be different from current password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {"detail": "New password must be at least 8 characters long."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "Password changed successfully."},
            status=status.HTTP_200_OK
        )

    def perform_update(self, serializer):
        roles = self.request.data.get('role_ids', None)
        user = serializer.save()

        if roles is not None:
            groups = Group.objects.filter(id__in=roles)
            user.groups.set(groups)

    @action(detail=True, methods=['post'], url_path='soft-delete')
    def soft_delete(self, request, pk=None, *args, **kwargs):
        user = self.get_object()
        user.is_active = False
        user.save()

        return Response(
            {"detail": "User soft-deleted successfully."},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["post"], url_path="export")
    def export_users(self, request):
        body = request.data

        mode = body.get("mode", "selected")
        format = body.get("format", "xlsx")
        ids = body.get("ids", [])

        qs = User.objects.all().filter(is_active=True)

        if mode == "selected" and ids:
            qs = qs.filter(id__in=ids)

            preserved = Case(
                *[When(id=pk, then=pos) for pos, pk in enumerate(ids)]
            )
            qs = qs.order_by(preserved)

        if format == "csv":
            return export_csv(
                qs,
                USERS_EXPORT_COLUMNS,
                filename="usuarios.csv",
            )

        return export_xlsx(
            qs,
            USERS_EXPORT_COLUMNS,
            filename="usuarios.xlsx",
            sheet_name="Usuarios",
        )