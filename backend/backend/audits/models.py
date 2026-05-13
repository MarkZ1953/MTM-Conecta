from django.contrib.auth.models import User
from app.models import BaseModel
from django.db import models


class AuditLog(BaseModel):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )
    action = models.CharField(max_length=64, null=False, blank=False)
    model_name = models.CharField(max_length=64, null=False, blank=True)
    object_id = models.CharField(max_length=64, null=True, blank=True)
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} - {self.model_name} - {self.timestamp}"

    class Meta:
        db_table = 'audits'
        verbose_name = 'AuditLog'
        verbose_name_plural = 'AuditLogs'