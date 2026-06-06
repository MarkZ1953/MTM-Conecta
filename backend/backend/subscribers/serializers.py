from django.utils import timezone
from rest_framework import serializers

from .models import NewsletterSubscriber


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = [
            'id', 'email', 'name', 'status', 'origin', 'consent',
            'subscribed_at', 'unsubscribed_at', 'notes',
            'created_at', 'updated_at', 'is_active',
        ]
        read_only_fields = ['created_at', 'updated_at', 'is_active']
        extra_kwargs = {
            'name': {'required': False, 'allow_blank': True},
            'origin': {'required': False},
            'notes': {'required': False, 'allow_blank': True},
            'subscribed_at': {'required': False},
            'unsubscribed_at': {'required': False, 'allow_null': True},
        }

    def validate_email(self, value):
        return value.strip().lower()

    def validate(self, attrs):
        status = attrs.get('status', getattr(self.instance, 'status', NewsletterSubscriber.STATUS_ACTIVE))

        if status == NewsletterSubscriber.STATUS_UNSUBSCRIBED:
            attrs['unsubscribed_at'] = attrs.get('unsubscribed_at') or timezone.now()
        elif status == NewsletterSubscriber.STATUS_ACTIVE:
            attrs['unsubscribed_at'] = None

        return attrs

    def create(self, validated_data):
        validated_data['is_active'] = True
        return super().create(validated_data)


class PublicNewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'name', 'origin', 'consent', 'status', 'subscribed_at']
        read_only_fields = ['id', 'status', 'subscribed_at']
        extra_kwargs = {
            'email': {'validators': []},
            'name': {'required': False, 'allow_blank': True},
            'origin': {'required': False},
            'consent': {'required': False},
        }

    def validate_email(self, value):
        return value.strip().lower()

    def create(self, validated_data):
        email = validated_data.pop('email')
        now = timezone.now()
        defaults = {
            'name': validated_data.get('name', ''),
            'origin': validated_data.get('origin') or NewsletterSubscriber.ORIGIN_BLOG,
            'consent': validated_data.get('consent', True),
            'status': NewsletterSubscriber.STATUS_ACTIVE,
            'subscribed_at': now,
            'unsubscribed_at': None,
            'is_active': True,
        }

        subscriber, _ = NewsletterSubscriber.objects.update_or_create(
            email=email,
            defaults=defaults,
        )
        return subscriber
