from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, RolViewSet, PermisoViewSet, UsuarioRolViewSet, AuditoriaViewSet

router = DefaultRouter()
router.register(r'usuarios',      UsuarioViewSet,    basename='usuario')
router.register(r'roles',         RolViewSet,        basename='rol')
router.register(r'permisos',      PermisoViewSet,    basename='permiso')
router.register(r'usuarios-roles', UsuarioRolViewSet, basename='usuario-rol')
router.register(r'auditoria',     AuditoriaViewSet,  basename='auditoria')

urlpatterns = router.urls
