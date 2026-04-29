from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgramaViewSet, InscripcionProgramaViewSet, SeguimientoViewSet

router = DefaultRouter()
router.register(r'programas',      ProgramaViewSet,           basename='programa')
router.register(r'inscripciones',  InscripcionProgramaViewSet, basename='inscripcion')
router.register(r'seguimientos',   SeguimientoViewSet,        basename='seguimiento')

urlpatterns = router.urls
