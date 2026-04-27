"""
Core i18n engine — shared across all modules.

This is the single source of truth for language resolution and message
translation.  Individual apps register their own messages via
``register_messages()``.

Usage in any view
-----------------
::

    from utils.i18n import resolve_lang, t

    def my_view(request):
        lang = resolve_lang(request.META.get("HTTP_ACCEPT_LANGUAGE"))
        return Response({"detail": t("myapp.some_key", lang)})

Adding messages from any app
-----------------------------
Create a ``messages.py`` (or any module) inside your app and call
``register_messages()`` once at import time::

    # myapp/messages.py
    from utils.i18n import register_messages

    register_messages({
        "myapp.created": {
            "es": "Registro creado correctamente",
            "en": "Record created successfully",
            "pt": "Registro criado com sucesso",
        },
        "myapp.not_found": {
            "es": "Registro no encontrado",
            "en": "Record not found",
            "pt": "Registro não encontrado",
        },
    })

Then import it anywhere in your app so the module is executed (e.g. at
the top of ``views.py`` or in ``apps.py``::ready()``).
"""

from __future__ import annotations

# ---------------------------------------------------------------------------
# Language resolution
# ---------------------------------------------------------------------------

DEFAULT_LANG = "es"
SUPPORTED_LANGS: frozenset[str] = frozenset({"es", "en", "pt"})


def resolve_lang(accept_language: str | None) -> str:
    """
    Parse an ``Accept-Language`` header and return the best supported language.

    Handles standard formats like ``'es'``, ``'en-US,en;q=0.9'``, ``'pt-BR'``.
    Falls back to :data:`DEFAULT_LANG` (``"es"``) when no match is found.

    Args:
        accept_language: Raw value of the ``Accept-Language`` HTTP header,
            or ``None`` / empty string.

    Returns:
        A two-letter language code (``"es"``, ``"en"``, or ``"pt"``).
    """
    if not accept_language:
        return DEFAULT_LANG

    for tag in accept_language.split(","):
        lang_tag = tag.strip().split(";")[0].strip()
        primary = lang_tag.split("-")[0].lower()
        if primary in SUPPORTED_LANGS:
            return primary

    return DEFAULT_LANG


# ---------------------------------------------------------------------------
# Global message catalog
# ---------------------------------------------------------------------------

_CATALOG: dict[str, dict[str, str]] = {}


def register_messages(messages: dict[str, dict[str, str]]) -> None:
    """
    Register a batch of messages into the global catalog.

    Keys must follow the ``"<domain>.<slug>"`` convention to avoid collisions
    between apps (e.g. ``"access.login.invalid_credentials"``).

    If a key already exists it will be **merged** at the language level, so
    partial overrides are safe.

    Args:
        messages: A dict mapping message keys to per-language strings.
            Values may contain ``{placeholder}`` tokens for interpolation.

    Example::

        register_messages({
            "reports.not_found": {
                "es": "Reporte no encontrado",
                "en": "Report not found",
                "pt": "Relatório não encontrado",
            }
        })
    """
    for key, translations in messages.items():
        if key in _CATALOG:
            _CATALOG[key].update(translations)
        else:
            _CATALOG[key] = dict(translations)


def t(key: str, lang: str, **kwargs: object) -> str:
    """
    Translate a message key into the requested language.

    Looks up *key* in the global catalog (populated via
    :func:`register_messages`).  Falls back to :data:`DEFAULT_LANG` when
    *lang* is not available for that key, and to the raw key string when the
    key itself is missing — so nothing ever crashes silently.

    Any ``{placeholder}`` tokens are interpolated with the provided
    keyword arguments.

    Args:
        key:    Message key, e.g. ``"access.password.changed"``.
        lang:   Two-letter language code from :func:`resolve_lang`.
        **kwargs: Values for ``{placeholder}`` interpolation.

    Returns:
        The translated (and interpolated) string.

    Examples::

        t("access.login.invalid_credentials", "en")
        # → "Invalid credentials"

        t("access.login.success", "es", username="admin")
        # → "El usuario admin inició sesión"

        t("reports.permissions_updated", "en", count=5)
        # → "Role permissions updated successfully (5 permissions assigned)"
    """
    entry = _CATALOG.get(key)
    if entry is None:
        return key  # Unknown key → return it as-is

    message = entry.get(lang) or entry.get(DEFAULT_LANG) or key

    if kwargs:
        try:
            message = message.format(**kwargs)
        except KeyError:
            pass  # Missing placeholder → return un-interpolated message

    return message
