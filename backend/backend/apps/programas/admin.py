from django.contrib import admin
from .models import Programa, InscripcionPrograma, Seguimiento


@admin.register(Programa)
class ProgramaAdmin(admin.ModelAdmin):
    list_display  = ['nombre', 'activo']
    list_filter   = ['activo']
    search_fields = ['nombre']


@admin.register(InscripcionPrograma)
class InscripcionProgramaAdmin(admin.ModelAdmin):
    list_display   = ['beneficiario', 'programa', 'estado', 'fecha_inscripcion', 'fecha_egreso']
    list_filter    = ['programa', 'estado']
    search_fields  = ['beneficiario__persona__primer_apellido', 'beneficiario__persona__numero_documento']
    date_hierarchy = 'fecha_inscripcion'


@admin.register(Seguimiento)
class SeguimientoAdmin(admin.ModelAdmin):
    list_display   = ['beneficiario', 'programa', 'tipo_seguimiento', 'estado', 'fecha_seguimiento', 'usuario']
    list_filter    = ['tipo_seguimiento', 'estado', 'programa']
    search_fields  = ['beneficiario__persona__primer_apellido']
    date_hierarchy = 'fecha_seguimiento'
