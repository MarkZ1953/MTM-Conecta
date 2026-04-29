from django.contrib import admin
from .models import Consentimiento


@admin.register(Consentimiento)
class ConsentimientoAdmin(admin.ModelAdmin):
    list_display   = ['tipo', 'firmante_nombre', 'firmante_cedula', 'fecha_firma',
                      'acepta_uso_imagen', 'acepta_datos_sensibles']
    list_filter    = ['tipo', 'acepta_uso_imagen', 'acepta_publicacion_redes']
    search_fields  = ['firmante_nombre', 'firmante_cedula', 'menor_nombre']
    date_hierarchy = 'fecha_firma'
