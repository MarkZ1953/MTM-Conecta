from cloudinary_storage.storage import RawMediaCloudinaryStorage
from app.models import BaseModel
from django.conf import settings
from django.db import models


def generate_beneficiary_photo_path(instance, filename):
    return f'beneficiaries/photos/{instance.beneficiary.id}/{filename}'

def generate_beneficiary_auth_path(instance, filename):
    return f'beneficiaries/auth/{instance.beneficiary.id}/{filename}'
    

class Beneficiary(BaseModel):
    class TreatmentStage(models.TextChoices):
        INITIAL_SUPPORT = 'INITIAL_SUPPORT', 'Apoyo integral inicial'
        MID_TREATMENT = 'MID_TREATMENT', 'Mitad de tratamiento'
        SURVIVOR = 'SURVIVOR', 'Sobreviviente'

    first_name = models.CharField(
        max_length=64,
        null=False,
        blank=False
    )

    last_name = models.CharField(
        max_length=64,
        null=False,
        blank=False
    )

    birth_date = models.DateField(
        null=False,
        blank=False
    )

    identification_number = models.CharField(
        max_length=32,
        null=False,
        blank=False
    )

    municipality = models.CharField(
        max_length=128,
        blank=True,
        default=''
    )

    treatment_stage = models.CharField(
        max_length=32,
        choices=TreatmentStage.choices,
        default=TreatmentStage.INITIAL_SUPPORT,
        null=False,
        blank=False
    )

    treatment_status = models.CharField(
        max_length=128,
        blank=True,
        default=''
    )

    received_aid = models.TextField(
        blank=True,
        default=''
    )

    follow_up_notes = models.TextField(
        blank=True,
        default=''
    )

    photo = models.ImageField(
        upload_to=generate_beneficiary_photo_path,
        null=True,
        blank=True
    )

    authorization_doc = models.FileField(
        upload_to=generate_beneficiary_auth_path,
        storage=RawMediaCloudinaryStorage(),
        null=True,
        blank=True
    )

    registration_date = models.DateTimeField(
        auto_now_add=True
    )

    notes = models.TextField(
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        db_table = 'beneficiaries'
        verbose_name = 'Beneficiary'
        verbose_name_plural = 'Beneficiaries'


class Guardian(BaseModel):
    beneficiary = models.ForeignKey(
        Beneficiary,
        on_delete=models.PROTECT,
        related_name='guardians'
    )
    
    first_name = models.CharField(
        max_length=64,
        null=False,
        blank=False
    )

    last_name = models.CharField(
        max_length=64,
        null=False,
        blank=False
    )

    identification_number = models.CharField(
        max_length=32,
        null=False,
        blank=False
    )

    phone_number = models.CharField(
        max_length=32,
        null=False,
        blank=False
    )

    email = models.EmailField(
        max_length=32,
        null=False,
        blank=False
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        db_table = 'guardians'
        verbose_name = 'Guardian'
        verbose_name_plural = 'Guardians'


class AidLogEntry(BaseModel):
    """Bitácora de ayudas entregadas a un beneficiario."""

    beneficiary = models.ForeignKey(
        Beneficiary,
        on_delete=models.CASCADE,
        related_name='aid_log_entries'
    )

    delivery_date = models.DateTimeField(
        null=False,
        blank=False
    )

    aid_type = models.CharField(
        max_length=128,
        null=False,
        blank=False
    )

    description = models.TextField(
        null=False,
        blank=False
    )

    quantity_value = models.CharField(
        max_length=64,
        blank=True,
        default=''
    )

    missionary_program = models.CharField(
        max_length=64,
        blank=True,
        default=''
    )

    registered_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='aid_log_entries'
    )

    notes = models.TextField(
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.aid_type} → {self.beneficiary} ({self.delivery_date})"

    class Meta:
        db_table = 'aid_log_entries'
        ordering = ['-delivery_date']
        verbose_name = 'Aid Log Entry'
        verbose_name_plural = 'Aid Log Entries'

