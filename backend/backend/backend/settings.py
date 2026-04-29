"""
MTM CONECTA — Django Settings
Fundación Mujeres Trabajando por el Meta
"""

from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv

# ─── Rutas ────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# Cargar .env desde la raíz del backend
load_dotenv(BASE_DIR.parent / '.env')

# ─── Seguridad ────────────────────────────────────────────
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-insecure-key-solo-desarrollo')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# ─── Aplicaciones ─────────────────────────────────────────
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'django_filters',
]

LOCAL_APPS = [
    'apps.usuarios',
    'apps.personas',
    'apps.beneficiarios',
    'apps.caracterizaciones',
    'apps.consentimientos',
    'apps.programas',
    'apps.donantes',
    'apps.proyectos',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# ─── Middleware ───────────────────────────────────────────
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',          # CORS antes de CommonMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ─── Base de datos ────────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': BASE_DIR / os.getenv('DB_NAME', 'db.sqlite3'),
    }
}

# ─── Modelo de usuario personalizado ─────────────────────
AUTH_USER_MODEL = 'usuarios.Usuario'

# ─── Django REST Framework ────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DATETIME_FORMAT': '%Y-%m-%dT%H:%M:%S',
    'DATE_FORMAT': '%Y-%m-%d',
}

# ─── JWT ──────────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':  timedelta(minutes=int(os.getenv('JWT_ACCESS_TOKEN_LIFETIME_MINUTES', 60))),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=int(os.getenv('JWT_REFRESH_TOKEN_LIFETIME_DAYS', 7))),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# ─── CORS ─────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = os.getenv(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:5173,http://127.0.0.1:5173'
).split(',')
CORS_ALLOW_CREDENTIALS = True

# ─── Internacionalización ─────────────────────────────────
LANGUAGE_CODE = os.getenv('LANGUAGE_CODE', 'es-co')
TIME_ZONE     = os.getenv('TIME_ZONE', 'America/Bogota')
USE_I18N = True
USE_TZ   = True

# ─── Archivos estáticos y multimedia ─────────────────────
STATIC_URL  = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL  = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ─── Validaciones de contraseña ───────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 8}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
