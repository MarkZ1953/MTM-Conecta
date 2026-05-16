from rest_framework.routers import DefaultRouter
from .views import DonorViewSet, DonationViewSet

router = DefaultRouter()
router.register(r'donors', DonorViewSet, basename='donors')
router.register(r'donations', DonationViewSet, basename='donations')

urlpatterns = router.urls