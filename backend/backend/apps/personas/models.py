from django.db import models


class Persona(models.Model):
    TIPO_PERSONA = [
        ('acudiente',    'Acudiente'),
        ('beneficiario', 'Beneficiario'),
        ('donante',      'Donante'),
        ('staff',        'Staff'),
        ('voluntario',   'Voluntario'),
    ]
    TIPO_DOCUMENTO = [
        ('CC',        'Cédula de Ciudadanía'),
        ('TI',        'Tarjeta de Identidad'),
        ('RC',        'Registro Civil'),
        ('CE',        'Cédula de Extranjería'),
        ('Pasaporte', 'Pasaporte'),
        ('NIT',       'NIT'),
    ]
    SEXO = [
        ('F', 'Femenino'),
        ('M', 'Masculino'),
        ('O', 'Otro'),
    ]

    tipo_persona       = models.CharField(max_length=25, choices=TIPO_PERSONA, verbose_name='Tipo de persona')
    primer_nombre      = models.CharField(max_length=80, verbose_name='Primer nombre')
    segundo_nombre     = models.CharField(max_length=80, blank=True, verbose_name='Segundo nombre')
    primer_apellido    = models.CharField(max_length=80, verbose_name='Primer apellido')
    segundo_apellido   = models.CharField(max_length=80, blank=True, verbose_name='Segundo apellido')
    tipo_documento     = models.CharField(max_length=20, choices=TIPO_DOCUMENTO, blank=True, verbose_name='Tipo de documento')
    numero_documento   = models.CharField(max_length=25, unique=True, null=True, blank=True, verbose_name='Número de documento')
    ciudad_exp_documento = models.CharField(max_length=80, blank=True, verbose_name='Ciudad de expedición')
    fecha_nacimiento   = models.DateField(null=True, blank=True, verbose_name='Fecha de nacimiento')
    sexo               = models.CharField(max_length=1, choices=SEXO, blank=True, verbose_name='Sexo')
    telefono           = models.CharField(max_length=20, blank=True, verbose_name='Teléfono')
    email              = models.EmailField(blank=True, verbose_name='Correo electrónico')
    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    class Meta:
        db_table            = 'personas'
        verbose_name        = 'Persona'
        verbose_name_plural = 'Personas'
        ordering            = ['primer_apellido', 'primer_nombre']

    def __str__(self):
        return f'{self.primer_nombre} {self.primer_apellido} ({self.numero_documento or "sin doc."})'

    @property
    def nombre_completo(self):
        partes = [self.primer_nombre, self.segundo_nombre, self.primer_apellido, self.segundo_apellido]
        return ' '.join(p for p in partes if p)


class ContactoEmergencia(models.Model):
    persona    = models.ForeignKey(Persona, on_delete=models.CASCADE,
                                   related_name='contactos_emergencia', verbose_name='Persona')
    nombre     = models.CharField(max_length=160, verbose_name='Nombre completo')
    telefono   = models.CharField(max_length=20, verbose_name='Teléfono')
    parentesco = models.CharField(max_length=60, blank=True, verbose_name='Parentesco')

    class Meta:
        db_table            = 'contactos_emergencia'
        verbose_name        = 'Contacto de emergencia'
        verbose_name_plural = 'Contactos de emergencia'

    def __str__(self):
        return f'{self.nombre} ({self.parentesco}) — Tel: {self.telefono}'
