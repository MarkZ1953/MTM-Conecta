from django.db import models
from apps.personas.models import Persona
from apps.usuarios.models import Usuario


class Donante(models.Model):
    TIPO = [
        ('persona_natural', 'Persona natural'),
        ('empresa',         'Empresa / Persona jurídica'),
    ]

    tipo_donante   = models.CharField(max_length=20, choices=TIPO, verbose_name='Tipo de donante')
    # Vinculado cuando es persona natural
    persona        = models.ForeignKey(Persona, on_delete=models.SET_NULL, null=True, blank=True,
                                       related_name='donante', verbose_name='Persona')
    # Campos para empresa / persona jurídica
    nombre_empresa = models.CharField(max_length=150, blank=True, verbose_name='Nombre de la empresa')
    nit            = models.CharField(max_length=25, blank=True, verbose_name='NIT')
    representante  = models.CharField(max_length=160, blank=True, verbose_name='Representante legal')
    # Contacto (aplica para ambos tipos)
    telefono       = models.CharField(max_length=20, blank=True, verbose_name='Teléfono')
    email          = models.EmailField(blank=True, verbose_name='Correo electrónico')
    ciudad         = models.CharField(max_length=80, blank=True, verbose_name='Ciudad')
    activo         = models.BooleanField(default=True, verbose_name='Activo')
    notas          = models.TextField(blank=True, verbose_name='Notas')
    fecha_registro = models.DateField(null=True, blank=True, verbose_name='Fecha de registro')
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        db_table            = 'donantes'
        verbose_name        = 'Donante'
        verbose_name_plural = 'Donantes'
        ordering            = ['-created_at']

    def __str__(self):
        if self.tipo_donante == 'empresa':
            return f'{self.nombre_empresa} (Empresa)'
        return str(self.persona) if self.persona else 'Donante sin nombre'


class Donacion(models.Model):
    TIPO_DONACION = [
        ('dinero',        'Dinero'),
        ('alimentos',     'Alimentos'),
        ('ropa',          'Ropa'),
        ('servicios',     'Servicios'),
        ('medicamentos',  'Medicamentos'),
        ('otro',          'Otro'),
    ]
    ESTADO = [
        ('recibida',  'Recibida'),
        ('procesada', 'Procesada'),
        ('asignada',  'Asignada'),
    ]

    donante        = models.ForeignKey(Donante, on_delete=models.CASCADE,
                                       related_name='donaciones', verbose_name='Donante')
    proyecto       = models.ForeignKey('proyectos.Proyecto', on_delete=models.SET_NULL,
                                       null=True, blank=True, related_name='donaciones',
                                       verbose_name='Proyecto asociado')
    tipo_donacion  = models.CharField(max_length=30, choices=TIPO_DONACION, verbose_name='Tipo de donación')
    monto          = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True,
                                         verbose_name='Monto', help_text='Solo para donaciones en dinero')
    descripcion    = models.TextField(blank=True, verbose_name='Descripción',
                                      help_text='Descripción de la donación en especie')
    fecha_donacion = models.DateField(verbose_name='Fecha de donación')
    comprobante    = models.FileField(upload_to='donaciones/comprobantes/', null=True, blank=True,
                                      verbose_name='Comprobante')
    estado         = models.CharField(max_length=20, choices=ESTADO, default='recibida', verbose_name='Estado')
    registrado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True,
                                       related_name='donaciones_registradas', verbose_name='Registrado por')
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'donaciones'
        verbose_name        = 'Donación'
        verbose_name_plural = 'Donaciones'
        ordering            = ['-fecha_donacion']

    def __str__(self):
        if self.tipo_donacion == 'dinero' and self.monto:
            return f'{self.donante} — ${self.monto:,.0f} ({self.fecha_donacion})'
        return f'{self.donante} — {self.get_tipo_donacion_display()} ({self.fecha_donacion})'
