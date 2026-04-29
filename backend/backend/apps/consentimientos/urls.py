from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConsentimientoViewSet

router = DefaultRouter()
router.register(r'consentimientos', ConsentimientoViewSet, basename='consentimiento')

urlpatterns = router.urls
