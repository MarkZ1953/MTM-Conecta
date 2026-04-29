from django.db import models
from apps.beneficiarios.models import Acudiente, Beneficiario
from apps.usuarios.models import Usuario


class Caracterizacion(models.Model):
    """
    Ficha de caracterización socioeconómica.
    Mapea directamente la sección 'Ficha de Caracterización' del formulario oficial.
    """
    TIPO_VIVIENDA = [
        ('propia',   'Propia'),
        ('arriendo', 'En arriendo'),
        ('familiar', 'Familiar'),
    ]
    ZONA = [
        ('urbana', 'Urbana'),
        ('rural',  'Rural'),
    ]
    TIPO_EPS = [
        ('subsidiado',   'Subsidiado'),
        ('contributivo', 'Contributivo'),
    ]

    beneficiario      = models.ForeignKey(Beneficiario, on_delete=models.CASCADE,
                                          related_name='caracterizaciones', verbose_name='Beneficiario')
    acudiente         = models.ForeignKey(Acudiente, on_delete=models.CASCADE,
                                          related_name='caracterizaciones', verbose_name='Acudiente')
    registrado_por    = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True,
                                          related_name='caracterizaciones_registradas', verbose_name='Registrado por')
    fecha_registro    = models.DateField(verbose_name='Fecha de registro')

    # ── Vivienda ──────────────────────────────────────────────────
    tipo_vivienda     = models.CharField(max_length=20, choices=TIPO_VIVIENDA, blank=True, verbose_name='Tipo de vivienda')
    zona_residencia   = models.CharField(max_length=10, choices=ZONA, blank=True, verbose_name='Zona de residencia')
    direccion         = models.CharField(max_length=200, blank=True, verbose_name='Dirección')
    barrio            = models.CharField(max_length=100, blank=True, verbose_name='Barrio')
    municipio         = models.CharField(max_length=100, blank=True, verbose_name='Municipio')
    departamento      = models.CharField(max_length=100, blank=True, verbose_name='Departamento')
    estrato           = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name='Estrato socioeconómico')

    # ── Grupos poblacionales ──────────────────────────────────────
    grupo_afrocolombiano = models.BooleanField(default=False, verbose_name='Afrocolombiano')
    grupo_indigena       = models.BooleanField(default=False, verbose_name='Indígena')
    grupo_lgbtq          = models.BooleanField(default=False, verbose_name='LGBTQ+')
    grupo_migrante       = models.BooleanField(default=False, verbose_name='Migrante')
    grupo_desplazado     = models.BooleanField(default=False, verbose_name='Desplazado por la violencia')
    grupo_rom            = models.BooleanField(default=False, verbose_name='Rom')
    grupo_otro           = models.CharField(max_length=100, blank=True, verbose_name='Otro grupo poblacional')

    # ── Afiliación a salud ────────────────────────────────────────
    tiene_eps       = models.BooleanField(null=True, blank=True, verbose_name='¿Tiene EPS?')
    nombre_eps      = models.CharField(max_length=100, blank=True, verbose_name='Nombre de la EPS')
    tipo_eps        = models.CharField(max_length=20, choices=TIPO_EPS, blank=True, verbose_name='Tipo de EPS')
    tiene_sisben    = models.BooleanField(null=True, blank=True, verbose_name='¿Tiene SISBÉN?')
    nivel_sisben    = models.CharField(max_length=10, blank=True, verbose_name='Nivel SISBÉN')
    tiene_caja_comp = models.BooleanField(null=True, blank=True, verbose_name='¿Tiene caja de compensación?')
    nombre_caja_comp = models.CharField(max_length=100, blank=True, verbose_name='Caja de compensación')

    # ── Servicios del hogar ───────────────────────────────────────
    servicio_luz        = models.BooleanField(default=False, verbose_name='Luz')
    servicio_agua       = models.BooleanField(default=False, verbose_name='Agua')
    servicio_gas        = models.BooleanField(default=False, verbose_name='Gas')
    servicio_television = models.BooleanField(default=False, verbose_name='Televisión')
    servicio_internet   = models.BooleanField(default=False, verbose_name='Internet')
    tiene_transporte    = models.BooleanField(default=False, verbose_name='¿Tiene medio de transporte?')
    tipo_transporte     = models.CharField(max_length=80, blank=True, verbose_name='Tipo de transporte')

    # ── Información familiar ──────────────────────────────────────
    convivientes_cantidad    = models.PositiveSmallIntegerField(null=True, blank=True,
                                                                verbose_name='Número de convivientes')
    ingreso_mensual_familiar = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True,
                                                   verbose_name='Ingreso mensual familiar')
    descripcion_relacion_fam = models.TextField(blank=True, verbose_name='Descripción de la relación familiar')

    # ── Derechos fundamentales ────────────────────────────────────
    forma_suplir_alimentacion = models.TextField(blank=True, verbose_name='¿Cómo suple la alimentación?')
    alimentos_comidas         = models.TextField(blank=True, verbose_name='Alimentos en comidas')
    nna_en_sistema_educativo  = models.BooleanField(null=True, blank=True,
                                                    verbose_name='¿NNA en sistema educativo?')
    actividades_tiempo_libre  = models.TextField(blank=True, verbose_name='Actividades en tiempo libre')
    frecuencia_actividades    = models.CharField(max_length=80, blank=True,
                                                 verbose_name='Frecuencia de actividades')

    # ── Cierre ────────────────────────────────────────────────────
    observaciones = models.TextField(blank=True, verbose_name='Observaciones')
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        db_table            = 'caracterizaciones'
        verbose_name        = 'Caracterización'
        verbose_name_plural = 'Caracterizaciones'
        ordering            = ['-fecha_registro']

    def __str__(self):
        return f'Caracterización de {self.beneficiario} — {self.fecha_registro}'


class MiembroFamilia(models.Model):
    """Integrantes del núcleo familiar del beneficiario."""
    caracterizacion = models.ForeignKey(Caracterizacion, on_delete=models.CASCADE,
                                        related_name='miembros_familia', verbose_name='Caracterización')
    nombre          = models.CharField(max_length=160, verbose_name='Nombre completo')
    edad            = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name='Edad')
    parentesco      = models.CharField(max_length=60, blank=True,
                                       verbose_name='Parentesco con el menor')
    ocupacion       = models.CharField(max_length=100, blank=True, verbose_name='Ocupación')

    class Meta:
        db_table            = 'miembros_familia'
        verbose_name        = 'Miembro de familia'
        verbose_name_plural = 'Miembros de familia'

    def __str__(self):
        return f'{self.nombre} ({self.parentesco})'
