from cloudinary_storage.storage import RawMediaCloudinaryStorage
from django.db import models
from app.models import BaseModel
from beneficiaries.models import Beneficiary


class Event(BaseModel):
    """
    Actividades organizadas por la fundacion.
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=255)
    image_url = models.URLField(max_length=500, blank=True, default='')
    image_public_id = models.CharField(max_length=255, blank=True, default='')
    attendees = models.ManyToManyField(
        Beneficiary,
        through='Attendance',
        related_name='events',
        blank=True
    )

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'events'
        verbose_name = 'Event'
        verbose_name_plural = 'Events'


class Attendance(models.Model):
    """
    Modelo intermedio para registrar asistencia y observaciones especificas del evento.
    """
    beneficiary = models.ForeignKey(
        Beneficiary,
        on_delete=models.CASCADE,
        related_name='event_attendances'
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='attendances'
    )
    attended = models.BooleanField(default=False)
    notes = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'attendances'
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendances'
      #  unique_together = ['beneficiary', 'event']


class EventImage(BaseModel):
    """
    Imagenes publicas asociadas a un evento.
    """
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image_url = models.URLField(max_length=500)
    image_public_id = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Image for {self.event.title}"

    class Meta:
        db_table = 'event_images'
        verbose_name = 'Event Image'
        verbose_name_plural = 'Event Images'
        ordering = ['order', 'id']


class EventAct(BaseModel):
    """
    Documentacion formal del evento con firmas digitales.
    """
    event = models.OneToOneField(
        Event,
        on_delete=models.CASCADE,
        related_name='act'
    )
    content = models.TextField()  # Relato de lo sucedido
    digital_signature_path = models.ImageField(
        upload_to='acts/signatures/',
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'event_acts'
        verbose_name = 'Event Act'
        verbose_name_plural = 'Event Acts'


class Evidence(BaseModel):
    """
    Fotos o videos que sirven como evidencia de la actividad.
    """
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='evidences'
    )
    file = models.FileField(
        upload_to='events/evidence/',
        storage=RawMediaCloudinaryStorage(),
    )
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Evidence for {self.event.title}"

    class Meta:
        db_table = 'evidences'
        verbose_name = 'Evidence'
        verbose_name_plural = 'Evidences'
