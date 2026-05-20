from rest_framework.routers import DefaultRouter
from .views import EventViewSet, AttendanceViewSet, EventActViewSet, EvidenceViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='events')
router.register(r'attendances', AttendanceViewSet, basename='attendances')
router.register(r'event-acts', EventActViewSet, basename='event-acts')
router.register(r'evidences', EvidenceViewSet, basename='evidences')

urlpatterns = router.urls
