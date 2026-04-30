from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VoluntarioViewSet

router = DefaultRouter()
router.register(r'voluntarios', VoluntarioViewSet, basename='voluntarios')

urlpatterns = [
    path('', include(router.urls)),
]
