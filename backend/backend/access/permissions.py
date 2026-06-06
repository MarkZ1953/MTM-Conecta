"""
Permission helpers for the access module.

Key responsibilities
--------------------
1. Build a grouped permission dict from a queryset, localised to a given lang.
2. Resolve a mixed list of permission identifiers (IDs **or** codenames) to a
   Permission queryset — so the front-end can send whichever form is easier.
"""

from collections import defaultdict

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from rest_framework.permissions import BasePermission, DjangoModelPermissions

from .i18n import get_model_label, translate_permission_name


class DjangoModelPermissionsWithView(DjangoModelPermissions):
    """
    DRF's default DjangoModelPermissions does not always require ``view_*`` for
    safe methods. This variant makes read access explicit.
    """

    perms_map = {
        "GET": ["%(app_label)s.view_%(model_name)s"],
        "OPTIONS": [],
        "HEAD": [],
        "POST": ["%(app_label)s.add_%(model_name)s"],
        "PUT": ["%(app_label)s.change_%(model_name)s"],
        "PATCH": ["%(app_label)s.change_%(model_name)s"],
        "DELETE": ["%(app_label)s.delete_%(model_name)s"],
    }


class HasAnyDjangoPermission(BasePermission):
    """
    Allows access when the authenticated user is superuser or owns at least one
    of the permissions declared in ``required_permissions``.
    """

    required_permissions: tuple[str, ...] = ()

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if user.is_superuser:
            return True

        return any(user.has_perm(permission) for permission in self.required_permissions)


class CanViewPermissionCatalog(HasAnyDjangoPermission):
    required_permissions = (
        "auth.view_group",
        "auth.add_group",
        "auth.change_group",
        "auth.view_user",
        "auth.change_user",
    )


class CanManageRoles(HasAnyDjangoPermission):
    required_permissions = (
        "auth.add_group",
        "auth.change_group",
        "auth.delete_group",
    )


class CanViewFinancialReports(HasAnyDjangoPermission):
    required_permissions = (
        "donations.view_donation",
        "donations.view_donor",
    )


class CanViewBeneficiaryReports(HasAnyDjangoPermission):
    required_permissions = (
        "beneficiaries.view_beneficiary",
        "projects.view_project",
    )


class CanViewProjectReports(HasAnyDjangoPermission):
    required_permissions = (
        "projects.view_project",
        "beneficiaries.view_beneficiary",
    )


class CanViewDashboardReports(HasAnyDjangoPermission):
    required_permissions = (
        "beneficiaries.view_beneficiary",
        "donations.view_donation",
        "projects.view_project",
        "campaigns.view_campaign",
        "events.view_event",
        "blog.view_blogpost",
    )

# ---------------------------------------------------------------------------
# Models / apps that must never appear in permission lists
# ---------------------------------------------------------------------------

EXCLUDED_APPS = [
    "admin",
    "contenttypes",
    "sessions",
    "token_blacklist",
]

EXCLUDED_MODELS = [
    "historicalreports",
    "historicalclients",
    "historicalsignatures",
    "historicaltreatments",
    "historicalmanagers",
    "historicalletterheads",
    "historicalwastestates",
    "historicalwastetypes",
    "historicalreporttextparagraphs",
    "historicalreporttexttemplates",
    "historicalwastemanagement",
    "historicalreporttextparagraphswastetypes",
    "logentry",
    "contenttype",
    "session",
    "permission",
    "reporttexttemplates",
    "reportimages",
]


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------


def build_permission_dict(permission_qs, lang: str) -> dict:
    """
    Convert a Permission queryset into a grouped dict ready to be serialised.

    Structure returned::

        {
            "<model_label_in_lang>": [
                {
                    "id": <int>,
                    "codename": "<str>",
                    "name": "<human-readable in lang>"
                },
                ...
            ],
            ...
        }

    Args:
        permission_qs:  Any iterable of :class:`django.contrib.auth.models.Permission`.
        lang:           Two-letter language code (``"es"``, ``"en"``, ``"pt"``).

    Returns:
        Plain ``dict`` (not a ``defaultdict``) suitable for ``Response()``.
    """
    grouped: dict = defaultdict(list)

    for perm in permission_qs:
        model_name = perm.content_type.model
        group_label = get_model_label(model_name, lang)

        grouped[group_label].append(
            {
                "id": perm.id,
                "app_label": perm.content_type.app_label,
                "model": model_name,
                "codename": perm.codename,
                "name": translate_permission_name(perm.codename, lang),
            }
        )

    return dict(grouped)


def get_all_permissions(lang: str) -> dict:
    """Return **all** system permissions (excluding internal ones), grouped and localised."""
    qs = (
        Permission.objects.select_related("content_type")
        .exclude(content_type__app_label__in=EXCLUDED_APPS)
        .exclude(content_type__model__in=EXCLUDED_MODELS)
        .exclude(content_type__model__startswith="historical")
        .distinct()
    )
    return build_permission_dict(qs, lang)


def get_user_permissions(user, lang: str) -> dict:
    """
    Return permissions for *user*, grouped and localised.

    For superusers every system permission is returned.
    For regular users only the permissions directly assigned or inherited via
    groups are returned.
    """
    if user.is_superuser:
        return get_all_permissions(lang)

    excluded_cts = ContentType.objects.filter(
        model__in=EXCLUDED_MODELS,
    ) | ContentType.objects.filter(
        app_label__in=EXCLUDED_APPS,
    ) | ContentType.objects.filter(
        model__startswith="historical",
    )

    qs = (
        (user.user_permissions.all() | Permission.objects.filter(group__user=user))
        .select_related("content_type")
        .exclude(content_type__in=excluded_cts)
        .distinct()
    )

    return build_permission_dict(qs, lang)


def resolve_permissions(identifiers: list) -> "QuerySet[Permission]":
    """
    Resolve a mixed list of permission *identifiers* to a Permission queryset.

    Identifiers can be:
    * **Integers** (or strings that are purely numeric) → treated as primary keys.
    * **Strings** (non-numeric)                        → treated as codenames.
    * **Dicts with ``"id"`` or ``"codename"`` keys**   → both forms extracted.

    This lets the front-end send any combination, e.g.::

        [1, 2, "add_user", {"id": 5}, {"codename": "view_reports"}]

    Args:
        identifiers: List of mixed-type permission references.

    Returns:
        A :class:`~django.db.models.QuerySet` of matching permissions.
    """
    ids: list[int] = []
    codenames: list[str] = []

    for item in identifiers:
        if isinstance(item, dict):
            if "id" in item:
                ids.append(int(item["id"]))
            if "codename" in item:
                codenames.append(str(item["codename"]))
        elif isinstance(item, int) or (isinstance(item, str) and item.isdigit()):
            ids.append(int(item))
        elif isinstance(item, str):
            codenames.append(item)

    from django.db.models import Q

    return Permission.objects.filter(
        Q(id__in=ids) | Q(codename__in=codenames)
    ).distinct()
