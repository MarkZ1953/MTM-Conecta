from rest_framework import serializers
from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'action', 'model_name',
            'object_id', 'description', 'ip_address',
            'timestamp', 'is_active'
        ]
        read_only_fields = ['timestamp']