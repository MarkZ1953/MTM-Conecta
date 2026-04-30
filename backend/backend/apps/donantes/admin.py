from django.contrib import admin
from .models import Donante, Donacion


@admin.register(Donante)
class DonanteAdmin(admin.ModelAdmin):
    list_display  = ['__str__', 'tipo_donante', 'telefono', 'email', 'ciudad', 'activo']
    list_filter   = ['tipo_donante', 'activo', 'ciudad']
    search_fields = ['nombre_empresa', 'nit', 'persona__primer_nombre', 'persona__primer_apellido']


@admin.register(Donacion)
class DonacionAdmin(admin.ModelAdmin):
    list_display   = ['donante', 'tipo_donacion', 'monto', 'fecha_donacion', 'estado', 'proyecto']
    list_filter    = ['tipo_donacion', 'estado']
    search_fields  = ['donante__nombre_empresa', 'donante__persona__primer_apellido']
    date_hierarchy = 'fecha_donacion'
