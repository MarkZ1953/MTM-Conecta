from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import AuthenticationFailed
from app.mixins.soft_delete_mixin import SoftDeleteMixin
from .serializers import PublicRegisterSerializer, UserSerializer, GroupSerializer
from .paginations import UserPagination, GroupPagination
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from django.conf import settings
from django.contrib.auth.models import Group, User
from app.mixins.export_mixin import ExportMixin
from rest_framework.response import Response
from rest_framework.decorators import action
from .filters import UserFilter, GroupFilter
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.db.models import Case, When
from audits.service import log_event
from rest_framework import filters

from utils.i18n import resolve_lang, t
from . import messages  # noqa: F401 — registers access message catalog on import
from .permissions import (
    CanManageRoles,
    CanViewPermissionCatalog,
    DjangoModelPermissionsWithView,
    get_all_permissions,
    get_user_permissions,
    resolve_permissions,
)

# ---------------------------------------------------------------------------
# Export column definitions
# ---------------------------------------------------------------------------

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
    },
]

ROLES_EXPORT_COLUMNS = [
    {
        "header": "Nombre",
        "accessor": lambda obj: obj.name,
    },
    {
        "header": "Permisos",
        "accessor": lambda obj: obj.permissions.count(),
    },
]


# ---------------------------------------------------------------------------
# Auth views
# ---------------------------------------------------------------------------

def build_auth_user_payload(user, lang="es"):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_active": user.is_active,
        "is_superuser": user.is_superuser,
        "permissions": get_user_permissions(user, lang),
        "groups": list(user.groups.all().values("id", "name")),
    }


def set_auth_cookies(response, refresh_token, access_token):
    response.set_cookie(
        key="refresh_token",
        value=str(refresh_token),
        httponly=True,
        secure=False,
        samesite="Lax",
    )

    response.set_cookie(
        key="access_token",
        value=str(access_token),
        httponly=True,
        secure=False,
        samesite="Lax",
    )


