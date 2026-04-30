from django.db import models
from apps.beneficiarios.models import Beneficiario
from apps.usuarios.models import Usuario


class Proyecto(models.Model):
    ESTADO = [
        ('planificacion', 'En planificación'),
        ('activo',        'Activo'),
        ('pausado',       'Pausado'),
        ('completado',    'Completado'),
        ('cancelado',     'Cancelado'),
    ]

    nombre          = models.CharField(max_length=150, verbose_name='Nombre del proyecto')
    descripcion     = models.TextField(blank=True, verbose_name='Descripción')
    objetivo        = models.TextField(blank=True, verbose_name='Objetivo')
    fecha_inicio    = models.DateField(null=True, blank=True, verbose_name='Fecha de inicio')
    fecha_fin       = models.DateField(null=True, blank=True, verbose_name='Fecha de cierre')
    presupuesto     = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True,
                                          verbose_name='Presupuesto')
    monto_recaudado = models.DecimalField(max_digits=14, decimal_places=2, default=0,
                                          verbose_name='Monto recaudado')
    estado          = models.CharField(max_length=20, choices=ESTADO, default='planificacion',
                                       verbose_name='Estado')
    responsable     = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True,
                                        related_name='proyectos_a_cargo', verbose_name='Responsable')
    beneficiarios   = models.ManyToManyField(Beneficiario, through='ProyectoBeneficiario',
                                             related_name='proyectos', verbose_name='Beneficiarios')
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table            = 'proyectos'
        verbose_name        = 'Proyecto'
        verbose_name_plural = 'Proyectos'
        ordering            = ['-created_at']

    def __str__(self):
        return f'{self.nombre} [{self.get_estado_display()}]'

    @property
    def porcentaje_recaudado(self):
        if self.presupuesto and self.presupuesto > 0:
            return round((self.monto_recaudado / self.presupuesto) * 100, 1)
        return 0


class ProyectoBeneficiario(models.Model):
    """Tabla intermedia entre Proyecto y Beneficiario."""
    proyecto          = models.ForeignKey(Proyecto, on_delete=models.CASCADE)
    beneficiario      = models.ForeignKey(Beneficiario, on_delete=models.CASCADE)
    fecha_vinculacion = models.DateField(null=True, blank=True, verbose_name='Fecha de vinculación')

    class Meta:
        db_table        = 'proyectos_beneficiarios'
        unique_together = ('proyecto', 'beneficiario')
        verbose_name        = 'Beneficiario en proyecto'
        verbose_name_plural = 'Beneficiarios en proyectos'

    def __str__(self):
        return f'{self.proyecto} ← {self.beneficiario}'
