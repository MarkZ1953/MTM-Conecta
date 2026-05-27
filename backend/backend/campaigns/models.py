from django.core.exceptions import ValidationError
from app.models import BaseModel
from django.db import models


class CampaignContentType(models.TextChoices):
    BUILDER = 'BUILDER', 'Editor'
    IMAGE = 'IMAGE', 'Imagen'
    PDF = 'PDF', 'PDF'


class CampaignRecipientGroup(models.TextChoices):
    DONORS = 'DONORS', 'Donantes'
    GUARDIANS = 'GUARDIANS', 'Cuidadores'
    USERS = 'USERS', 'Usuarios'
    ALL = 'ALL', 'Todos'


class CampaignStatus(models.TextChoices):
    DRAFT = 'DRAFT', 'Borrador'
    SENDING = 'SENDING', 'Enviando'
    SENT = 'SENT', 'Enviada'
    FAILED = 'FAILED', 'Fallida'


class Campaign(BaseModel):
    subject = models.CharField(
        max_length=255,
        null=False,
        blank=False
    )

    content_type = models.CharField(
        max_length=16,
        choices=CampaignContentType.choices,
        default=CampaignContentType.IMAGE,
    )

    html_content = models.TextField(
        blank=True,
        default=''
    )

    image = models.ImageField(
        upload_to='campaigns/images/',
        null=True,
        blank=True,
    )

    document = models.FileField(
        upload_to='campaigns/docs/',
        null=True,
        blank=True,
    )

    cta_text = models.CharField(
        max_length=64,
        blank=True,
        default=''
    )

    cta_url = models.URLField(
        blank=True,
        default=''
    )

    recipient_group = models.CharField(
        max_length=16,
        choices=CampaignRecipientGroup.choices,
        default=CampaignRecipientGroup.DONORS,
    )

    status = models.CharField(
        max_length=16,
        choices=CampaignStatus.choices,
        default=CampaignStatus.DRAFT,
    )

    sent_at = models.DateTimeField(
        null=True,
        blank=True
    )

    sent_count = models.PositiveIntegerField(
        default=0
    )

    def clean(self):
        """Valida que el contenido coincida con el tipo de campaña elegido."""
        if self.content_type == CampaignContentType.IMAGE and not self.image:
            raise ValidationError({"image": "Debes subir una imagen para este tipo de campaña."})
        if self.content_type == CampaignContentType.PDF and not self.document:
            raise ValidationError({"document": "Debes subir un PDF para este tipo de campaña."})
        if self.content_type == CampaignContentType.BUILDER and not self.html_content:
            raise ValidationError({"html_content": "El contenido del editor no puede estar vacío."})

    def __str__(self):
        return self.subject

    class Meta:
        db_table = 'campaigns'
        verbose_name = 'Campaign'
        verbose_name_plural = 'Campaigns'
        ordering = ['-id']