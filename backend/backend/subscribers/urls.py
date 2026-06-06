from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import NewsletterSubscriberViewSet, PublicNewsletterSubscribeView


router = DefaultRouter()
router.register(r'subscribers', NewsletterSubscriberViewSet, basename='subscribers')

urlpatterns = [
    path('public/newsletter/subscribe/', PublicNewsletterSubscribeView.as_view(), name='public-newsletter-subscribe'),
]

urlpatterns += router.urls
