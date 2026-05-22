from rest_framework import serializers
from .models import Campaign


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = [
            'id', 'subject', 'content_type',
            'html_content', 'image', 'document',
            'cta_text', 'cta_url', 'recipient_group',
            'status', 'sent_at', 'sent_count', 'is_active',
        ]
        # El usuario NO controla estos: los maneja el sistema al enviar
        read_only_fields = ['status', 'sent_at', 'sent_count']