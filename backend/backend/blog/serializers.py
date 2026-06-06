import re
import unicodedata

import cloudinary
import cloudinary.uploader
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify
from rest_framework import serializers

from .models import BlogPost


def _configure_cloudinary():
    storage = settings.CLOUDINARY_STORAGE
    cloudinary.config(
        cloud_name=storage["CLOUD_NAME"],
        api_key=storage["API_KEY"],
        api_secret=storage["API_SECRET"],
        secure=True,
    )


def _safe_image_public_id(post):
    normalized = unicodedata.normalize("NFKD", post.slug or post.title or "")
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    safe_text = re.sub(r"[^A-Za-z0-9]+", "", ascii_text).lower()
    return f"{safe_text or 'blog'}{post.pk}img"


def _upload_blog_image(post, image):
    _configure_cloudinary()
    result = cloudinary.uploader.upload(
        image,
        folder="Blog",
        public_id=_safe_image_public_id(post),
        overwrite=True,
        resource_type="image",
        unique_filename=False,
        use_filename=False,
    )

    return {
        "image_url": result.get("secure_url", ""),
        "image_public_id": result.get("public_id", ""),
    }


def _unique_slug(instance, value):
    base_slug = slugify(value or instance.title or "publicacion")[:220] or "publicacion"
    slug = base_slug
    index = 2
    queryset = BlogPost.objects.filter(slug=slug)

    if instance.pk:
        queryset = queryset.exclude(pk=instance.pk)

    while queryset.exists():
        suffix = f"-{index}"
        slug = f"{base_slug[:240 - len(suffix)]}{suffix}"
        queryset = BlogPost.objects.filter(slug=slug)
        if instance.pk:
            queryset = queryset.exclude(pk=instance.pk)
        index += 1

    return slug


class BlogPostSerializer(serializers.ModelSerializer):
    image_upload = serializers.ImageField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'summary', 'content',
            'image_url', 'image_public_id', 'image_alt', 'image_upload',
            'published_at', 'status',
            'created_at', 'updated_at', 'is_active',
        ]
        read_only_fields = ['image_url', 'image_public_id', 'created_at', 'updated_at', 'is_active']
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True},
            'published_at': {'required': False, 'allow_null': True},
        }

    def validate(self, attrs):
        status = attrs.get('status', getattr(self.instance, 'status', BlogPost.STATUS_DRAFT))
        published_at = attrs.get('published_at', getattr(self.instance, 'published_at', None))

        if status == BlogPost.STATUS_PUBLISHED and published_at is None:
            attrs['published_at'] = timezone.now()

        return attrs

    def create(self, validated_data):
        image = validated_data.pop('image_upload', None)
        validated_data['is_active'] = True
        validated_data['slug'] = _unique_slug(BlogPost(**validated_data), validated_data.get('slug') or validated_data.get('title'))

        with transaction.atomic():
            post = super().create(validated_data)
            if image:
                uploaded = _upload_blog_image(post, image)
                BlogPost.objects.filter(pk=post.pk).update(**uploaded, updated_at=timezone.now())
                post.image_url = uploaded["image_url"]
                post.image_public_id = uploaded["image_public_id"]
        return post

    def update(self, instance, validated_data):
        image = validated_data.pop('image_upload', None)

        if 'slug' in validated_data or 'title' in validated_data:
            slug_value = validated_data.get('slug') or validated_data.get('title') or instance.slug
            validated_data['slug'] = _unique_slug(instance, slug_value)

        with transaction.atomic():
            previous_public_id = instance.image_public_id
            post = super().update(instance, validated_data)
            if image:
                uploaded = _upload_blog_image(post, image)
                BlogPost.objects.filter(pk=post.pk).update(**uploaded, updated_at=timezone.now())
                post.image_url = uploaded["image_url"]
                post.image_public_id = uploaded["image_public_id"]
                if previous_public_id and previous_public_id != uploaded["image_public_id"]:
                    cloudinary.uploader.destroy(previous_public_id, resource_type="image")
        return post


class PublicBlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'summary', 'content',
            'image_url', 'image_alt', 'published_at',
        ]
