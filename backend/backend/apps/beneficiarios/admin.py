from django.contrib import admin
from .models import Acudiente, OcupacionLaboral, Beneficiario, AcudienteBeneficiario


class OcupacionLaboralInline(admin.StackedInline):
    model = OcupacionLaboral
    extra = 0


@admin.register(Acudiente)
class AcudienteAdmin(admin.ModelAdmin):
    list_display  = ['persona', 'estado_civil', 'profesion', 'numero_hijos']
    search_fields = ['persona__primer_nombre', 'persona__primer_apellido', 'persona__numero_documento']
    inlines       = [OcupacionLaboralInline]


class RelacionInline(admin.TabularInline):
    model   = AcudienteBeneficiario
    extra   = 0
    fk_name = 'beneficiario'


@admin.register(Beneficiario)
class BeneficiarioAdmin(admin.ModelAdmin):
    list_display  = ['persona', 'diagnostico', 'grado_escolar', 'activo', 'fecha_ingreso_hosp']
    list_filter   = ['activo']
    search_fields = ['persona__primer_nombre', 'persona__primer_apellido',
                     'persona__numero_documento', 'diagnostico']
    inlines       = [RelacionInline]
