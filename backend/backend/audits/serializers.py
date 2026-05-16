from rest_framework import serializers
from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    action_display = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'username', 'action', 'action_display',
            'model_name', 'object_id', 'description',
            'ip_address', 'timestamp',
        ]
        read_only_fields = fields

    def get_username(self, obj):
        return obj.user.username if obj.user else 'system'

    def get_action_display(self, obj):
        return obj.get_action_display()
