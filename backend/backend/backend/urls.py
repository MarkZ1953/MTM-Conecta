from rest_framework.routers import DefaultRouter
from django.urls import path, include
from access.views import UserViewSet
from django.contrib import admin

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="users")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('access.urls')),
    path("", include(router.urls)),
    path("", include('beneficiaries.urls')),
    path("", include('donations.urls')),
    path("", include('projects.urls')),
    path("", include('audits.urls')),
    path("", include('reports.urls')),
    path("", include('events.urls')),
    path("", include('campaigns.urls')),
]