from django.db import models
from apps.beneficiarios.models import Acudiente, Beneficiario
from apps.usuarios.models import Usuario


class Consentimiento(models.Model):
    """
    Consentimiento informado de uso de imagen y datos.
    Cubre tanto adultos como representantes legales de menores de edad
    según los formularios oficiales de la Fundación MTM.
    """
    TIPO = [
        ('adulto',      'Adulto'),
        ('menor_edad',  'Menor de edad'),
    ]
    TIPO_DOCUMENTO_MENOR = [
        ('TI', 'Tarjeta de Identidad'),
        ('RC', 'Registro Civil'),
        ('CE', 'Cédula de Extranjería'),
    ]

    tipo            = models.CharField(max_length=20, choices=TIPO, verbose_name='Tipo de consentimiento')
    beneficiario    = models.ForeignKey(Beneficiario, on_delete=models.SET_NULL, null=True, blank=True,
                                        related_name='consentimientos', verbose_name='Beneficiario')
    acudiente       = models.ForeignKey(Acudiente, on_delete=models.SET_NULL, null=True, blank=True,
                                        related_name='consentimientos', verbose_name='Acudiente')

    # ── Datos del firmante ────────────────────────────────────────
    firmante_nombre       = models.CharField(max_length=160, verbose_name='Nombre del firmante')
    firmante_cedula       = models.CharField(max_length=20, verbose_name='Cédula del firmante')
    firmante_ciudad_exp   = models.CharField(max_length=80, blank=True, verbose_name='Ciudad de expedición')
    firmante_telefono     = models.CharField(max_length=20, blank=True, verbose_name='Teléfono del firmante')
    firmante_es_rep_legal = models.BooleanField(default=False, verbose_name='¿Es representante legal?')

    # ── Datos del menor (solo cuando tipo = menor_edad) ───────────
    menor_nombre           = models.CharField(max_length=160, blank=True, verbose_name='Nombre del menor')
    menor_tipo_documento   = models.CharField(max_length=20, choices=TIPO_DOCUMENTO_MENOR,
                                              blank=True, verbose_name='Tipo de documento del menor')
    menor_numero_documento = models.CharField(max_length=20, blank=True,
                                              verbose_name='Número de documento del menor')

    # ── Autorizaciones ────────────────────────────────────────────
    acepta_uso_imagen        = models.BooleanField(default=False, verbose_name='Autoriza uso de imagen')
    acepta_datos_sensibles   = models.BooleanField(default=False, verbose_name='Autoriza datos sensibles')
    acepta_publicacion_redes = models.BooleanField(default=False, verbose_name='Autoriza publicación en redes')

    # ── Firma ─────────────────────────────────────────────────────
    ciudad_firma     = models.CharField(max_length=80, blank=True, verbose_name='Ciudad de firma')
    fecha_firma      = models.DateField(verbose_name='Fecha de firma')
    firma_imagen     = models.ImageField(upload_to='consentimientos/firmas/', null=True, blank=True,
                                         verbose_name='Imagen de firma')

    registrado_por   = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True,
                                         related_name='consentimientos_registrados', verbose_name='Registrado por')
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'consentimientos'
        verbose_name        = 'Consentimiento informado'
        verbose_name_plural = 'Consentimientos informados'
        ordering            = ['-fecha_firma']

    def __str__(self):
        return f'Consentimiento {self.get_tipo_display()} — {self.firmante_nombre} ({self.fecha_firma})'
