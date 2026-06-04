from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    EventViewSet,
    AttendanceViewSet,
    EventActViewSet,
    EvidenceViewSet,
    PublicEventListView,
)

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='events')
router.register(r'attendances', AttendanceViewSet, basename='attendances')
router.register(r'event-acts', EventActViewSet, basename='event-acts')
router.register(r'evidences', EvidenceViewSet, basename='evidences')

urlpatterns = [
    path('public/events/', PublicEventListView.as_view(), name='public-events'),
]

urlpatterns += router.urls
