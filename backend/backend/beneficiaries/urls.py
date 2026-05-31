from rest_framework.routers import DefaultRouter
from .views import BeneficiaryViewSet, GuardianViewSet, AidLogEntryViewSet

router = DefaultRouter()
router.register(r'beneficiaries', BeneficiaryViewSet, basename='beneficiaries')
router.register(r'guardians', GuardianViewSet, basename='guardians')
router.register(r'aid-log', AidLogEntryViewSet, basename='aid-log')

urlpatterns = router.urls