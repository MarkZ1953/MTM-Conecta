from django.contrib import admin
from .models import Persona, ContactoEmergencia


class ContactoEmergenciaInline(admin.TabularInline):
    model = ContactoEmergencia
    extra = 1


@admin.register(Persona)
class PersonaAdmin(admin.ModelAdmin):
    list_display  = ['nombre_completo', 'tipo_persona', 'tipo_documento', 'numero_documento', 'telefono', 'email']
    list_filter   = ['tipo_persona', 'sexo', 'tipo_documento']
    search_fields = ['primer_nombre', 'primer_apellido', 'numero_documento', 'email']
    inlines       = [ContactoEmergenciaInline]
