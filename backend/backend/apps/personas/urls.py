from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonaViewSet, ContactoEmergenciaViewSet

router = DefaultRouter()
router.register(r'personas',              PersonaViewSet,           basename='persona')
router.register(r'contactos-emergencia',  ContactoEmergenciaViewSet, basename='contacto-emergencia')

urlpatterns = router.urls
