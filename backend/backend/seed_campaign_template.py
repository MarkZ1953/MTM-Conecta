"""
Actualiza la plantilla base de campañas (diseño Unlayer) para que aparezca en
"Usar plantilla". Ejecutar desde backend/backend con:

    python manage.py shell -c "exec(open('seed_campaign_template.py', encoding='utf-8').read())"
"""
import json

from campaigns.models import CampaignTemplate


LOGO_URL = "https://res.cloudinary.com/djee0c2fs/image/upload/f_auto,q_auto,w_260/v1779827430/Logo_fundacio%CC%81n_mtm_vkzbwq.png"
HERO_URL = "https://res.cloudinary.com/djee0c2fs/image/upload/f_auto,q_auto,w_1200/v1779826032/DSC01921_wvvyak.jpg"
STORY_URL = "https://res.cloudinary.com/djee0c2fs/image/upload/f_auto,q_auto,w_700/v1779826037/DSC01937_arqymg.jpg"
SUPPORT_URL = "https://res.cloudinary.com/djee0c2fs/image/upload/f_auto,q_auto,w_700/v1779826180/ayudanos-04_cx7j4w.jpg"


def meta(kind: str, number: int):
    return {"htmlID": f"u_{kind}_{number}", "htmlClassNames": f"u_{kind}"}


def row(row_id, columns, background="#ffffff", padding="0px"):
    return {
        "id": row_id,
        "cells": [1 for _ in columns],
        "columns": columns,
        "values": {
            "backgroundColor": background,
            "padding": padding,
            "_meta": meta("row", int(row_id.rsplit("-", 1)[-1])),
        },
    }


def column(column_id, contents):
    return {
        "id": column_id,
        "contents": contents,
        "values": {
            "_meta": meta("column", int(column_id.rsplit("-", 1)[-1])),
            "padding": "0px",
        },
    }


def text(content_id, html, color="#4f5f6f", size="15px", align="left", padding="10px 28px", line_height="155%"):
    number = int(content_id.rsplit("-", 1)[-1])
    return {
        "id": content_id,
        "type": "text",
        "values": {
            "containerPadding": padding,
            "fontSize": size,
            "color": color,
            "textAlign": align,
            "lineHeight": line_height,
            "_meta": meta("content_text", number),
            "text": html,
        },
    }


def heading(content_id, html, color="#101828", size="28px", align="left", padding="10px 28px", heading_type="h1"):
    number = int(content_id.rsplit("-", 1)[-1])
    return {
        "id": content_id,
        "type": "heading",
        "values": {
            "containerPadding": padding,
            "headingType": heading_type,
            "fontSize": size,
            "color": color,
            "textAlign": align,
            "lineHeight": "120%",
            "_meta": meta("content_heading", number),
            "text": html,
        },
    }


def image(content_id, url, alt, padding="0px", width=600):
    number = int(content_id.rsplit("-", 1)[-1])
    return {
        "id": content_id,
        "type": "image",
        "values": {
            "containerPadding": padding,
            "src": {"url": url, "width": width, "height": "auto"},
            "altText": alt,
            "textAlign": "center",
            "_meta": meta("content_image", number),
        },
    }


def button(content_id, label, href="https://fundacionmtm.org", padding="18px 28px 32px"):
    number = int(content_id.rsplit("-", 1)[-1])
    return {
        "id": content_id,
        "type": "button",
        "values": {
            "containerPadding": padding,
            "buttonColors": {"color": "#ffffff", "backgroundColor": "#6b2fa0"},
            "size": {"autoWidth": True},
            "textAlign": "left",
            "borderRadius": "8px",
            "padding": "13px 24px",
            "_meta": meta("content_button", number),
            "href": {"name": "web", "values": {"href": href, "target": "_blank"}},
            "text": f"<span style=\"font-size:15px;font-weight:700;\">{label}</span>",
        },
    }


