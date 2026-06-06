from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from access.permissions import DjangoModelPermissionsWithView
from app.mixins.export_mixin import ExportMixin
from app.mixins.soft_delete_mixin import SoftDeleteMixin
from .filters import NewsletterSubscriberFilter
from .models import NewsletterSubscriber
from .paginations import NewsletterSubscriberPagination
from .serializers import NewsletterSubscriberSerializer, PublicNewsletterSubscriberSerializer


class NewsletterSubscriberViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.filter(is_active=True)
    serializer_class = NewsletterSubscriberSerializer
    pagination_class = NewsletterSubscriberPagination
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    permission_classes = [DjangoModelPermissionsWithView]
    soft_delete_model_name = "el suscriptor"
    soft_delete_model_name_plural = "los suscriptores"

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = NewsletterSubscriberFilter
    search_fields = ['email', 'name', 'notes']
    ordering_fields = ['id', 'email', 'name', 'status', 'origin', 'subscribed_at', 'created_at']
    ordering = ['-subscribed_at', '-created_at']


class PublicNewsletterSubscribeView(CreateAPIView):
    serializer_class = PublicNewsletterSubscriberSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber = serializer.save()
        output = self.get_serializer(subscriber)
        return Response(
            {
                "message": "Suscripción registrada correctamente.",
                "subscriber": output.data,
            },
            status=status.HTTP_201_CREATED,
        )
