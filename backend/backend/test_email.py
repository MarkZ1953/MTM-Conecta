"""
Script de prueba: envía un correo HTML con la miniatura del PDF de Cloudinary.
Ejecutar desde backend/backend con:

    python manage.py shell -c "exec(open('test_email.py', encoding='utf-8').read())"

Borra este archivo cuando termines la prueba.
"""
from django.core.mail import EmailMultiAlternatives

CLOUD = "djee0c2fs"
PDF_ID = "pdfejemplop"
DESTINATARIO = "edward.gov.co@outlook.es"

# Miniatura pagina 1 (f_jpg para compatibilidad con Outlook)
thumb = f"https://res.cloudinary.com/{CLOUD}/image/upload/w_600,q_auto,f_jpg,pg_1/{PDF_ID}"
# PDF completo
pdf = f"https://res.cloudinary.com/{CLOUD}/image/upload/{PDF_ID}.pdf"

html = f"""
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F8FA; font-family:Arial,Helvetica,sans-serif;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF; border-radius:12px; overflow:hidden; max-width:600px;">
      <tr><td style="background-color:#2DBFA8; padding:20px 28px; color:#FFFFFF; font-size:20px; font-weight:bold;">
        Fundacion MTM
      </td></tr>
      <tr><td style="padding:28px 28px 12px; color:#0F1F2C; font-size:16px; line-height:1.5;">
        Hola, te compartimos nuestro nuevo folleto promocional. Conoce como puedes ayudar!
      </td></tr>
      <tr><td align="center" style="padding:12px 28px;">
        <a href="{pdf}" target="_blank">
          <img src="{thumb}" alt="Folleto Fundacion MTM" width="544" style="width:100%; max-width:544px; border-radius:8px; border:1px solid #E6EBEF; display:block;" />
        </a>
      </td></tr>
      <tr><td align="center" style="padding:16px 28px 28px;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td align="center" bgcolor="#E63B7A" style="border-radius:8px;">
            <a href="{pdf}" target="_blank" style="display:inline-block; padding:12px 28px; color:#FFFFFF; font-size:15px; font-weight:bold; text-decoration:none; border-radius:8px;">
              Ver folleto completo
            </a>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="background-color:#F6F8FA; padding:18px 28px; color:#6B7C8A; font-size:12px; text-align:center;">
        Fundacion MTM - Mujeres Trabajando por una Meta
      </td></tr>
    </table>
  </td></tr>
</table>
"""

text = f"Te compartimos nuestro folleto promocional. Abrelo aqui: {pdf}"

msg = EmailMultiAlternatives(
    subject="Folleto MTM (prueba HTML)",
    body=text,
    from_email=None,
    to=[DESTINATARIO],
)
msg.attach_alternative(html, "text/html")
enviados = msg.send()
print(f"Correos enviados: {enviados}")