def unique_username_from_email(email):
    base_username = email.split("@", 1)[0].strip().lower() or "usuario"
    base_username = "".join(char for char in base_username if char.isalnum() or char in "._-")
    base_username = base_username[:24] or "usuario"
    username = base_username
    counter = 1

    while User.objects.filter(username=username).exists():
        suffix = f"-{counter}"
        username = f"{base_username[: 30 - len(suffix)]}{suffix}"
        counter += 1

    return username


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)

        except AuthenticationFailed:
            username = request.data.get("username", "desconocido")

            log_event(
                request=request,
                instance=None,
                action="login_failed",
                description=f"Intento de inicio de sesión fallido para '{username}'",
            )

            return Response(
                {"message": t("access.login.invalid_credentials", lang)},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = serializer.user
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        log_event(
            request=request,
            user=user,
            action="login",
            instance=user,
            description=t("access.login.success", "es", username=user.username),
        )

        refresh_token = response.data.get("refresh")
        access_token = response.data.get("access")

        set_auth_cookies(response, refresh_token, access_token)

        response.data["access"] = access_token
        response.data["user"] = build_auth_user_payload(user, lang)
        return response


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"message": t("access.token.refresh_not_found", lang)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)
            user_id = refresh.payload.get("user_id")

            if user_id:
                user = User.objects.get(id=user_id)
                profile_data = build_auth_user_payload(user, lang)
            else:
                profile_data = None

        except (TokenError, User.DoesNotExist):
            return Response(
                {"message": t("access.token.invalid_or_user_not_found", lang)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Proceed with the standard refresh flow
        request.data["refresh"] = refresh_token
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get("access")

            if profile_data:
                response.data["user"] = profile_data

            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,
                samesite="Lax",
                max_age=60 * 15,
            )

        return response


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))
        credential = request.data.get("credential")

        if not settings.GOOGLE_CLIENT_ID:
            return Response(
                {"message": "El inicio con Google no está configurado en el servidor."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if not credential:
            return Response(
                {"message": "No se recibió la credencial de Google."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            id_info = google_id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )
        except ValueError:
            return Response(
                {"message": "La credencial de Google no es válida."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        email = (id_info.get("email") or "").strip().lower()
        email_verified = id_info.get("email_verified")

        if not email or not email_verified:
            return Response(
                {"message": "La cuenta de Google debe tener un correo verificado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        first_name = (id_info.get("given_name") or "").strip()
        last_name = (id_info.get("family_name") or "").strip()
        user = User.objects.filter(email__iexact=email).first()
        created = False

        if user is None:
            user = User(
                username=unique_username_from_email(email),
                email=email,
                first_name=first_name,
                last_name=last_name,
            )
            user.set_unusable_password()
            user.save()
            created = True
        else:
            update_fields = []
            if not user.first_name and first_name:
                user.first_name = first_name
                update_fields.append("first_name")
            if not user.last_name and last_name:
                user.last_name = last_name
                update_fields.append("last_name")
            if not user.is_active:
                user.is_active = True
                update_fields.append("is_active")
            if update_fields:
                user.save(update_fields=update_fields)

        log_event(
            request=request,
            user=user,
            action="login" if not created else "create",
            instance=user,
            description=(
                f"Usuario '{user.username}' ingresó con Google"
                if not created
                else f"Usuario '{user.username}' registrado con Google"
            ),
        )

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        response = Response(
            {
                "message": "Autenticación con Google exitosa.",
                "created": created,
                "access": str(access),
                "user": build_auth_user_payload(user, lang),
            },
            status=status.HTTP_200_OK,
        )
        set_auth_cookies(response, refresh, access)
        return response


# ---------------------------------------------------------------------------
# Logout
# ---------------------------------------------------------------------------


class LogoutViewSet(viewsets.ViewSet):
    permission_classes = []

    def create(self, request):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))

        try:
            log_event(
                request=request,
                user=request.user if request.user.is_authenticated else None,
                action="logout",
                description=t("access.logout.success", "es"),
                instance=request.user if request.user.is_authenticated else None,
            )

            response = Response(
                {"message": t("access.logout.success", lang)},
                status=status.HTTP_200_OK,
            )
            response.delete_cookie("refresh_token")
            response.delete_cookie("access_token")
            return response

        except Exception as e:
            print(e)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = PublicRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        log_event(
            request=request,
            user=user,
            action="create",
            instance=user,
            description=f"Usuario '{user.username}' registrado desde el formulario público",
        )

        return Response(
            {
                "message": "Cuenta creada exitosamente.",
                "user": UserSerializer(user, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED,
        )


# ---------------------------------------------------------------------------
# Permissions listing
# ---------------------------------------------------------------------------


class PermissionListView(APIView):
    """
    GET /api/permissions/

    Returns all available permissions grouped by model, localised according
    to the ``Accept-Language`` request header.

    Supported languages: ``es`` (default), ``en``, ``pt``.
    """

    permission_classes = [CanViewPermissionCatalog]

    def get(self, request):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))
        return Response(get_all_permissions(lang))


# ---------------------------------------------------------------------------
# Roles (Groups)
# ---------------------------------------------------------------------------


class RoleViewSet(ExportMixin, viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    pagination_class = GroupPagination
    permission_classes = [DjangoModelPermissionsWithView]
    export_columns = ROLES_EXPORT_COLUMNS
    export_filename = "roles"
    export_sheet_name = "Roles"

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = GroupFilter
    ordering_fields = ["id", "name"]
    ordering = ["-id"]

    def perform_create(self, serializer):
        raw_permissions = self.request.data.get("permissions", None)
        group = serializer.save()

        if raw_permissions is not None:
            perms = resolve_permissions(raw_permissions)
            group.permissions.set(perms)

    def perform_update(self, serializer):
        """
        Accept permissions as a list of IDs, codenames, or dicts with
        ``id``/``codename`` keys — or any mix thereof.

        Examples of valid payloads
        --------------------------
        By ID only (legacy)::

            {"name": "Analyst", "permissions": [1, 2, 3]}

        By codename::

            {"name": "Analyst", "permissions": ["add_reports", "view_clients"]}

        Mixed / dicts::

            {"name": "Analyst", "permissions": [{"id": 1}, {"codename": "view_reports"}]}
        """
        raw_permissions = self.request.data.get("permissions", None)
        group = serializer.save()

        if raw_permissions is not None:
            perms = resolve_permissions(raw_permissions)
            group.permissions.set(perms)


class RolePermissionUpdateView(APIView):
    """
    POST /api/roles/<role_id>/permissions/

    Body: ``{"permissions": [...]}``  — same flexible format as ``RoleViewSet``.
    """

    permission_classes = [CanManageRoles]

    def post(self, request, role_id):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))
        raw_permissions = request.data.get("permissions", [])

        try:
            group = Group.objects.get(id=role_id)
        except Group.DoesNotExist:
            return Response(
                {"message": t("access.role.not_found", lang)},
                status=status.HTTP_404_NOT_FOUND,
            )

        perms = resolve_permissions(raw_permissions)
        group.permissions.set(perms)

        return Response(
            {
                "ok": True,
                "message": t("access.role.permissions_updated", lang, count=perms.count()),
                "permissions_set": perms.count(),
            }
        )


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------


class UserViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    pagination_class = UserPagination
    permission_classes = [DjangoModelPermissionsWithView]
    export_columns = USERS_EXPORT_COLUMNS
    export_filename = "usuarios"
    export_sheet_name = "Usuarios"

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = UserFilter
    ordering_fields = ["id", "username", "email", "first_name", "last_name"]
    ordering = ["-id"]

    @action(detail=True, methods=["post"], url_path="soft-delete")
    def soft_delete(self, request, pk=None):
        user = self.get_object()

        if not user.is_active:
            return Response(
                {"detail": "El usuario ya ha sido eliminado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = False
        user.save(update_fields=["is_active"])

        return Response(
            {
                "message": "El usuario ha sido eliminado correctamente.",
                "data": self.get_serializer(user).data,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"], url_path="bulk-soft-delete")
    def bulk_soft_delete(self, request):
        ids = request.data.get("ids", [])

        if not ids:
            return Response(
                {"detail": "No se proporcionaron IDs para eliminar."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset = self.get_queryset().filter(id__in=ids, is_active=True)

        if not queryset.exists():
            return Response(
                {"detail": "No se encontraron usuarios para eliminar."},
                status=status.HTTP_404_NOT_FOUND,
            )

        users = list(queryset)
        queryset.update(is_active=False)

        for user in users:
            user.is_active = False

        return Response(
            {
                "message": f"Se han eliminado correctamente {len(users)} usuarios.",
                "data": self.get_serializer(users, many=True).data,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"], url_path="change-password")
    def change_password(self, request, pk=None, *args, **kwargs):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))
        user = self.get_object()
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not new_password or not confirm_password:
            return Response(
                {"message": t("access.password.fields_required", lang)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if current_password is not None:
            if not user.check_password(current_password):
                return Response(
                    {"message": t("access.password.current_incorrect", lang)},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if new_password != confirm_password:
            return Response(
                {"message": t("access.password.mismatch", lang)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if current_password == new_password:
            return Response(
                {"message": t("access.password.same_as_current", lang)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {"message": t("access.password.too_short", lang)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": t("access.password.changed", lang)},
            status=status.HTTP_200_OK,
        )

    def perform_update(self, serializer):
        roles = self.request.data.get("role_ids", None)
        user = serializer.save()

        if roles is not None:
            groups = Group.objects.filter(id__in=roles)
            user.groups.set(groups)
