from app.models import BaseModel
from django.db import models


class VolunteerStatus(models.TextChoices):
    PENDING = 'PENDING', 'Postulado'
    INTERVIEWED = 'INTERVIEWED', 'Entrevistado'
    APPROVED = 'APPROVED', 'Aprobado'
    REJECTED = 'REJECTED', 'Rechazado'
    INACTIVE = 'INACTIVE', 'Inactivo'


class SupportArea(models.TextChoices):
    TECHNICAL = 'TECHNICAL', 'Soporte Técnico'
    SOCIAL = 'SOCIAL', 'Gestión Social'


class Volunteer(BaseModel):
    first_name = models.CharField(max_length=64, null=False, blank=False)
    last_name = models.CharField(max_length=64, null=False, blank=False)
    identification_number = models.CharField(max_length=32, unique=True, null=False, blank=False)
    email = models.EmailField(max_length=128, unique=True, null=False, blank=False)
    phone = models.CharField(max_length=32, null=False, blank=False)
    profession = models.CharField(max_length=128, null=False, blank=False)
    support_area = models.CharField(
        max_length=32,
        choices=SupportArea.choices,
        default=SupportArea.SOCIAL,
        null=False,
        blank=False
    )
    status = models.CharField(
        max_length=32,
        choices=VolunteerStatus.choices,
        default=VolunteerStatus.PENDING,
        null=False,
        blank=False
    )
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.identification_number})"

    class Meta:
        db_table = 'volunteers'
        verbose_name = 'Volunteer'
        verbose_name_plural = 'Volunteers'


class VolunteerAvailability(BaseModel):
    volunteer = models.ForeignKey(
        Volunteer,
        on_delete=models.CASCADE,
        related_name='availabilities'
    )
    day_of_week = models.IntegerField(
        choices=[(i, str(i)) for i in range(1, 8)],
        null=False,
        blank=False
    )
    start_time = models.TimeField(null=False, blank=False)
    end_time = models.TimeField(null=False, blank=False)

    def __str__(self):
        return f"Disponibilidad #{self.pk} - Voluntario #{self.volunteer.pk} - Día {self.day_of_week}"

    class Meta:
        db_table = 'volunteer_availabilities'
        verbose_name = 'Volunteer Availability'
        verbose_name_plural = 'Volunteer Availabilities'


class VolunteerTask(BaseModel):
    volunteer = models.ForeignKey(
        Volunteer,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    title = models.CharField(max_length=128, null=False, blank=False)
    description = models.TextField(blank=True, null=True)
    hours_spent = models.DecimalField(max_digits=5, decimal_places=2, null=False, blank=False)
    date = models.DateField(null=False, blank=False)
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='volunteer_tasks'
    )

    def __str__(self):
        return f"Tarea #{self.pk} - {self.title} - {self.hours_spent} hs"

    class Meta:
        db_table = 'volunteer_tasks'
        verbose_name = 'Volunteer Task'
        verbose_name_plural = 'Volunteer Tasks'
