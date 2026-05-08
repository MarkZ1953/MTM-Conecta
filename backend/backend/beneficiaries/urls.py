from rest_framework.routers import DefaultRouter
from .views import BeneficiaryViewSet, GuardianViewSet

router = DefaultRouter()
router.register(r'beneficiaries', BeneficiaryViewSet, basename='beneficiaries')
router.register(r'guardians', GuardianViewSet, basename='guardians')

urlpatterns = router.urls