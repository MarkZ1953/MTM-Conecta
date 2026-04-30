from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Auditoria


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    ordering        = ['email']
    list_display    = ['email', 'primer_nombre', 'primer_apellido', 'is_active', 'is_staff', 'ultimo_acceso']
    list_filter     = ['is_active', 'is_staff']
    search_fields   = ['email', 'primer_nombre', 'primer_apellido']
    fieldsets = (
        (None,           {'fields': ('email', 'password')}),
        ('Informacion',  {'fields': ('primer_nombre', 'primer_apellido')}),
        ('Permisos',     {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas',       {'fields': ('ultimo_acceso', 'created_at', 'updated_at')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'primer_nombre', 'primer_apellido', 'password1', 'password2'),
        }),
    )
    readonly_fields = ['ultimo_acceso', 'created_at', 'updated_at']


@admin.register(Auditoria)
class AuditoriaAdmin(admin.ModelAdmin):
    list_display    = ['accion', 'tabla_afectada', 'registro_id', 'usuario', 'ip_address', 'created_at']
    list_filter     = ['accion', 'tabla_afectada']
    search_fields   = ['usuario__email', 'tabla_afectada']
    readonly_fields = ['usuario', 'accion', 'tabla_afectada', 'registro_id',
                       'datos_anteriores', 'datos_nuevos', 'ip_address', 'user_agent', 'created_at']
