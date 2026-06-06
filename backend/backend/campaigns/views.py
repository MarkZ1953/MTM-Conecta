from django_filters.rest_framework import DjangoFilterBackend
from django.core.mail import EmailMultiAlternatives
from django.utils import timezone
from app.mixins.soft_delete_mixin import SoftDeleteMixin
from app.mixins.export_mixin import ExportMixin
from rest_framework import viewsets, filters, status as http_status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from access.permissions import DjangoModelPermissionsWithView
from audits.service import log_event
from .serializers import CampaignSerializer, CampaignTemplateSerializer
from .paginations import CampaignPagination
from .filters import CampaignFilter
from .models import Campaign, CampaignStatus, CampaignTemplate
from .email_utils import build_html, get_recipient_emails


class CampaignViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Campaign.objects.filter(is_active=True)
    serializer_class = CampaignSerializer
    pagination_class = CampaignPagination
    permission_classes = [DjangoModelPermissionsWithView]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = CampaignFilter
    search_fields = ['subject']
    ordering_fields = ['id', 'subject', 'status', 'sent_at']
    ordering = ['-id']

    @action(detail=True, methods=["post"], url_path="send")
    def send(self, request, pk=None):
        if not request.user.has_perm("campaigns.send_campaign"):
            raise PermissionDenied("No tienes permiso para enviar campañas.")

        campaign = self.get_object()

        # 1. No reenviar una campaña ya enviada
        if campaign.status == CampaignStatus.SENT:
            return Response(
                {"detail": "Esta campaña ya fue enviada."},
                status=http_status.HTTP_400_BAD_REQUEST,
            )

        # 2. Buscar destinatarios
        emails = get_recipient_emails(campaign.recipient_group)
        if not emails:
            return Response(
                {"detail": "No hay destinatarios con correo en el grupo seleccionado."},
                status=http_status.HTTP_400_BAD_REQUEST,
            )

        # 3. Armar el contenido
        html = build_html(campaign)
        text = f"{campaign.subject} — Abre este correo en un cliente compatible con HTML."

        # 4. Marcar como enviando
        campaign.status = CampaignStatus.SENDING
        campaign.save(update_fields=["status"])

        # 5. Enviar (todos en copia oculta)
        try:
            msg = EmailMultiAlternatives(
                subject=campaign.subject,
                body=text,
                from_email=None,          # usa DEFAULT_FROM_EMAIL
                bcc=emails,               # BCC: no se ven entre ellos
            )
            msg.attach_alternative(html, "text/html")
            sent = msg.send()

            campaign.status = CampaignStatus.SENT
            campaign.sent_at = timezone.now()
            campaign.sent_count = len(emails)
            campaign.save(update_fields=["status", "sent_at", "sent_count"])

            log_event(
                request=request,
                user=request.user if request.user.is_authenticated else None,
                action="create",
                instance=campaign,
                description=f"Campaña '{campaign.subject}' enviada a {len(emails)} destinatarios",
            )

            return Response(
                {"message": f"Campaña enviada a {len(emails)} destinatarios.", "sent": sent},
                status=http_status.HTTP_200_OK,
            )

        except Exception as e:
            campaign.status = CampaignStatus.FAILED
            campaign.save(update_fields=["status"])
            return Response(
                {"detail": f"Error al enviar: {str(e)}"},
                status=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CampaignTemplateViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = CampaignTemplate.objects.filter(is_active=True)
    serializer_class = CampaignTemplateSerializer
    pagination_class = CampaignPagination
    permission_classes = [DjangoModelPermissionsWithView]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = ['name']
    ordering_fields = ['id', 'name']
    ordering = ['-id']
