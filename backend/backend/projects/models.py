from app.models import BaseModel
from beneficiaries.models import Beneficiary
from django.db import models


class StatusProject(models.TextChoices):
    PLANNED = 'PLANNED', 'Planeado'
    IN_PROGRESS = 'IN_PROGRESS', 'En ejecución'
    FINISHED = 'FINISHED', 'Finalizado'


class Project(BaseModel):
    name = models.CharField(
        max_length=128,
        null=False,
        blank=False
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    start_date = models.DateField(
        null=False,
        blank=False
    )

    end_date = models.DateField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=32,
        choices=StatusProject.choices,
        default=StatusProject.PLANNED,
        null=False,
        blank=False
    )

    beneficiaries = models.ManyToManyField(
        Beneficiary,
        blank=True,
        related_name='projects'
    )

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'projects'
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'