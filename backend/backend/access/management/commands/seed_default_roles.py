from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand

from access.permissions import EXCLUDED_APPS, EXCLUDED_MODELS


ROLE_SPECS = {
    "Administrador General": {
        "description": "Acceso total a los módulos administrativos.",
        "permissions": "all",
    },
    "Líder Fundación": {
        "description": "Control operativo completo sin administración técnica de roles.",
        "permissions": [
            ("auth", ["user"], ["add", "change", "view"]),
            ("auth", ["group"], ["view"]),
            ("audits", ["auditlog"], ["view"]),
            ("beneficiaries", ["beneficiary", "guardian", "aidlogentry"], ["add", "change", "delete", "view"]),
            ("blog", ["blogpost"], ["add", "change", "delete", "view"]),
            ("blog", ["blogpost"], ["publish"]),
            ("campaigns", ["campaign", "campaigntemplate"], ["add", "change", "delete", "view"]),
            ("campaigns", ["campaign"], ["send"]),
            ("cap_collection", ["company", "collectionpoint", "collectionrequest"], ["add", "change", "delete", "view"]),
            ("donations", ["donor", "donation"], ["add", "change", "delete", "view"]),
            ("events", ["event", "attendance", "eventact", "evidence"], ["add", "change", "delete", "view"]),
            ("news", ["instagrampost"], ["add", "change", "delete", "view"]),
            ("projects", ["project"], ["add", "change", "delete", "view"]),
            ("subscribers", ["newslettersubscriber"], ["add", "change", "delete", "view"]),
            ("volunteers", ["volunteer", "volunteeravailability", "volunteertask"], ["add", "change", "delete", "view"]),
        ],
    },
    "Finanzas": {
        "description": "Gestión económica: donantes, donaciones y reportes financieros.",
        "permissions": [
            ("donations", ["donor", "donation"], ["add", "change", "delete", "view"]),
        ],
    },
    "Gestión Informativa": {
        "description": "Campañas, blog, eventos públicos, suscriptores y comunicación institucional.",
        "permissions": [
            ("blog", ["blogpost"], ["add", "change", "delete", "view"]),
            ("blog", ["blogpost"], ["publish"]),
            ("campaigns", ["campaign", "campaigntemplate"], ["add", "change", "delete", "view"]),
            ("campaigns", ["campaign"], ["send"]),
            ("cap_collection", ["company", "collectionpoint", "collectionrequest"], ["view"]),
            ("events", ["event", "eventact", "evidence"], ["add", "change", "delete", "view"]),
            ("events", ["attendance"], ["view"]),
            ("news", ["instagrampost"], ["add", "change", "delete", "view"]),
            ("subscribers", ["newslettersubscriber"], ["change", "view"]),
            ("volunteers", ["volunteer"], ["view"]),
        ],
    },
    "Diseñador": {
        "description": "Diseño de piezas, plantillas, borradores y material visual sin envío.",
        "permissions": [
            ("blog", ["blogpost"], ["add", "change", "view"]),
            ("campaigns", ["campaign", "campaigntemplate"], ["add", "change", "view"]),
            ("events", ["event"], ["view"]),
            ("events", ["evidence"], ["add", "change", "view"]),
            ("news", ["instagrampost"], ["change", "view"]),
        ],
    },
}


def _managed_permissions():
    return (
        Permission.objects.select_related("content_type")
        .exclude(content_type__app_label__in=EXCLUDED_APPS)
        .exclude(content_type__model__in=EXCLUDED_MODELS)
        .exclude(content_type__model__startswith="historical")
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
