from rest_framework import serializers
from app.upload_validators import validate_image_upload, validate_pdf_upload
from .models import Campaign, CampaignTemplate


class CampaignSerializer(serializers.ModelSerializer):
    def validate_image(self, value):
        return validate_image_upload(value, field_name='image')

    def validate_document(self, value):
        return validate_pdf_upload(value, field_name='document')

    class Meta:
        model = Campaign
        fields = [
            'id', 'subject', 'content_type',
            'html_content', 'design_json', 'image', 'document',
            'cta_text', 'cta_url', 'recipient_group',
            'status', 'sent_at', 'sent_count', 'is_active',
        ]
        # El usuario NO controla estos: los maneja el sistema al enviar
        read_only_fields = ['status', 'sent_at', 'sent_count', 'is_active']


class CampaignTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignTemplate
        fields = ['id', 'name', 'design_json', 'html_content', 'is_active']
        read_only_fields = ['is_active']
