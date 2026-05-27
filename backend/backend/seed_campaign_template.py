"""
Crea 1 plantilla base de campaña (diseño Unlayer) para que aparezca en
"Usar plantilla". Ejecutar UNA vez desde backend/backend con:

    python manage.py shell -c "exec(open('seed_campaign_template.py', encoding='utf-8').read())"

Luego puedes borrar este archivo.
"""
import json
from campaigns.models import CampaignTemplate

# ── Diseño Unlayer (estructura válida para loadDesign) ──
design = {
    "counters": {
        "u_row": 3,
        "u_column": 3,
        "u_content_text": 2,
        "u_content_heading": 1,
        "u_content_button": 1,
    },
    "body": {
        "id": "mtm-body",
        "rows": [
            {
                "id": "row-header",
                "cells": [1],
                "columns": [
                    {
                        "id": "col-header",
                        "contents": [
                            {
                                "id": "heading-1",
                                "type": "heading",
                                "values": {
                                    "containerPadding": "20px",
                                    "headingType": "h1",
                                    "fontSize": "24px",
                                    "color": "#ffffff",
                                    "textAlign": "center",
                                    "_meta": {"htmlID": "u_content_heading_1", "htmlClassNames": "u_content_heading"},
                                    "text": "Fundación MTM",
                                },
                            }
                        ],
                        "values": {
                            "_meta": {"htmlID": "u_column_1", "htmlClassNames": "u_column"},
                        },
                    }
                ],
                "values": {
                    "backgroundColor": "#2DBFA8",
                    "padding": "0px",
                    "_meta": {"htmlID": "u_row_1", "htmlClassNames": "u_row"},
                },
            },
            {
                "id": "row-body",
                "cells": [1],
                "columns": [
                    {
                        "id": "col-body",
                        "contents": [
                            {
                                "id": "text-1",
                                "type": "text",
                                "values": {
                                    "containerPadding": "24px",
                                    "fontSize": "16px",
                                    "color": "#0F1F2C",
                                    "textAlign": "left",
                                    "lineHeight": "150%",
                                    "_meta": {"htmlID": "u_content_text_1", "htmlClassNames": "u_content_text"},
                                    "text": "<p>Hola, te compartimos esta novedad de la fundación. Reemplaza este texto por tu mensaje.</p>",
                                },
                            },
                            {
                                "id": "button-1",
                                "type": "button",
                                "values": {
                                    "containerPadding": "10px 24px 30px",
                                    "buttonColors": {"color": "#ffffff", "backgroundColor": "#E63B7A"},
                                    "size": {"autoWidth": True},
                                    "textAlign": "center",
                                    "borderRadius": "8px",
                                    "_meta": {"htmlID": "u_content_button_1", "htmlClassNames": "u_content_button"},
                                    "href": {"name": "web", "values": {"href": "https://", "target": "_blank"}},
                                    "text": "<span style='font-size:15px;'>Conoce más</span>",
                                },
                            },
                        ],
                        "values": {
                            "_meta": {"htmlID": "u_column_2", "htmlClassNames": "u_column"},
                        },
                    }
                ],
                "values": {
                    "backgroundColor": "#ffffff",
                    "padding": "0px",
                    "_meta": {"htmlID": "u_row_2", "htmlClassNames": "u_row"},
                },
            },
            {
                "id": "row-footer",
                "cells": [1],
                "columns": [
                    {
                        "id": "col-footer",
                        "contents": [
                            {
                                "id": "text-2",
                                "type": "text",
                                "values": {
                                    "containerPadding": "16px",
                                    "fontSize": "12px",
                                    "color": "#6B7C8A",
                                    "textAlign": "center",
                                    "_meta": {"htmlID": "u_content_text_2", "htmlClassNames": "u_content_text"},
                                    "text": "<p>Fundación MTM · Mujeres Trabajando por una Meta</p>",
                                },
                            }
                        ],
                        "values": {
                            "_meta": {"htmlID": "u_column_3", "htmlClassNames": "u_column"},
                        },
                    }
                ],
                "values": {
                    "backgroundColor": "#F6F8FA",
                    "padding": "0px",
                    "_meta": {"htmlID": "u_row_3", "htmlClassNames": "u_row"},
                },
            },
        ],
        "headers": [],
        "footers": [],
        "values": {
            "contentWidth": "600px",
            "contentAlign": "center",
            "backgroundColor": "#F6F8FA",
            "fontFamily": {"label": "Arial", "value": "arial,helvetica,sans-serif"},
            "_meta": {"htmlID": "u_body", "htmlClassNames": "u_body"},
        },
    },
    "schemaVersion": 16,
}

html = """
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F8FA;font-family:Arial,sans-serif;">
  <tr><td align="center" style="padding:24px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:600px;">
      <tr><td style="background:#2DBFA8;padding:20px;color:#fff;font-size:24px;text-align:center;font-weight:bold;">Fundación MTM</td></tr>
      <tr><td style="padding:24px;color:#0F1F2C;font-size:16px;line-height:1.5;">Hola, te compartimos esta novedad de la fundación. Reemplaza este texto por tu mensaje.</td></tr>
      <tr><td align="center" style="padding:10px 24px 30px;"><a href="https://" style="background:#E63B7A;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:15px;">Conoce más</a></td></tr>
      <tr><td style="background:#F6F8FA;padding:16px;color:#6B7C8A;font-size:12px;text-align:center;">Fundación MTM · Mujeres Trabajando por una Meta</td></tr>
    </table>
  </td></tr>
</table>
"""

template, created = CampaignTemplate.objects.get_or_create(
    name="Plantilla base MTM",
    defaults={"design_json": json.dumps(design), "html_content": html.strip()},
)

if created:
    print(f"Plantilla creada con id {template.id}")
else:
    print(f"Ya existía una plantilla con ese nombre (id {template.id})")
