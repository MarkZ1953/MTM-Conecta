from django.contrib.auth.models import User
from app.models import BaseModel
from django.db import models


class StatusDonation(models.TextChoices):
    PENDING = 'PENDING', 'Pendiente'
    COMPLETED = 'COMPLETED', 'Completada'
    FAILED = 'FAILED', 'Fallida'


class Donor(BaseModel):
    user = models.OneToOneField(
        User,
        on_delete=models.PROTECT,
        null=False,
        blank=False,
        related_name='donor'
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

    email = models.EmailField(
        max_length=32,
        null=False,
        blank=False
    )

    def __str__(self):
        return f"{self.user.username}"

    class Meta:
        db_table = 'donors'
        verbose_name = 'Donor'
        verbose_name_plural = 'Donors'


class Donation(BaseModel):
    donor = models.ForeignKey(
        Donor,
        on_delete=models.PROTECT,
        null=False,
        blank=False,
        related_name='donations'
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=False,
        blank=False
    )

    date = models.DateTimeField(
        auto_now_add=True,
    )

    status = models.CharField(
        max_length=32,
        choices=StatusDonation.choices,
        default=StatusDonation.PENDING,
        null=False,
        blank=False
    )

    def __str__(self):
        return f"{self.donor.user.username} - {self.amount} - {self.date}"

    class Meta:
        db_table = 'donations'
        verbose_name = 'Donation'
        verbose_name_plural = 'Donations'
    