def divider(content_id, padding="8px 28px"):
    number = int(content_id.rsplit("-", 1)[-1])
    return {
        "id": content_id,
        "type": "divider",
        "values": {
            "containerPadding": padding,
            "border": {"borderTopWidth": "1px", "borderTopStyle": "solid", "borderTopColor": "#e6eef3"},
            "_meta": meta("content_divider", number),
        },
    }


design = {
    "counters": {
        "u_row": 10,
        "u_column": 13,
        "u_content_text": 14,
        "u_content_heading": 6,
        "u_content_button": 2,
        "u_content_image": 4,
        "u_content_divider": 2,
    },
    "body": {
        "id": "mtm-newsletter-body",
        "rows": [
            row(
                "row-1",
                [
                    column(
                        "column-1",
                        [
                            text(
                                "text-1",
                                "<p>Boletín institucional · Reemplaza esta línea por el mes o campaña</p>",
                                color="#667085",
                                size="12px",
                                align="center",
                                padding="18px 28px 8px",
                            )
                        ],
                    )
                ],
                background="#f3fbfa",
            ),
            row(
                "row-2",
                [
                    column(
                        "column-2",
                        [
                            image("image-1", LOGO_URL, "Fundación MTM", padding="18px 28px 14px", width=210),
                            divider("divider-1", padding="0px 28px 8px"),
                        ],
                    )
                ],
            ),
            row(
                "row-3",
                [column("column-3", [image("image-2", HERO_URL, "Comunidad Fundación MTM", padding="0px", width=600)])],
            ),
            row(
                "row-4",
                [
                    column(
                        "column-4",
                        [
                            heading(
                                "heading-1",
                                "Título principal de la campaña o boletín",
                                color="#1d2939",
                                size="30px",
                                padding="30px 34px 8px",
                            ),
                            text(
                                "text-2",
                                "<p>Escribe aquí el mensaje central. Usa este espacio para contar el objetivo, la novedad o la historia que quieres comunicar a donantes, aliados y comunidad.</p>",
                                padding="8px 34px",
                            ),
                            button("button-1", "Completar llamado a la acción", padding="18px 34px 34px"),
                        ],
                    )
                ],
            ),
            row(
                "row-5",
                [
                    column(
                        "column-5",
                        [
                            heading(
                                "heading-2",
                                "Impacto en cifras",
                                color="#6b2fa0",
                                size="20px",
                                padding="26px 34px 4px",
                                heading_type="h2",
                            ),
                            text(
                                "text-3",
                                "<p>Actualiza estos datos con los resultados más recientes de la fundación.</p>",
                                size="14px",
                                padding="4px 34px 12px",
                            ),
                        ],
                    )
                ],
                background="#f8fbfd",
            ),
            row(
                "row-6",
                [
                    column(
                        "column-6",
                        [
                            text(
                                "text-4",
                                "<p style=\"font-size:28px;line-height:1.1;margin:0;color:#159d8c;font-weight:700;\">+000</p><p style=\"margin:6px 0 0;\">Personas beneficiadas</p>",
                                padding="14px 28px 24px 34px",
                            )
                        ],
                    ),
                    column(
                        "column-7",
                        [
                            text(
                                "text-5",
                                "<p style=\"font-size:28px;line-height:1.1;margin:0;color:#6b2fa0;font-weight:700;\">00</p><p style=\"margin:6px 0 0;\">Actividades realizadas</p>",
                                padding="14px 20px 24px",
                            )
                        ],
                    ),
                    column(
                        "column-8",
                        [
                            text(
                                "text-6",
                                "<p style=\"font-size:28px;line-height:1.1;margin:0;color:#159d8c;font-weight:700;\">00</p><p style=\"margin:6px 0 0;\">Aliados vinculados</p>",
                                padding="14px 34px 24px 20px",
                            )
                        ],
                    ),
                ],
                background="#f8fbfd",
            ),
            row(
                "row-7",
                [
                    column("column-9", [image("image-3", STORY_URL, "Actividad Fundación MTM", padding="28px 14px 28px 34px", width=260)]),
                    column(
                        "column-10",
                        [
                            heading("heading-3", "Historia destacada", color="#1d2939", size="22px", padding="30px 34px 6px 14px", heading_type="h2"),
                            text(
                                "text-7",
                                "<p>Incluye una historia breve: qué pasó, a quién acompañamos y cuál fue el resultado. Este bloque funciona muy bien para testimonios, jornadas y logros.</p>",
                                padding="6px 34px 8px 14px",
                            ),
                            text(
                                "text-8",
                                "<p><strong>Dato clave:</strong> reemplaza esta línea por un aprendizaje, cifra o frase memorable.</p>",
                                color="#6b2fa0",
                                padding="6px 34px 26px 14px",
                            ),
                        ],
                    ),
                ],
            ),
            row(
                "row-8",
                [
                    column(
                        "column-11",
                        [
                            heading("heading-4", "Espacio para información adicional", color="#6b2fa0", size="22px", padding="28px 34px 8px", heading_type="h2"),
                            text(
                                "text-9",
                                "<p><strong>Bloque 1:</strong> agrega aquí fecha, lugar, requisitos, resumen de programa o próximos pasos.</p>",
                                padding="8px 34px",
                            ),
                            text(
                                "text-10",
                                "<p><strong>Bloque 2:</strong> usa este espacio para necesidades, agradecimientos, enlaces o una invitación puntual.</p>",
                                padding="8px 34px 14px",
                            ),
                            image("image-4", SUPPORT_URL, "Apoyo Fundación MTM", padding="8px 34px 26px", width=532),
                        ],
                    )
                ],
                background="#f8fbfd",
            ),
            row(
                "row-9",
                [
                    column(
                        "column-12",
                        [
                            heading(
                                "heading-5",
                                "Gracias por caminar con Fundación MTM",
                                color="#ffffff",
                                size="24px",
                                align="center",
                                padding="30px 34px 8px",
                                heading_type="h2",
                            ),
                            text(
                                "text-11",
                                "<p>Reemplaza este texto por un cierre cálido y directo. Invita a donar, vincularse, asistir o compartir la campaña.</p>",
                                color="#f5f0ff",
                                align="center",
                                padding="6px 42px",
                            ),
                            button("button-2", "Editar botón principal", padding="18px 34px 32px"),
                        ],
                    )
                ],
                background="#6b2fa0",
            ),
            row(
                "row-10",
                [
                    column(
                        "column-13",
                        [
                            text(
                                "text-12",
                                "<p><strong>Fundación MTM</strong><br>Mujeres Trabajando por una Meta</p>",
                                color="#344054",
                                align="center",
                                padding="22px 28px 4px",
                            ),
                            text(
                                "text-13",
                                "<p>Instagram · Facebook · WhatsApp · Sitio web</p>",
                                color="#667085",
                                align="center",
                                size="13px",
                                padding="4px 28px 6px",
                            ),
                            text(
                                "text-14",
                                "<p>Recibes este correo porque haces parte de nuestra comunidad o aceptaste recibir novedades.</p>",
                                color="#98a2b3",
                                align="center",
                                size="11px",
                                padding="4px 34px 22px",
                            ),
                        ],
                    )
                ],
                background="#ffffff",
            ),
        ],
        "headers": [],
        "footers": [],
        "values": {
            "contentWidth": "600px",
            "contentAlign": "center",
            "backgroundColor": "#f3fbfa",
            "fontFamily": {"label": "Arial", "value": "arial,helvetica,sans-serif"},
            "_meta": {"htmlID": "u_body", "htmlClassNames": "u_body"},
        },
    },
    "schemaVersion": 16,
}

