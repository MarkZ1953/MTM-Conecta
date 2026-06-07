from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    InstagramPostViewSet,
    PublicInstagramPostDetailView,
    PublicInstagramPostListView,
)

router = DefaultRouter()
router.register(r"instagram-posts", InstagramPostViewSet, basename="instagram-posts")

urlpatterns = [
    path('public/instagram-posts/', PublicInstagramPostListView.as_view(), name='public-instagram-post-list'),
    path('public/instagram-posts/<str:instagram_id>/', PublicInstagramPostDetailView.as_view(), name='public-instagram-post-detail'),
]

urlpatterns += router.urls

