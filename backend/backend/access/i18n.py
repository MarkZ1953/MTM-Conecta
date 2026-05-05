"""
Permission-specific i18n helpers for the ``access`` app.

This module handles the translation of Django permission codenames
(``add_user``, ``change_reports``, …) into human-readable labels.

For general message translation (API responses), use :mod:`utils.i18n` directly::

    from utils.i18n import resolve_lang, t
"""

# Re-export the shared engine so existing imports keep working
from utils.i18n import DEFAULT_LANG, resolve_lang, t  # noqa: F401

# ---------------------------------------------------------------------------
# Action translations  (add / change / delete / view)
# ---------------------------------------------------------------------------

ACTION_TRANSLATIONS: dict[str, dict[str, str]] = {
    "es": {
        "add": "Agregar",
        "change": "Editar",
        "delete": "Eliminar",
        "view": "Ver",
    },
    "en": {
        "add": "Add",
        "change": "Edit",
        "delete": "Delete",
        "view": "View",
    },
    "pt": {
        "add": "Adicionar",
        "change": "Editar",
        "delete": "Excluir",
        "view": "Visualizar",
    },
}

# ---------------------------------------------------------------------------
# Model translations  (Django internal model name → human-readable label)
# ---------------------------------------------------------------------------

MODEL_TRANSLATIONS: dict[str, dict[str, str]] = {
    "es": {
        "user": "Usuarios",
        "group": "Roles",
        "audits": "Auditorías",
        "clients": "Clientes",
        "reports": "Reportes",
        "signatures": "Firmas",
        "treatment": "Tratamientos",
        "wastemanagement": "Gestión de residuos",
        "wastestates": "Estados de residuos",
        "wastetypes": "Tipos de residuos",
        "clientemails": "Correos de clientes",
        "letterheads": "Membretes",
        "managers": "Gestores",
        "treatments": "Tratamientos",
        "reporttextparagraphs": "Párrafos de texto",
        "reporttextparagraphswastetypes": "Párrafos por tipos de residuos",
    },
    "en": {
        "user": "Users",
        "group": "Roles",
        "audits": "Audits",
        "clients": "Clients",
        "reports": "Reports",
        "signatures": "Signatures",
        "treatment": "Treatments",
        "wastemanagement": "Waste Management",
        "wastestates": "Waste States",
        "wastetypes": "Waste Types",
        "clientemails": "Client Emails",
        "letterheads": "Letterheads",
        "managers": "Managers",
        "treatments": "Treatments",
        "reporttextparagraphs": "Text Paragraphs",
        "reporttextparagraphswastetypes": "Paragraphs by Waste Type",
    },
    "pt": {
        "user": "Usuários",
        "group": "Funções",
        "audits": "Auditorias",
        "clients": "Clientes",
        "reports": "Relatórios",
        "signatures": "Assinaturas",
        "treatment": "Tratamentos",
        "wastemanagement": "Gestão de resíduos",
        "wastestates": "Estados de resíduos",
        "wastetypes": "Tipos de resíduos",
        "clientemails": "E-mails de clientes",
        "letterheads": "Timbres",
        "managers": "Gestores",
        "treatments": "Tratamentos",
        "reporttextparagraphs": "Parágrafos de texto",
        "reporttextparagraphswastetypes": "Parágrafos por tipo de resíduo",
    },
}


# ---------------------------------------------------------------------------
# Permission label helpers
# ---------------------------------------------------------------------------


def get_action_label(action: str, lang: str) -> str:
    """Return the human-readable label for a Django permission action in *lang*."""
    translations = ACTION_TRANSLATIONS.get(lang, ACTION_TRANSLATIONS[DEFAULT_LANG])
    return translations.get(action, action.capitalize())


def get_model_label(model_name: str, lang: str) -> str:
    """Return the human-readable label for a Django model name in *lang*."""
    translations = MODEL_TRANSLATIONS.get(lang, MODEL_TRANSLATIONS[DEFAULT_LANG])
    return translations.get(model_name, model_name.replace("_", " ").capitalize())


def translate_permission_name(codename: str, lang: str) -> str:
    """
    Convert a Django permission codename into a human-readable string.

    Examples::

        translate_permission_name("add_user", "es")  → "Agregar Usuarios"
        translate_permission_name("add_user", "en")  → "Add Users"
        translate_permission_name("delete_reports", "pt")  → "Excluir Relatórios"
    """
    parts = codename.split("_", 1)
    if len(parts) != 2:
        return codename

    action, model = parts
    return f"{get_action_label(action, lang)} {get_model_label(model, lang)}"
