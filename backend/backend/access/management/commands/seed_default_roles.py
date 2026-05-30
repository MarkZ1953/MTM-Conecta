from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand

from access.permissions import EXCLUDED_APPS, EXCLUDED_MODELS


ROLE_SPECS = {
    "Administrador General": {
        "description": "Acceso total a los módulos administrativos.",
        "permissions": "all",
    },
    "Finanzas": {
        "description": "Gestión económica, donantes, donaciones y lectura de indicadores.",
        "permissions": [
            ("donations", ["donor", "donation"], ["add", "change", "delete", "view"]),
            ("beneficiaries", ["beneficiary", "guardian"], ["view"]),
            ("projects", ["project"], ["view"]),
            ("events", ["event", "attendance", "eventact", "evidence"], ["view"]),
            ("audits", ["auditlog"], ["view"]),
        ],
    },
    "Gestión Informativa": {
        "description": "Campañas, correos, eventos, contenido institucional y destinatarios.",
        "permissions": [
            ("campaigns", ["campaign", "campaigntemplate"], ["add", "change", "delete", "view"]),
            ("events", ["event", "eventact", "evidence"], ["add", "change", "delete", "view"]),
            ("events", ["attendance"], ["view"]),
            ("beneficiaries", ["guardian"], ["view"]),
            ("donations", ["donor"], ["view"]),
            ("cap_collection", ["company", "collectionpoint", "collectionrequest"], ["view"]),
        ],
    },
    "Diseñador": {
        "description": "Material visual, piezas de campañas y evidencias gráficas.",
        "permissions": [
            ("campaigns", ["campaign", "campaigntemplate"], ["add", "change", "view"]),
            ("events", ["evidence"], ["add", "change", "view"]),
            ("events", ["event"], ["view"]),
        ],
    },
}


def _managed_permissions():
    return (
        Permission.objects.select_related("content_type")
        .exclude(content_type__app_label__in=EXCLUDED_APPS)
        .exclude(content_type__model__in=EXCLUDED_MODELS)
        .distinct()
    )


def _permissions_from_spec(spec):
    if spec == "all":
        return _managed_permissions()

    query = Permission.objects.none()

    for app_label, model_names, actions in spec:
        codenames = [
            f"{action}_{model_name}"
            for model_name in model_names
            for action in actions
        ]
        query = query | Permission.objects.filter(
            content_type__app_label=app_label,
            content_type__model__in=model_names,
            codename__in=codenames,
        )

    return query.distinct()


class Command(BaseCommand):
    help = "Crea o actualiza los roles base requeridos por la Fundación MTM."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Muestra lo que se haría sin escribir en la base de datos.",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]

        for role_name, role_config in ROLE_SPECS.items():
            permissions = _permissions_from_spec(role_config["permissions"])
            permission_count = permissions.count()

            if dry_run:
                self.stdout.write(
                    f"[dry-run] {role_name}: {permission_count} permisos"
                )
                continue

            group, created = Group.objects.get_or_create(name=role_name)
            group.permissions.set(permissions)

            status = "creado" if created else "actualizado"
            self.stdout.write(
                self.style.SUCCESS(
                    f"Rol {role_name} {status} con {permission_count} permisos."
                )
            )
