from django.db import models

from app.models import BaseModel


class InstagramPost(BaseModel):
    MEDIA_TYPE_IMAGE = 'IMAGE'
    MEDIA_TYPE_VIDEO = 'VIDEO'
    MEDIA_TYPE_CAROUSEL = 'CAROUSEL_ALBUM'

    MEDIA_TYPE_CHOICES = [
        (MEDIA_TYPE_IMAGE, 'Imagen'),
        (MEDIA_TYPE_VIDEO, 'Video / Reel'),
        (MEDIA_TYPE_CAROUSEL, 'Carrusel'),
    ]

    instagram_id = models.CharField(max_length=128, unique=True, db_index=True)
    caption = models.TextField(blank=True, default='')
    media_type = models.CharField(max_length=32, choices=MEDIA_TYPE_CHOICES, db_index=True)
    media_url = models.URLField(max_length=1000, blank=True, default='')
    thumbnail_url = models.URLField(max_length=1000, blank=True, default='')
    permalink = models.URLField(max_length=1000, blank=True, default='')
    timestamp = models.DateTimeField(db_index=True)
    children = models.JSONField(default=list, blank=True)
    is_visible = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)

    def __str__(self):
        return self.caption[:80] or self.instagram_id

    class Meta:
        db_table = 'instagram_posts'
        verbose_name = 'Instagram post'
        verbose_name_plural = 'Instagram posts'
        ordering = ['-timestamp', '-created_at']

