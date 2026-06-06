from django.db import models
from django.utils import timezone

from app.models import BaseModel


class NewsletterSubscriber(BaseModel):
    STATUS_ACTIVE = 'ACTIVE'
    STATUS_UNSUBSCRIBED = 'UNSUBSCRIBED'

    STATUS_CHOICES = [
        (STATUS_ACTIVE, 'Activo'),
        (STATUS_UNSUBSCRIBED, 'Desuscrito'),
    ]

    ORIGIN_BLOG = 'BLOG'
    ORIGIN_HOME = 'HOME'
    ORIGIN_CAMPAIGN = 'CAMPAIGN'
    ORIGIN_ADMIN = 'ADMIN'
    ORIGIN_OTHER = 'OTHER'

    ORIGIN_CHOICES = [
        (ORIGIN_BLOG, 'Blog'),
        (ORIGIN_HOME, 'Sitio web'),
        (ORIGIN_CAMPAIGN, 'Campaña'),
        (ORIGIN_ADMIN, 'Panel administrativo'),
        (ORIGIN_OTHER, 'Otro'),
    ]

    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=140, blank=True, default='')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_ACTIVE,
        db_index=True,
    )
    origin = models.CharField(
        max_length=32,
        choices=ORIGIN_CHOICES,
        default=ORIGIN_BLOG,
        db_index=True,
    )
    consent = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(default=timezone.now, db_index=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, default='')

    def __str__(self):
        return self.email

    class Meta:
        db_table = 'newsletter_subscribers'
        verbose_name = 'Newsletter subscriber'
        verbose_name_plural = 'Newsletter subscribers'
        ordering = ['-subscribed_at', '-created_at']
