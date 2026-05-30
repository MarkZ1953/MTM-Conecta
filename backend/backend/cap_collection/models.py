from app.models import BaseModel
from django.db import models


class Company(BaseModel):
    nit = models.CharField(
        max_length=20,
        unique=True,
        null=False,
        blank=False
    )

    business_name = models.CharField(
        max_length=200,
        null=False,
        blank=False
    )

    contact_name = models.CharField(
        max_length=128,
        null=False,
        blank=False
    )

    contact_email = models.EmailField(
        max_length=64,
        null=False,
        blank=False
    )

    contact_phone = models.CharField(
        max_length=20,
        null=False,
        blank=False
    )

    def __str__(self):
        return f"{self.nit} - {self.business_name}"

    class Meta:
        db_table = 'cap_companies'
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'


class CollectionPoint(BaseModel):
    company = models.ForeignKey(
        Company,
        on_delete=models.PROTECT,
        null=False,
        blank=False,
        related_name='collection_points'
    )

    name = models.CharField(
        max_length=128,
        null=False,
        blank=False
    )

    address = models.CharField(
        max_length=256,
        null=False,
        blank=False
    )

    municipality = models.CharField(
        max_length=64,
        null=False,
        blank=False
    )

    department = models.CharField(
        max_length=64,
        null=False,
        blank=False
    )

    contact_name = models.CharField(
        max_length=128,
        null=True,
        blank=True
    )

    contact_phone = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.name} - {self.company.business_name}"

    class Meta:
        db_table = 'cap_collection_points'
        verbose_name = 'Collection Point'
        verbose_name_plural = 'Collection Points'


class StatusCollectionRequest(models.TextChoices):
    PENDING = 'PENDING', 'Pendiente'
    ASSIGNED = 'ASSIGNED', 'Asignada'
    IN_ROUTE = 'IN_ROUTE', 'En Ruta'
    COLLECTED = 'COLLECTED', 'Recolectada'
    CANCELLED = 'CANCELLED', 'Cancelada'


class CollectionRequest(BaseModel):
    collection_point = models.ForeignKey(
        CollectionPoint,
        on_delete=models.PROTECT,
        null=False,
        blank=False,
        related_name='collection_requests'
    )

    status = models.CharField(
        max_length=32,
        choices=StatusCollectionRequest.choices,
        default=StatusCollectionRequest.PENDING,
        null=False,
        blank=False
    )

    estimated_weight_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=False,
        blank=False
    )

    scheduled_date = models.DateField(
        null=False,
        blank=False
    )

    driver_name = models.CharField(
        max_length=128,
        null=True,
        blank=True
    )

    notes = models.TextField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Solicitud #{self.pk} - {self.collection_point.name} - {self.status}"

    class Meta:
        db_table = 'cap_collection_requests'
        verbose_name = 'Collection Request'
        verbose_name_plural = 'Collection Requests'
