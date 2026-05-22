from django.contrib.auth.models import User
from donations.models import Donor
from beneficiaries.models import Guardian
from .models import CampaignContentType, CampaignRecipientGroup


def pdf_thumbnail(url: str) -> str:
    """Convierte la URL de un PDF de Cloudinary en la miniatura de la página 1."""
    base = url.rsplit(".", 1)[0]  # quita la extensión .pdf
    return base.replace("/upload/", "/upload/pg_1,w_600,f_jpg,q_auto/") + ".jpg"


def get_recipient_emails(recipient_group: str) -> list[str]:
    """Devuelve la lista de correos según el grupo elegido."""
    emails: list[str] = []

    if recipient_group in (CampaignRecipientGroup.DONORS, CampaignRecipientGroup.ALL):
        emails += list(
            Donor.objects.filter(is_active=True)
            .exclude(email="").values_list("email", flat=True)
        )

    if recipient_group in (CampaignRecipientGroup.GUARDIANS, CampaignRecipientGroup.ALL):
        emails += list(
            Guardian.objects.filter(is_active=True)
            .exclude(email="").values_list("email", flat=True)
        )

    if recipient_group == CampaignRecipientGroup.USERS:
        emails += list(
            User.objects.filter(is_active=True)
            .exclude(email="").values_list("email", flat=True)
        )

    # Quita duplicados y vacíos
    return list({e for e in emails if e})


def build_html(campaign) -> str:
    """Arma el HTML del correo según el tipo de contenido de la campaña."""
    # 1. Editor (Unlayer): el HTML ya viene listo
    if campaign.content_type == CampaignContentType.BUILDER:
        return campaign.html_content

    # 2. Imagen / 3. PDF: definimos la imagen a mostrar
    if campaign.content_type == CampaignContentType.IMAGE:
        media_url = campaign.image.url
        link_url = campaign.cta_url or media_url
    else:  # PDF
        media_url = pdf_thumbnail(campaign.document.url)
        link_url = campaign.cta_url or campaign.document.url

    cta_html = ""
    if campaign.cta_text:
        cta_html = f"""
        <tr><td align="center" style="padding:16px 28px 28px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td align="center" bgcolor="#E63B7A" style="border-radius:8px;">
              <a href="{link_url}" target="_blank" style="display:inline-block; padding:12px 28px; color:#FFFFFF; font-size:15px; font-weight:bold; text-decoration:none; border-radius:8px;">
                {campaign.cta_text}
              </a>
            </td>
          </tr></table>
        </td></tr>
        """

    return f"""
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F8FA; font-family:Arial,Helvetica,sans-serif;">
      <tr><td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF; border-radius:12px; overflow:hidden; max-width:600px;">
          <tr><td style="background-color:#2DBFA8; padding:20px 28px; color:#FFFFFF; font-size:20px; font-weight:bold;">
            Fundacion MTM
          </td></tr>
          <tr><td align="center" style="padding:20px 28px 12px;">
            <a href="{link_url}" target="_blank">
              <img src="{media_url}" alt="{campaign.subject}" width="544" style="width:100%; max-width:544px; border-radius:8px; display:block;" />
            </a>
          </td></tr>
          {cta_html}
          <tr><td style="background-color:#F6F8FA; padding:18px 28px; color:#6B7C8A; font-size:12px; text-align:center;">
            Fundacion MTM - Mujeres Trabajando por una Meta
          </td></tr>
        </table>
      </td></tr>
    </table>
    """