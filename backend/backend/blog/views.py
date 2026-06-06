from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny

from app.mixins.export_mixin import ExportMixin
from app.mixins.soft_delete_mixin import SoftDeleteMixin
from .filters import BlogPostFilter
from .models import BlogPost
from .paginations import BlogPostPagination
from .serializers import BlogPostSerializer, PublicBlogPostSerializer


class BlogPostViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = BlogPost.objects.filter(is_active=True)
    serializer_class = BlogPostSerializer
    pagination_class = BlogPostPagination
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    soft_delete_model_name = "la publicación"
    soft_delete_model_name_plural = "las publicaciones"

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = BlogPostFilter
    search_fields = ['title', 'summary', 'content']
    ordering_fields = ['id', 'title', 'published_at', 'status', 'created_at']
    ordering = ['-published_at', '-created_at']


class PublicBlogPostListView(ListAPIView):
    serializer_class = PublicBlogPostSerializer
    permission_classes = [AllowAny]
    pagination_class = BlogPostPagination

    def get_queryset(self):
        return BlogPost.objects.filter(
            is_active=True,
            status=BlogPost.STATUS_PUBLISHED,
        ).order_by('-published_at', '-created_at')


class PublicBlogPostDetailView(RetrieveAPIView):
    serializer_class = PublicBlogPostSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return BlogPost.objects.filter(
            is_active=True,
            status=BlogPost.STATUS_PUBLISHED,
        )

