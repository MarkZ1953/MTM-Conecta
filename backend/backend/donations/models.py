from datetime import timedelta
from django.contrib.auth.models import User
from django.db import models
from django.db.models import Sum
from django.utils import timezone
from app.models import BaseModel


class SponsorCategory(models.TextChoices):
    BRONZE = 'BRONZE', 'Bronce (Nivel 1)'
    SILVER = 'SILVER', 'Plata (Nivel 2)'
    GOLD = 'GOLD', 'Oro (Nivel 3)'
    PLATINUM = 'PLATINUM', 'Platino (Nivel 4)'


class StatusDonation(models.TextChoices):
    PENDING = 'PENDING', 'Pendiente'
    COMPLETED = 'COMPLETED', 'Completada'
    FAILED = 'FAILED', 'Fallida'


class DonorType(models.TextChoices):
    PERSON = 'PERSON', 'Persona natural'
    FAMILY = 'FAMILY', 'Familia'
    COMPANY = 'COMPANY', 'Empresa'


class DonationType(models.TextChoices):
    ECOAPORTE = 'ECOAPORTE', 'Bono Donación / Ecoaporte'
    PERMANENT_SPONSOR = 'PERMANENT_SPONSOR', 'Padrino Permanente'


class Donor(BaseModel):
    user = models.OneToOneField(
        User,
        on_delete=models.PROTECT,
        null=False,
        blank=False,
        related_name='donor'
    )

    donor_type = models.CharField(
        max_length=16,
        choices=DonorType.choices,
        default=DonorType.PERSON,
        null=False,
        blank=False
    )

    organization_name = models.CharField(
        max_length=128,
        blank=True,
        default=''
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

    subscription_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        null=False,
        blank=False
    )

    payment_day = models.IntegerField(
        default=5,
        null=False,
        blank=False
    )

    category = models.CharField(
        max_length=32,
        choices=SponsorCategory.choices,
        default=SponsorCategory.BRONZE,
        null=False,
        blank=False
    )

    marketing_opt_in = models.BooleanField(
        default=True,
        null=False,
        blank=False
    )

    def update_category(self):
        one_year_ago = timezone.now() - timedelta(days=365)
        total_donated = self.donations.filter(
            status='COMPLETED',
            date__gte=one_year_ago
        ).aggregate(total=Sum('amount'))['total'] or 0.00
        
        if total_donated < 500000.00:
            self.category = SponsorCategory.BRONZE
        elif total_donated < 1500000.00:
            self.category = SponsorCategory.SILVER
        elif total_donated < 5000000.00:
            self.category = SponsorCategory.GOLD
        else:
            self.category = SponsorCategory.PLATINUM
            
        self.save(update_fields=['category'])

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.user.username})"

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

    donation_type = models.CharField(
        max_length=32,
        choices=DonationType.choices,
        default=DonationType.ECOAPORTE,
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
    
