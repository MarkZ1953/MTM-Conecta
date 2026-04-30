from django.db import models
from apps.usuarios.models import Usuario


class FormularioLead(models.Model):
    """
    Registro de solicitudes recibidas desde los formularios públicos
    de la landing page (DonateForm, VolunteerForm, PartnerForm).

    Propósito:
      - Capturar el dato ANTES de que un administrador lo procese.
      - Ningún dato del visitante se pierde.
      - El administrador puede convertir un lead en Donante, Voluntario
        o Aliado desde el panel, y marcar el lead como 'atendido'.

    Cumplimiento Ley 1581/2012:
      - Se almacena la IP y fecha de envío como evidencia del consentimiento.
      - El campo `acepta_tratamiento_datos` debe ser marcado por el visitante.
      - Los datos se eliminan automáticamente si el lead no es convertido
        en X días (configurable, pendiente de política interna de la fundación).
    """

    TIPO = [
        ('donacion',    'Donación'),
        ('voluntario',  'Voluntario'),
        ('alianza',     'Alianza empresarial'),
        ('contacto',    'Contacto general'),
    ]

    ESTADO = [
        ('nuevo',       'Nuevo — sin revisar'),
        ('en_proceso',  'En proceso'),
        ('atendido',    'Atendido'),
        ('descartado',  'Descartado'),
    ]

    # ── Origen ───────────────────────────────────────────────────
    tipo           = models.CharField(max_length=20, choices=TIPO, verbose_name='Tipo de solicitud')
    estado         = models.CharField(max_length=20, choices=ESTADO, default='nuevo', verbose_name='Estado')

    # ── Datos del visitante ───────────────────────────────────────
    nombre_completo   = models.CharField(max_length=200, verbose_name='Nombre completo')
    email             = models.EmailField(verbose_name='Correo electrónico')
    telefono          = models.CharField(max_length=20, blank=True, verbose_name='Teléfono')

    # ── Campos específicos por tipo ───────────────────────────────
    # Donación
    tipo_donacion  = models.CharField(
        max_length=30, blank=True, verbose_name='Tipo de donación',
        help_text='monetary | species — Completado si tipo=donacion',
    )
    monto_donacion = models.DecimalField(
        max_digits=14, decimal_places=2, null=True, blank=True,
        verbose_name='Monto de donación',
        help_text='Solo si tipo_donacion=monetary',
    )

    # Voluntario
    habilidades    = models.TextField(
        blank=True, verbose_name='Habilidades',
        help_text='Completado si tipo=voluntario',
    )
    disponibilidad = models.CharField(
        max_length=20, blank=True, verbose_name='Disponibilidad',
        help_text='weekdays | weekends | flexible',
    )

    # Alianza empresarial
    nombre_empresa  = models.CharField(max_length=150, blank=True, verbose_name='Nombre de la empresa')
    propuesta_alianza = models.TextField(blank=True, verbose_name='Propuesta de alianza')

    # ── Habeas Data ───────────────────────────────────────────────
    acepta_tratamiento_datos = models.BooleanField(
        default=False,
        verbose_name='Acepta tratamiento de datos personales',
        help_text='Requerido por la Ley 1581 de 2012',
    )

    # ── Trazabilidad técnica ──────────────────────────────────────
    ip_origen       = models.GenericIPAddressField(null=True, blank=True, verbose_name='IP de origen')
    notas_internas  = models.TextField(blank=True, verbose_name='Notas del administrador')
    atendido_por    = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='leads_atendidos',
        verbose_name='Atendido por',
    )
    fecha_atencion  = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de atención')
    created_at      = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de recepción')

    class Meta:
        db_table            = 'formularios_leads'
        verbose_name        = 'Solicitud (Lead)'
        verbose_name_plural = 'Solicitudes de la Landing Page'
        ordering            = ['-created_at']

    def __str__(self):
        return f'[{self.get_tipo_display()}] {self.nombre_completo} — {self.created_at:%Y-%m-%d %H:%M} [{self.get_estado_display()}]'
