"""
MTM CONECTA — URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from apps.usuarios.views import MtmTokenObtainPairView, LogoutView

# ── Prefijo base de la API ─────────────────────────────────
API = 'api/v1/'

urlpatterns = [
    # Admin de Django
    path('admin/', admin.site.urls),

    # ── Auth JWT ───────────────────────────────────────────
    path(f'{API}auth/login/',   MtmTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path(f'{API}auth/refresh/', TokenRefreshView.as_view(),        name='token_refresh'),
    path(f'{API}auth/logout/',  LogoutView.as_view(),              name='logout'),

    # ── Apps ──────────────────────────────────────────────
    path(f'{API}', include('apps.usuarios.urls')),
    path(f'{API}', include('apps.personas.urls')),
    path(f'{API}', include('apps.beneficiarios.urls')),
    path(f'{API}', include('apps.caracterizaciones.urls')),
    path(f'{API}', include('apps.consentimientos.urls')),
    path(f'{API}', include('apps.programas.urls')),
    path(f'{API}', include('apps.donantes.urls')),
    path(f'{API}', include('apps.proyectos.urls')),
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
