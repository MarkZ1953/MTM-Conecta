from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AcudienteViewSet, OcupacionLaboralViewSet, BeneficiarioViewSet, AcudienteBeneficiarioViewSet

router = DefaultRouter()
router.register(r'acudientes',            AcudienteViewSet,          basename='acudiente')
router.register(r'ocupacion-laboral',     OcupacionLaboralViewSet,   basename='ocupacion-laboral')
router.register(r'beneficiarios',         BeneficiarioViewSet,       basename='beneficiario')
router.register(r'relaciones-acudiente',  AcudienteBeneficiarioViewSet, basename='relacion-acudiente')

urlpatterns = router.urls
