from django.contrib.auth.models import User
from django.db import models


class AuditAction(models.TextChoices):
    LOGIN = 'login', 'Inicio de sesión'
    LOGIN_FAILED = 'login_failed', 'Inicio de sesión fallido'
    LOGOUT = 'logout', 'Cierre de sesión'
    CREATE = 'create', 'Creación'
    UPDATE = 'update', 'Actualización'
    DELETE = 'delete', 'Eliminación'
    SOFT_DELETE = 'soft_delete', 'Eliminación lógica'
    RESTORE = 'restore', 'Restauración'
    EXPORT = 'export', 'Exportación'


class AuditLog(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs',
    )

    action = models.CharField(
        max_length=64,
        choices=AuditAction.choices,
        null=False,
        blank=False,
        db_index=True,
    )

    model_name = models.CharField(
        max_length=64,
        blank=True,
        default='',
    )

    object_id = models.CharField(
        max_length=64,
        null=True,
        blank=True,
    )

    description = models.TextField(
        blank=True,
        default='',
    )

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
    )

    timestamp = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )

    def __str__(self):
        username = self.user.username if self.user else 'system'
        return f"{username} - {self.action} - {self.timestamp}"

    class Meta:
        db_table = 'audit_logs'
        verbose_name = 'Audit Log'
        verbose_name_plural = 'Audit Logs'
        ordering = ['-timestamp']
