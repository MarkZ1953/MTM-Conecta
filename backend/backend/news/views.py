from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from access.permissions import DjangoModelPermissionsWithView
from app.mixins.export_mixin import ExportMixin
from app.mixins.soft_delete_mixin import SoftDeleteMixin
from .filters import InstagramPostFilter
from .models import InstagramPost
from .paginations import InstagramPostPagination
from .serializers import InstagramPostSerializer, PublicInstagramPostSerializer
from .services import InstagramSyncError, sync_instagram_posts


class InstagramPostViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = InstagramPost.objects.filter(is_active=True)
    serializer_class = InstagramPostSerializer
    pagination_class = InstagramPostPagination
    permission_classes = [DjangoModelPermissionsWithView]
    soft_delete_model_name = "la publicación de Instagram"
    soft_delete_model_name_plural = "las publicaciones de Instagram"

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = InstagramPostFilter
    search_fields = ['caption', 'instagram_id']
    ordering_fields = ['id', 'timestamp', 'media_type', 'is_visible', 'is_featured', 'created_at']
    ordering = ['-timestamp', '-created_at']

    @action(detail=False, methods=['post'], url_path='sync')
    def sync(self, request):
        try:
            result = sync_instagram_posts()
        except InstagramSyncError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'message': 'Publicaciones de Instagram sincronizadas.',
            **result,
        })


class PublicInstagramPostListView(ListAPIView):
    serializer_class = PublicInstagramPostSerializer
    permission_classes = [AllowAny]
    pagination_class = InstagramPostPagination

    def get_queryset(self):
        return InstagramPost.objects.filter(
            is_active=True,
            is_visible=True,
        ).order_by('-is_featured', '-timestamp', '-created_at')


class PublicInstagramPostDetailView(RetrieveAPIView):
    serializer_class = PublicInstagramPostSerializer
    permission_classes = [AllowAny]
    lookup_field = 'instagram_id'

    def get_queryset(self):
        return InstagramPost.objects.filter(
            is_active=True,
            is_visible=True,
        )

