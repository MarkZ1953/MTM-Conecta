from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer, GroupSerializer
from .paginations import UserPagination, GroupPagination
from utils.exporters import export_xlsx, export_csv
from django.contrib.auth.models import Group, User
from rest_framework.response import Response
from rest_framework.decorators import action
from .filters import UserFilter, GroupFilter
from rest_framework import viewsets, status
from rest_framework.views import APIView
from django.db.models import Case, When
from audits.service import log_event
from rest_framework import filters

from utils.i18n import resolve_lang, t
from . import messages  # noqa: F401 — registers access message catalog on import
from .permissions import (
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


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))
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
                    description=t("access.login.success", "es", username=username),
                )
            except Exception as log_error:
                print("Error guardando auditoría:", log_error)

            return Response(
                {"detail": t("access.login.invalid_credentials", lang)},
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

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite="Lax",
        )

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="Lax",
        )

        response.data["access"] = access_token
        return response


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": t("access.token.refresh_not_found", lang)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)
            user_id = refresh.payload.get("user_id")

            if user_id:
                user = User.objects.get(id=user_id)

                profile_data = {
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
            else:
                profile_data = None

        except (TokenError, User.DoesNotExist):
            return Response(
                {"detail": t("access.token.invalid_or_user_not_found", lang)},
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
                user=request.user,
                action="logout",
                description=t("access.logout.success", "es"),
                instance=request.user,
            )

            response = Response(
                {"detail": t("access.logout.success", lang)},
                status=status.HTTP_200_OK,
            )
            response.delete_cookie("refresh_token")
            response.delete_cookie("access_token")
            return response

        except Exception as e:
            print(e)


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

    permission_classes = []
    authentication_classes = []

    def get(self, request):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))
        return Response(get_all_permissions(lang))


# ---------------------------------------------------------------------------
# Roles (Groups)
# ---------------------------------------------------------------------------


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    pagination_class = GroupPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = GroupFilter
    ordering_fields = ["id", "name"]
    ordering = ["-id"]

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

    @action(detail=False, methods=["post"], url_path="export")
    def export_roles(self, request):
        body = request.data
        mode = body.get("mode", "selected")
        fmt = body.get("format", "xlsx")
        ids = body.get("ids", [])

        qs = Group.objects.all()

        if mode == "selected" and ids:
            qs = qs.filter(id__in=ids)
            preserved = Case(*[When(id=pk, then=pos) for pos, pk in enumerate(ids)])
            qs = qs.order_by(preserved)

        if fmt == "csv":
            return export_csv(qs, ROLES_EXPORT_COLUMNS, filename="roles.csv")

        return export_xlsx(
            qs, ROLES_EXPORT_COLUMNS, filename="roles.xlsx", sheet_name="Roles"
        )


class RolePermissionUpdateView(APIView):
    """
    POST /api/roles/<role_id>/permissions/

    Body: ``{"permissions": [...]}``  — same flexible format as ``RoleViewSet``.
    """

    permission_classes = []
    authentication_classes = []

    def post(self, request, role_id):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))
        raw_permissions = request.data.get("permissions", [])

        try:
            group = Group.objects.get(id=role_id)
        except Group.DoesNotExist:
            return Response(
                {"detail": t("access.role.not_found", lang)},
                status=status.HTTP_404_NOT_FOUND,
            )

        perms = resolve_permissions(raw_permissions)
        group.permissions.set(perms)

        return Response(
            {
                "ok": True,
                "detail": t("access.role.permissions_updated", lang, count=perms.count()),
                "permissions_set": perms.count(),
            }
        )


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    pagination_class = UserPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = UserFilter
    ordering_fields = ["id", "username", "email", "first_name", "last_name"]
    ordering = ["-id"]

    @action(detail=True, methods=["post"], url_path="change-password")
    def change_password(self, request, pk=None, *args, **kwargs):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))
        user = self.get_object()
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not new_password or not confirm_password:
            return Response(
                {"detail": t("access.password.fields_required", lang)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if current_password is not None:
            if not user.check_password(current_password):
                return Response(
                    {"detail": t("access.password.current_incorrect", lang)},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if new_password != confirm_password:
            return Response(
                {"detail": t("access.password.mismatch", lang)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if current_password == new_password:
            return Response(
                {"detail": t("access.password.same_as_current", lang)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {"detail": t("access.password.too_short", lang)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": t("access.password.changed", lang)},
            status=status.HTTP_200_OK,
        )

    def perform_update(self, serializer):
        roles = self.request.data.get("role_ids", None)
        user = serializer.save()

        if roles is not None:
            groups = Group.objects.filter(id__in=roles)
            user.groups.set(groups)

    @action(detail=True, methods=["post"], url_path="soft-delete")
    def soft_delete(self, request, pk=None, *args, **kwargs):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))
        user = self.get_object()
        user.is_active = False
        user.save()

        return Response(
            {"detail": t("access.user.soft_deleted", lang)},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"], url_path="export")
    def export_users(self, request):
        body = request.data
        mode = body.get("mode", "selected")
        fmt = body.get("format", "xlsx")
        ids = body.get("ids", [])

        qs = User.objects.filter(is_active=True)

        if mode == "selected" and ids:
            qs = qs.filter(id__in=ids)
            preserved = Case(*[When(id=pk, then=pos) for pos, pk in enumerate(ids)])
            qs = qs.order_by(preserved)

        if fmt == "csv":
            return export_csv(qs, USERS_EXPORT_COLUMNS, filename="usuarios.csv")

        return export_xlsx(
            qs,
            USERS_EXPORT_COLUMNS,
            filename="usuarios.xlsx",
            sheet_name="Usuarios",
        )