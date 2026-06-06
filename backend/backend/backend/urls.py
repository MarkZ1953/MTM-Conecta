from rest_framework.routers import DefaultRouter
from django.urls import path, include
from access.views import RoleViewSet, UserViewSet
from django.contrib import admin

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="users")
router.register(r"roles", RoleViewSet, basename="roles")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('access.urls')),
    path("", include('app.urls')),
    path("", include(router.urls)),
    path("", include('beneficiaries.urls')),
    path("", include('donations.urls')),
    path("", include('projects.urls')),
    path("", include('audits.urls')),
    path("", include('reports.urls')),
    path("", include('events.urls')),
    path("", include('campaigns.urls')),
    path("", include('cap_collection.urls')),
    path("", include('volunteers.urls')),
    path("", include('blog.urls')),
]
