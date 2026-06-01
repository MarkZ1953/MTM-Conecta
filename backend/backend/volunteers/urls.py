from rest_framework.routers import DefaultRouter
from .views import VolunteerViewSet, VolunteerAvailabilityViewSet, VolunteerTaskViewSet

router = DefaultRouter()
router.register(r'volunteers', VolunteerViewSet, basename='volunteers')
router.register(r'volunteer-availabilities', VolunteerAvailabilityViewSet, basename='volunteer-availabilities')
router.register(r'volunteer-tasks', VolunteerTaskViewSet, basename='volunteer-tasks')

urlpatterns = router.urls