html = f"""
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3fbfa;font-family:Arial,Helvetica,sans-serif;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;box-shadow:0 20px 48px rgba(16,24,40,.10);">
      <tr><td align="center" style="padding:18px 28px 8px;color:#667085;font-size:12px;">Boletín institucional · Reemplaza esta línea por el mes o campaña</td></tr>
      <tr><td align="center" style="padding:16px 28px;"><img src="{LOGO_URL}" width="210" alt="Fundación MTM" style="max-width:210px;width:100%;height:auto;display:block;"></td></tr>
      <tr><td><img src="{HERO_URL}" width="600" alt="Comunidad Fundación MTM" style="width:100%;height:auto;display:block;"></td></tr>
      <tr><td style="padding:30px 34px 8px;color:#1d2939;font-size:30px;line-height:1.2;font-weight:800;">Título principal de la campaña o boletín</td></tr>
      <tr><td style="padding:8px 34px;color:#4f5f6f;font-size:15px;line-height:1.55;">Escribe aquí el mensaje central. Usa este espacio para contar el objetivo, la novedad o la historia que quieres comunicar.</td></tr>
      <tr><td style="padding:18px 34px 34px;"><a href="https://fundacionmtm.org" style="background:#6b2fa0;color:#fff;text-decoration:none;border-radius:8px;padding:13px 24px;font-weight:700;display:inline-block;">Completar llamado a la acción</a></td></tr>
      <tr><td style="background:#f8fbfd;padding:26px 34px 8px;color:#6b2fa0;font-size:20px;font-weight:800;">Impacto en cifras</td></tr>
      <tr><td style="background:#f8fbfd;padding:8px 34px 24px;color:#4f5f6f;font-size:14px;">Actualiza estos datos con los resultados más recientes de la fundación.</td></tr>
      <tr><td style="background:#f8fbfd;padding:0 34px 26px;">
        <table role="presentation" width="100%"><tr>
          <td style="width:33%;color:#4f5f6f;"><strong style="display:block;color:#159d8c;font-size:28px;">+000</strong>Personas beneficiadas</td>
          <td style="width:33%;color:#4f5f6f;"><strong style="display:block;color:#6b2fa0;font-size:28px;">00</strong>Actividades realizadas</td>
          <td style="width:33%;color:#4f5f6f;"><strong style="display:block;color:#159d8c;font-size:28px;">00</strong>Aliados vinculados</td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:28px 34px;">
        <table role="presentation" width="100%"><tr>
          <td width="46%" valign="top"><img src="{STORY_URL}" alt="Actividad Fundación MTM" style="width:100%;border-radius:12px;display:block;"></td>
          <td width="54%" valign="top" style="padding-left:20px;color:#4f5f6f;font-size:15px;line-height:1.55;"><h2 style="margin:0 0 10px;color:#1d2939;font-size:22px;">Historia destacada</h2>Incluye una historia breve: qué pasó, a quién acompañamos y cuál fue el resultado.<p style="color:#6b2fa0;"><strong>Dato clave:</strong> reemplaza esta línea por una cifra o frase memorable.</p></td>
        </tr></table>
      </td></tr>
      <tr><td style="background:#6b2fa0;padding:30px 34px;text-align:center;color:#f5f0ff;"><h2 style="margin:0 0 10px;color:#fff;font-size:24px;">Gracias por caminar con Fundación MTM</h2>Reemplaza este cierre por una invitación a donar, vincularse, asistir o compartir.</td></tr>
      <tr><td align="center" style="padding:22px 34px;color:#667085;font-size:12px;"><strong style="color:#344054;">Fundación MTM</strong><br>Mujeres Trabajando por una Meta</td></tr>
    </table>
  </td></tr>
</table>
"""

template = (
    CampaignTemplate.objects.filter(name="Boletín institucional MTM").first()
    or CampaignTemplate.objects.filter(name="Plantilla base MTM").first()
)

if template is None:
    template = CampaignTemplate(name="Boletín institucional MTM")

template.name = "Boletín institucional MTM"
template.design_json = json.dumps(design)
template.html_content = html.strip()
template.is_active = True
template.save()

print(f"Plantilla actualizada con id {template.id}")
