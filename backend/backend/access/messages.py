"""
Message catalog for the ``access`` app.

To add a new message: add an entry to the dict below following the
``"access.<domain>.<slug>"`` naming convention.

This module is imported by ``views.py`` so it is executed automatically
when Django loads the app — no extra wiring needed.
"""

from utils.i18n import register_messages

register_messages(
    {
        # ── Auth ─────────────────────────────────────────────────────────────
        "access.login.invalid_credentials": {
            "es": "Credenciales inválidas",
            "en": "Invalid credentials",
            "pt": "Credenciais inválidas",
        },
        "access.login.success": {
            "es": "El usuario {username} inició sesión",
            "en": "User {username} logged in",
            "pt": "Usuário {username} fez login",
        },
        "access.logout.success": {
            "es": "Sesión cerrada correctamente",
            "en": "Logged out successfully",
            "pt": "Sessão encerrada com sucesso",
        },
        # ── Token refresh ─────────────────────────────────────────────────────
        "access.token.refresh_not_found": {
            "es": "Token de actualización no encontrado en las cookies",
            "en": "Refresh token not found in cookies",
            "pt": "Token de atualização não encontrado nos cookies",
        },
        "access.token.invalid_or_user_not_found": {
            "es": "Token inválido o usuario no encontrado",
            "en": "Invalid token or user not found",
            "pt": "Token inválido ou usuário não encontrado",
        },
        # ── Roles / Groups ────────────────────────────────────────────────────
        "access.role.not_found": {
            "es": "El rol no fue encontrado",
            "en": "Role not found",
            "pt": "Função não encontrada",
        },
        "access.role.permissions_updated": {
            "es": "Permisos del rol actualizados correctamente ({count} permisos asignados)",
            "en": "Role permissions updated successfully ({count} permissions assigned)",
            "pt": "Permissões do papel atualizadas com sucesso ({count} permissões atribuídas)",
        },
        # ── Users ─────────────────────────────────────────────────────────────
        "access.user.soft_deleted": {
            "es": "Usuario desactivado correctamente",
            "en": "User deactivated successfully",
            "pt": "Usuário desativado com sucesso",
        },
        # ── Change password ───────────────────────────────────────────────────
        "access.password.fields_required": {
            "es": "La contraseña nueva y su confirmación son obligatorias",
            "en": "New password and confirmation are required",
            "pt": "A nova senha e sua confirmação são obrigatórias",
        },
        "access.password.current_incorrect": {
            "es": "La contraseña actual es incorrecta",
            "en": "Current password is incorrect",
            "pt": "A senha atual está incorreta",
        },
        "access.password.mismatch": {
            "es": "Las contraseñas nuevas no coinciden",
            "en": "New passwords do not match",
            "pt": "As novas senhas não coincidem",
        },
        "access.password.same_as_current": {
            "es": "La nueva contraseña debe ser diferente a la actual",
            "en": "New password must be different from the current one",
            "pt": "A nova senha deve ser diferente da atual",
        },
        "access.password.too_short": {
            "es": "La nueva contraseña debe tener al menos 8 caracteres",
            "en": "New password must be at least 8 characters long",
            "pt": "A nova senha deve ter pelo menos 8 caracteres",
        },
        "access.password.changed": {
            "es": "Contraseña actualizada correctamente",
            "en": "Password changed successfully",
            "pt": "Senha alterada com sucesso",
        },
    }
)
