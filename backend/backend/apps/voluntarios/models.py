from django.db import models
from apps.personas.models import Persona
from apps.usuarios.models import Usuario


class Voluntario(models.Model):
    """
    Voluntario de la Fundación MTM.
    Se registra a través del formulario de la landing page (VolunteerForm.tsx)
    o directamente desde el panel administrativo.

    Cumplimiento Ley 1581/2012:
      - Los datos personales se almacenan en la tabla `personas` (normalización).
      - Esta tabla guarda solo los datos específicos del rol de voluntario.
      - El campo `acepta_tratamiento_datos` es obligatorio para poder registrar.
    """

    DISPONIBILIDAD = [
        ('weekdays',  'Entre semana'),
        ('weekends',  'Fines de semana'),
        ('flexible',  'Flexible'),
    ]

    ESTADO = [
        ('pendiente',  'Pendiente de revisión'),
        ('activo',     'Activo'),
        ('inactivo',   'Inactivo'),
        ('rechazado',  'Rechazado'),
    ]

    # ── Vinculación ──────────────────────────────────────────────
    persona        = models.OneToOneField(
        Persona,
        on_delete=models.CASCADE,
        related_name='voluntario',
        verbose_name='Persona',
    )

    # ── Datos específicos del voluntario ─────────────────────────
    habilidades    = models.TextField(
        blank=True,
        verbose_name='Habilidades',
        help_text='Descripción libre de habilidades, profesión u oficio',
    )
    disponibilidad = models.CharField(
        max_length=20,
        choices=DISPONIBILIDAD,
        default='flexible',
        verbose_name='Disponibilidad horaria',
    )
    estado         = models.CharField(
        max_length=20,
        choices=ESTADO,
        default='pendiente',
        verbose_name='Estado',
    )
    fecha_inicio   = models.DateField(
        null=True,
        blank=True,
        verbose_name='Fecha de inicio como voluntario',
    )
    observaciones  = models.TextField(
        blank=True,
        verbose_name='Observaciones internas',
        help_text='Notas del coordinador sobre el voluntario',
    )

    # ── Habeas Data / Consentimiento ─────────────────────────────
    acepta_tratamiento_datos = models.BooleanField(
        default=False,
        verbose_name='Acepta tratamiento de datos personales',
        help_text='Requerido por la Ley 1581 de 2012',
    )
    fecha_aceptacion         = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Fecha de aceptación de términos',
    )

    # ── Auditoría ────────────────────────────────────────────────
    registrado_por = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='voluntarios_registrados',
        verbose_name='Registrado por',
    )
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        db_table            = 'voluntarios'
        verbose_name        = 'Voluntario'
        verbose_name_plural = 'Voluntarios'
        ordering            = ['persona__primer_apellido', 'persona__primer_nombre']

    def __str__(self):
        return f'{self.persona} [{self.get_estado_display()}]'

    @property
    def nombre_completo(self):
        return self.persona.nombre_completo
