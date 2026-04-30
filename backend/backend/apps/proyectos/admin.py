from django.contrib import admin
from .models import Proyecto, ProyectoBeneficiario


class ProyectoBeneficiarioInline(admin.TabularInline):
    model = ProyectoBeneficiario
    extra = 0


@admin.register(Proyecto)
class ProyectoAdmin(admin.ModelAdmin):
    list_display  = ['nombre', 'estado', 'fecha_inicio', 'fecha_fin',
                     'presupuesto', 'monto_recaudado', 'responsable']
    list_filter   = ['estado']
    search_fields = ['nombre', 'descripcion']
    inlines       = [ProyectoBeneficiarioInline]
