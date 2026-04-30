from django.contrib import admin
from .models import Caracterizacion, MiembroFamilia


class MiembroFamiliaInline(admin.TabularInline):
    model = MiembroFamilia
    extra = 1


@admin.register(Caracterizacion)
class CaracterizacionAdmin(admin.ModelAdmin):
    list_display   = ['beneficiario', 'acudiente', 'fecha_registro', 'municipio', 'departamento', 'estrato']
    list_filter    = ['zona_residencia', 'tipo_vivienda', 'departamento']
    search_fields  = ['beneficiario__persona__primer_apellido', 'municipio', 'departamento']
    date_hierarchy = 'fecha_registro'
    inlines        = [MiembroFamiliaInline]
