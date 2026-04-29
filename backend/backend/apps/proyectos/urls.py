from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProyectoViewSet, ProyectoBeneficiarioViewSet

router = DefaultRouter()
router.register(r'proyectos',             ProyectoViewSet,           basename='proyecto')
router.register(r'proyectos-beneficiarios', ProyectoBeneficiarioViewSet, basename='proyecto-beneficiario')

urlpatterns = router.urls
