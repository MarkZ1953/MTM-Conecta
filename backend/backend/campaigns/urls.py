from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, CampaignTemplateViewSet

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaigns')
router.register(r'campaign-templates', CampaignTemplateViewSet, basename='campaign-templates')

urlpatterns = router.urls
