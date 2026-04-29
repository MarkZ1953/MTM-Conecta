from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, GroupViewSet, AuditoriaViewSet

router = DefaultRouter()
router.register(r'usuarios',      UsuarioViewSet,    basename='usuario')
router.register(r'grupos',        GroupViewSet,      basename='grupo')
router.register(r'auditoria',     AuditoriaViewSet,  basename='auditoria')

urlpatterns = router.urls
