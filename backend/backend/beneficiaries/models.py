from cloudinary_storage.storage import RawMediaCloudinaryStorage
from app.models import BaseModel
from django.db import models


def generate_beneficiary_photo_path(instance, filename):
    return f'beneficiaries/photos/{instance.beneficiary.id}/{filename}'

def generate_beneficiary_auth_path(instance, filename):
    return f'beneficiaries/auth/{instance.beneficiary.id}/{filename}'
    

class Beneficiary(BaseModel):
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
