from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CaracterizacionViewSet, MiembroFamiliaViewSet

router = DefaultRouter()
router.register(r'caracterizaciones', CaracterizacionViewSet, basename='caracterizacion')
router.register(r'miembros-familia',  MiembroFamiliaViewSet,  basename='miembro-familia')

urlpatterns = router.urls
