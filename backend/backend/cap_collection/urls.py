from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, CollectionPointViewSet, CollectionRequestViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='companies')
router.register(r'collection-points', CollectionPointViewSet, basename='collection-points')
router.register(r'collection-requests', CollectionRequestViewSet, basename='collection-requests')

urlpatterns = router.urls
