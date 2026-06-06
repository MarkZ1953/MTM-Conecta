from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import BlogPostViewSet, PublicBlogPostDetailView, PublicBlogPostListView


router = DefaultRouter()
router.register(r'blog-posts', BlogPostViewSet, basename='blog-posts')

urlpatterns = [
    path('public/blog/posts/', PublicBlogPostListView.as_view(), name='public-blog-posts'),
    path('public/blog/posts/<slug:slug>/', PublicBlogPostDetailView.as_view(), name='public-blog-post-detail'),
]

urlpatterns += router.urls

