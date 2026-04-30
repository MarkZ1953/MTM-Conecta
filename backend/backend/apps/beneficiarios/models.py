from django.db import models
from apps.personas.models import Persona


class Acudiente(models.Model):
    ESTADO_CIVIL = [
        ('soltero',      'Soltero/a'),
        ('casado',       'Casado/a'),
        ('union_libre',  'Unión libre'),
        ('separado',     'Separado/a'),
        ('viudo',        'Viudo/a'),
    ]

    persona       = models.OneToOneField(Persona, on_delete=models.CASCADE,
                                         related_name='acudiente', verbose_name='Persona')
    estado_civil  = models.CharField(max_length=30, choices=ESTADO_CIVIL, blank=True, verbose_name='Estado civil')
    profesion     = models.CharField(max_length=100, blank=True, verbose_name='Profesión')
    numero_hijos  = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name='Número de hijos')
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        db_table            = 'acudientes'
        verbose_name        = 'Acudiente'
        verbose_name_plural = 'Acudientes'
        ordering            = ['persona__primer_apellido']

    def __str__(self):
        return str(self.persona)


class OcupacionLaboral(models.Model):
    TIPO_CONTRATO = [
        ('independiente', 'Independiente'),
        ('contrato',      'Por contrato'),
    ]

    acudiente             = models.OneToOneField(Acudiente, on_delete=models.CASCADE,
                                                 related_name='ocupacion', verbose_name='Acudiente')
    actualmente_trabaja   = models.BooleanField(null=True, blank=True, verbose_name='¿Actualmente trabaja?')
    lugar_trabajo         = models.CharField(max_length=150, blank=True, verbose_name='Lugar de trabajo')
    horario_laboral       = models.CharField(max_length=100, blank=True, verbose_name='Horario laboral')
    actividad_desempenada = models.CharField(max_length=150, blank=True, verbose_name='Actividad desempeñada')
    tipo_contrato         = models.CharField(max_length=20, choices=TIPO_CONTRATO, blank=True, verbose_name='Tipo de contrato')

    class Meta:
        db_table            = 'ocupacion_laboral'
        verbose_name        = 'Ocupación laboral'
        verbose_name_plural = 'Ocupaciones laborales'

    def __str__(self):
        estado = 'Trabaja' if self.actualmente_trabaja else 'No trabaja'
        return f'{self.acudiente} — {estado}'


class Beneficiario(models.Model):
    persona            = models.OneToOneField(Persona, on_delete=models.CASCADE,
                                              related_name='beneficiario', verbose_name='Persona')
    diagnostico        = models.TextField(blank=True, verbose_name='Diagnóstico médico')
    ultima_evolucion   = models.TextField(blank=True, verbose_name='Última evolución clínica')
    grado_escolar      = models.CharField(max_length=30, blank=True, verbose_name='Grado escolar')
    fecha_ingreso_hosp = models.DateField(null=True, blank=True, verbose_name='Fecha de ingreso al hospital')
    lugar_nacimiento   = models.CharField(max_length=100, blank=True, verbose_name='Lugar de nacimiento')
    activo             = models.BooleanField(default=True, verbose_name='Activo')
    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    class Meta:
        db_table            = 'beneficiarios'
        verbose_name        = 'Beneficiario'
        verbose_name_plural = 'Beneficiarios'
        ordering            = ['persona__primer_apellido']

    def __str__(self):
        return str(self.persona)


class AcudienteBeneficiario(models.Model):
    """Tabla intermedia: un acudiente puede tener varios beneficiarios y viceversa."""
    PARENTESCO_CHOICES = [
        ('padre',   'Padre'),
        ('madre',   'Madre'),
        ('hermano', 'Hermano/a'),
        ('abuelo',  'Abuelo/a'),
        ('tio',     'Tío/a'),
        ('otro',    'Otro'),
    ]

    acudiente             = models.ForeignKey(Acudiente, on_delete=models.CASCADE,
                                              related_name='relaciones', verbose_name='Acudiente')
    beneficiario          = models.ForeignKey(Beneficiario, on_delete=models.CASCADE,
                                              related_name='relaciones', verbose_name='Beneficiario')
    parentesco            = models.CharField(max_length=60, choices=PARENTESCO_CHOICES, verbose_name='Parentesco')
    es_acudiente_principal = models.BooleanField(default=False, verbose_name='¿Es acudiente principal?')

    class Meta:
        db_table            = 'acudiente_beneficiario'
        verbose_name        = 'Relación Acudiente-Beneficiario'
        verbose_name_plural = 'Relaciones Acudiente-Beneficiario'
        unique_together     = ('acudiente', 'beneficiario')

    def __str__(self):
        return f'{self.acudiente} → {self.beneficiario} ({self.parentesco})'
