from django.db import models

from app.models import BaseModel


class BlogPost(BaseModel):
    STATUS_DRAFT = 'draft'
    STATUS_PUBLISHED = 'published'

    STATUS_CHOICES = [
        (STATUS_DRAFT, 'Borrador'),
        (STATUS_PUBLISHED, 'Publicado'),
    ]

    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=240, unique=True, db_index=True)
    summary = models.TextField(max_length=520)
    content = models.TextField()
    image_url = models.URLField(max_length=500, blank=True, default='')
    image_public_id = models.CharField(max_length=255, blank=True, default='')
    image_alt = models.CharField(max_length=220, blank=True, default='')
    published_at = models.DateTimeField(null=True, blank=True, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT, db_index=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'blog_posts'
        verbose_name = 'Blog post'
        verbose_name_plural = 'Blog posts'
        ordering = ['-published_at', '-created_at']

