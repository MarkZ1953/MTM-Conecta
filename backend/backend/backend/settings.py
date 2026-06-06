from datetime import timedelta
from decouple import config
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config("DJANGO_DEBUG", default=True, cast=bool)

def csv_config(name, default):
    return [
        item.strip()
        for item in config(name, default=default).split(",")
        if item.strip()
    ]


def csv_config_lower(name, default):
    return [item.lower() for item in csv_config(name, default)]


CORS_ALLOWED_ORIGINS = csv_config(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
)

CORS_ALLOW_CREDENTIALS = True

CORS_EXPOSE_HEADERS = [
    "Content-Disposition",
]

CSRF_TRUSTED_ORIGINS = csv_config(
    "CSRF_TRUSTED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
)

ALLOWED_HOSTS = csv_config(
    "DJANGO_ALLOWED_HOSTS",
    "localhost,127.0.0.1",
)

COOKIE_SECURE = config("COOKIE_SECURE", default=not DEBUG, cast=bool)
COOKIE_SAMESITE = config("COOKIE_SAMESITE", default="Lax")
COOKIE_DOMAIN = config("COOKIE_DOMAIN", default=None)
CSRF_COOKIE_SECURE = COOKIE_SECURE
CSRF_COOKIE_SAMESITE = COOKIE_SAMESITE
CSRF_COOKIE_DOMAIN = COOKIE_DOMAIN
CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_SECURE = COOKIE_SECURE
SESSION_COOKIE_SAMESITE = COOKIE_SAMESITE
SESSION_COOKIE_DOMAIN = COOKIE_DOMAIN


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'django_filters',
    'simple_history',
    'corsheaders',
    'beneficiaries',
    'donations',
    'access',
    'projects',
    'audits',
    'reports',
    'events',
    'cloudinary_storage',
    'cloudinary',
    'anymail',
    'campaigns',
    'cap_collection',
    'volunteers',
    'blog',
    'subscribers',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'simple_history.middleware.HistoryRequestMiddleware',
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


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
    }
}

# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'access.auth.CookieJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "BLACKLIST_AFTER_ROTATION": True,
}

# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = 'static/'


# ---------------------------------------------------------------------------
# Cloudinary — almacenamiento de archivos multimedia
# ---------------------------------------------------------------------------

CLOUDINARY_STORAGE = {
    "CLOUD_NAME": config("CLOUDINARY_CLOUD_NAME"),
    "API_KEY": config("CLOUDINARY_API_KEY"),
    "API_SECRET": config("CLOUDINARY_API_SECRET"),
}


UPLOAD_MAX_IMAGE_MB = config("UPLOAD_MAX_IMAGE_MB", default=10, cast=int)
UPLOAD_MAX_DOCUMENT_MB = config("UPLOAD_MAX_DOCUMENT_MB", default=10, cast=int)
UPLOAD_MAX_VIDEO_MB = config("UPLOAD_MAX_VIDEO_MB", default=100, cast=int)

UPLOAD_ALLOWED_IMAGE_TYPES = csv_config_lower(
    "UPLOAD_ALLOWED_IMAGE_TYPES",
    "image/jpeg,image/png,image/webp",
)
UPLOAD_ALLOWED_IMAGE_EXTENSIONS = csv_config_lower(
    "UPLOAD_ALLOWED_IMAGE_EXTENSIONS",
    ".jpg,.jpeg,.png,.webp",
)
UPLOAD_ALLOWED_DOCUMENT_TYPES = csv_config_lower(
    "UPLOAD_ALLOWED_DOCUMENT_TYPES",
    "application/pdf",
)
UPLOAD_ALLOWED_DOCUMENT_EXTENSIONS = csv_config_lower(
    "UPLOAD_ALLOWED_DOCUMENT_EXTENSIONS",
    ".pdf",
)
UPLOAD_ALLOWED_VIDEO_TYPES = csv_config_lower(
    "UPLOAD_ALLOWED_VIDEO_TYPES",
    "video/mp4,video/quicktime,video/webm",
)
UPLOAD_ALLOWED_VIDEO_EXTENSIONS = csv_config_lower(
    "UPLOAD_ALLOWED_VIDEO_EXTENSIONS",
    ".mp4,.mov,.webm",
)

DATA_UPLOAD_MAX_MEMORY_SIZE = (UPLOAD_MAX_VIDEO_MB + 5) * 1024 * 1024

# Django 6 usa STORAGES (no DEFAULT_FILE_STORAGE).
# 'default' = dónde se guardan los archivos subidos (media) → Cloudinary
# 'staticfiles' = CSS/JS estáticos → se quedan locales
STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}


EMAIL_BACKEND = "anymail.backends.brevo.EmailBackend"

ANYMAIL = {
    "BREVO_API_KEY": config("BREVO_API_KEY"),
}

DEFAULT_FROM_EMAIL = config("DEFAULT_FROM_EMAIL")


# ---------------------------------------------------------------------------
# Google Identity Services
# ---------------------------------------------------------------------------

GOOGLE_CLIENT_ID = config("GOOGLE_CLIENT_ID", default="")
