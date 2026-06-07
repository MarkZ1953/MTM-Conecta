from rest_framework import serializers

from .models import InstagramPost


class InstagramPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramPost
        fields = [
            'id', 'instagram_id', 'caption', 'media_type',
            'media_url', 'thumbnail_url', 'permalink', 'timestamp',
            'children', 'is_visible', 'is_featured',
            'created_at', 'updated_at', 'is_active',
        ]
        read_only_fields = [
            'instagram_id', 'media_type', 'media_url', 'thumbnail_url',
            'permalink', 'timestamp', 'children',
            'created_at', 'updated_at', 'is_active',
        ]


class PublicInstagramPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramPost
        fields = [
            'id', 'instagram_id', 'caption', 'media_type',
            'media_url', 'thumbnail_url', 'permalink', 'timestamp',
            'children', 'is_featured',
        ]

