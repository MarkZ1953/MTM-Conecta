import re
import unicodedata

import cloudinary
import cloudinary.uploader
from django.conf import settings
from django.db import transaction
from rest_framework import serializers

from app.upload_validators import validate_evidence_upload, validate_image_upload
from .models import Event, Attendance, EventAct, Evidence, EventImage


def _configure_cloudinary():
    storage = settings.CLOUDINARY_STORAGE
    cloudinary.config(
        cloud_name=storage["CLOUD_NAME"],
        api_key=storage["API_KEY"],
        api_secret=storage["API_SECRET"],
        secure=True,
    )


def _event_public_id(event, index=1):
    normalized = unicodedata.normalize("NFKD", event.title or "")
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    safe_title = re.sub(r"[^A-Za-z0-9]+", "", ascii_text).lower()
    return f"{safe_title or 'evento'}{event.pk}img{index}"


def _upload_event_image(event, image, index=1):
    _configure_cloudinary()
    public_id = _event_public_id(event, index)
    result = cloudinary.uploader.upload(
        image,
        folder="Eventos",
        public_id=public_id,
        overwrite=True,
        resource_type="image",
        allowed_formats=["jpg", "jpeg", "png", "webp"],
        unique_filename=False,
        use_filename=False,
    )

    return {
        "image_url": result.get("secure_url", ""),
        "image_public_id": result.get("public_id", ""),
    }


def _replace_event_images(event, images):
    previous_public_ids = list(event.images.values_list("image_public_id", flat=True))
    event.images.all().delete()

    uploaded_images = [
        EventImage.objects.create(
            event=event,
            order=index,
            **_upload_event_image(event, image, index + 1),
        )
        for index, image in enumerate(images)
    ]

    if uploaded_images:
        event.image_url = uploaded_images[0].image_url
        event.image_public_id = uploaded_images[0].image_public_id
    else:
        event.image_url = ""
        event.image_public_id = ""
    event.save(update_fields=["image_url", "image_public_id", "updated_at"])

    uploaded_public_ids = {image.image_public_id for image in uploaded_images}
    for public_id in previous_public_ids:
        if public_id and public_id not in uploaded_public_ids:
            cloudinary.uploader.destroy(public_id, resource_type="image")

    return event


def _get_uploaded_event_images(serializer, validated_data):
    images = validated_data.pop('image_uploads', None)
    if images:
        return images

    request = serializer.context.get('request')
    if request and hasattr(request.data, 'getlist'):
        return request.data.getlist('image_uploads') or request.data.getlist('image_upload')

    image = validated_data.pop('image_upload', None)
    return [image] if image else []


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = [
            'id', 'beneficiary', 'event', 'attended', 'notes'
        ]


class EventActSerializer(serializers.ModelSerializer):
    def validate_digital_signature_path(self, value):
        return validate_image_upload(value, field_name='digital_signature_path')

    class Meta:
        model = EventAct
        fields = [
            'id', 'event', 'content', 'digital_signature_path',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['created_at', 'updated_at']


class EvidenceSerializer(serializers.ModelSerializer):
    def validate_file(self, value):
        return validate_evidence_upload(value, field_name='file')

    class Meta:
        model = Evidence
        fields = [
            'id', 'event', 'file', 'description',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['created_at', 'updated_at']


class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = [
            'id', 'image_url', 'image_public_id', 'order',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = fields


class EventSerializer(serializers.ModelSerializer):
    attendees_count = serializers.SerializerMethodField()
    evidences_count = serializers.SerializerMethodField()
    images = EventImageSerializer(many=True, read_only=True)
    image_upload = serializers.ImageField(
        write_only=True,
        required=False,
        allow_null=True,
        validators=[lambda image: validate_image_upload(image, field_name='image_upload')],
    )
    image_uploads = serializers.ListField(
        child=serializers.ImageField(validators=[lambda image: validate_image_upload(image, field_name='image_uploads')]),
        write_only=True,
        required=False,
        allow_empty=True,
    )

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date',
            'location', 'image_url', 'image_public_id', 'images',
            'image_upload', 'image_uploads',
            'attendees_count', 'evidences_count',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['image_url', 'image_public_id', 'images', 'created_at', 'updated_at']

    def create(self, validated_data):
        images = _get_uploaded_event_images(self, validated_data)
        with transaction.atomic():
            event = super().create(validated_data)
            if images:
                _replace_event_images(event, images)
        return event

    def update(self, instance, validated_data):
        images = _get_uploaded_event_images(self, validated_data)
        with transaction.atomic():
            event = super().update(instance, validated_data)
            if images:
                _replace_event_images(event, images)
        return event

    def get_attendees_count(self, obj):
        return obj.attendances.count()

    def get_evidences_count(self, obj):
        return obj.evidences.count()


class EventDetailSerializer(serializers.ModelSerializer):
    """
    Serializer para detalle completo de Event incluyendo relaciones.
    """
    attendances = AttendanceSerializer(many=True, read_only=True)
    evidences = EvidenceSerializer(many=True, read_only=True)
    act = EventActSerializer(read_only=True)
    attendees_count = serializers.SerializerMethodField()
    evidences_count = serializers.SerializerMethodField()
    images = EventImageSerializer(many=True, read_only=True)
    image_upload = serializers.ImageField(
        write_only=True,
        required=False,
        allow_null=True,
        validators=[lambda image: validate_image_upload(image, field_name='image_upload')],
    )
    image_uploads = serializers.ListField(
        child=serializers.ImageField(validators=[lambda image: validate_image_upload(image, field_name='image_uploads')]),
        write_only=True,
        required=False,
        allow_empty=True,
    )

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date',
            'location', 'image_url', 'image_public_id', 'images',
            'image_upload', 'image_uploads',
            'attendees', 'attendances', 'evidences', 'act',
            'attendees_count', 'evidences_count',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['image_url', 'image_public_id', 'images', 'created_at', 'updated_at']

    def get_attendees_count(self, obj):
        return obj.attendances.count()

    def get_evidences_count(self, obj):
        return obj.evidences.count()
