from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    """
    Usuario del sistema MTM Conecta.
    Usa email como identificador en lugar de username.

    El control de acceso por módulo se gestiona mediante
    django.contrib.auth.models.Group (grupos nativos de Django),
    accesibles vía usuario.groups.all() — no se usan tablas Rol/Permiso custom.

    Grupos sugeridos para la fundación:
      - Administrador   → acceso total
      - Coordinador     → gestión de beneficiarios y programas
      - Operador        → registro y consulta
      - Consultor       → solo lectura
    """
    email           = models.EmailField(unique=True, verbose_name='Correo electrónico')
    primer_nombre   = models.CharField(max_length=80, verbose_name='Primer nombre')
    primer_apellido = models.CharField(max_length=80, verbose_name='Primer apellido')
    is_active       = models.BooleanField(default=True, verbose_name='Activo')
    is_staff        = models.BooleanField(default=False, verbose_name='Staff')
    ultimo_acceso   = models.DateTimeField(null=True, blank=True, verbose_name='Último acceso')
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    objects = UsuarioManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['primer_nombre', 'primer_apellido']

    class Meta:
        db_table            = 'usuarios'
        verbose_name        = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering            = ['primer_apellido', 'primer_nombre']

    def __str__(self):
        return f'{self.primer_nombre} {self.primer_apellido} <{self.email}>'

    @property
    def nombre_completo(self):
        return f'{self.primer_nombre} {self.primer_apellido}'

    @property
    def rol_display(self):
        """Retorna el nombre del primer grupo asignado (rol principal)."""
        grupo = self.groups.first()
        return grupo.name if grupo else 'Sin rol'


class Auditoria(models.Model):
    """
    Registro de trazabilidad de acciones realizadas en el sistema.
    Cumple con el principio de transparencia de la Ley 1581 de 2012.
    """
    ACCIONES = [
        ('CREATE', 'Crear'),
        ('UPDATE', 'Actualizar'),
        ('DELETE', 'Eliminar'),
        ('LOGIN',  'Inicio de sesión'),
        ('LOGOUT', 'Cierre de sesión'),
        ('VIEW',   'Consulta'),
    ]

    usuario          = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True,
                                         related_name='auditoria', verbose_name='Usuario')
    accion           = models.CharField(max_length=20, choices=ACCIONES, verbose_name='Acción')
    tabla_afectada   = models.CharField(max_length=100, blank=True, verbose_name='Tabla afectada')
    registro_id      = models.BigIntegerField(null=True, blank=True, verbose_name='ID del registro')
    datos_anteriores = models.JSONField(null=True, blank=True, verbose_name='Datos anteriores')
    datos_nuevos     = models.JSONField(null=True, blank=True, verbose_name='Datos nuevos')
    ip_address       = models.GenericIPAddressField(null=True, blank=True, verbose_name='IP')
    user_agent       = models.CharField(max_length=255, blank=True, verbose_name='User Agent')
    created_at       = models.DateTimeField(auto_now_add=True, verbose_name='Fecha')

    class Meta:
        db_table            = 'auditoria'
        verbose_name        = 'Registro de auditoría'
        verbose_name_plural = 'Auditoría'
        ordering            = ['-created_at']

    def __str__(self):
        return f'[{self.accion}] {self.tabla_afectada} #{self.registro_id} — {self.created_at:%Y-%m-%d %H:%M}'
