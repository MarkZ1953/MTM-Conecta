from django.db import models
from apps.beneficiarios.models import Beneficiario
from apps.usuarios.models import Usuario


class Programa(models.Model):
    """
    Programas de la Fundación MTM.
    Los 5 programas actuales según el formulario de inscripción:
    - Hogar de Paso "Victoria"
    - Programa Educativo "Educando Ángeles"
    - Programa de mercados
    - Apoyo psicosocial
    - Consultoría jurídica
    """
    nombre      = models.CharField(max_length=150, verbose_name='Nombre del programa')
    descripcion = models.TextField(blank=True, verbose_name='Descripción')
    beneficios  = models.TextField(blank=True, verbose_name='Beneficios')
    activo      = models.BooleanField(default=True, verbose_name='Activo')
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'programas'
        verbose_name        = 'Programa'
        verbose_name_plural = 'Programas'
        ordering            = ['nombre']

    def __str__(self):
        return self.nombre


class InscripcionPrograma(models.Model):
    """Inscripción de un beneficiario a un programa de la Fundación."""
    ESTADO = [
        ('activo',     'Activo'),
        ('suspendido', 'Suspendido'),
        ('egresado',   'Egresado'),
    ]

    beneficiario      = models.ForeignKey(Beneficiario, on_delete=models.CASCADE,
                                          related_name='inscripciones', verbose_name='Beneficiario')
    programa          = models.ForeignKey(Programa, on_delete=models.CASCADE,
                                          related_name='inscripciones', verbose_name='Programa')
    fecha_inscripcion = models.DateField(verbose_name='Fecha de inscripción')
    estado            = models.CharField(max_length=20, choices=ESTADO, default='activo', verbose_name='Estado')
    fecha_egreso      = models.DateField(null=True, blank=True, verbose_name='Fecha de egreso')
    motivo_egreso     = models.TextField(blank=True, verbose_name='Motivo de egreso')
    observaciones     = models.TextField(blank=True, verbose_name='Observaciones')
    registrado_por    = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True,
                                          related_name='inscripciones_registradas', verbose_name='Registrado por')
    created_at        = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'inscripciones_programas'
        verbose_name        = 'Inscripción a programa'
        verbose_name_plural = 'Inscripciones a programas'
        unique_together     = ('beneficiario', 'programa')
        ordering            = ['-fecha_inscripcion']

    def __str__(self):
        return f'{self.beneficiario} → {self.programa} [{self.get_estado_display()}]'


class Seguimiento(models.Model):
    """Registro de seguimientos individuales a beneficiarios."""
    TIPO = [
        ('visita',     'Visita domiciliaria'),
        ('llamada',    'Llamada telefónica'),
        ('sesion',     'Sesión presencial'),
        ('evaluacion', 'Evaluación'),
        ('otro',       'Otro'),
    ]
    ESTADO = [
        ('pendiente',  'Pendiente'),
        ('realizado',  'Realizado'),
        ('cancelado',  'Cancelado'),
    ]

    beneficiario     = models.ForeignKey(Beneficiario, on_delete=models.CASCADE,
                                         related_name='seguimientos', verbose_name='Beneficiario')
    programa         = models.ForeignKey(Programa, on_delete=models.SET_NULL, null=True, blank=True,
                                         related_name='seguimientos', verbose_name='Programa')
    usuario          = models.ForeignKey(Usuario, on_delete=models.CASCADE,
                                         related_name='seguimientos', verbose_name='Responsable')
    fecha_seguimiento = models.DateField(verbose_name='Fecha de seguimiento')
    tipo_seguimiento  = models.CharField(max_length=50, choices=TIPO, verbose_name='Tipo de seguimiento')
    descripcion       = models.TextField(blank=True, verbose_name='Descripción')
    estado            = models.CharField(max_length=20, choices=ESTADO, default='pendiente', verbose_name='Estado')
    created_at        = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'seguimientos'
        verbose_name        = 'Seguimiento'
        verbose_name_plural = 'Seguimientos'
        ordering            = ['-fecha_seguimiento']

    def __str__(self):
        return f'[{self.get_tipo_seguimiento_display()}] {self.beneficiario} — {self.fecha_seguimiento}'
