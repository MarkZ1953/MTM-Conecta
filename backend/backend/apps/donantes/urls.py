from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DonanteViewSet, DonacionViewSet

router = DefaultRouter()
router.register(r'donantes',   DonanteViewSet,  basename='donante')
router.register(r'donaciones', DonacionViewSet, basename='donacion')

urlpatterns = router.urls
