"""Generate MTM-Conecta team module assignment guide PDF."""
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether
)

OUTPUT = r"C:\Users\NITRO V15\proyectos\mtm-conecta\MTM-Conecta-Guia-Modulos.pdf"

# Colors
PRIMARY = colors.HexColor("#6B46C1")
SECONDARY = colors.HexColor("#9F7AEA")
ACCENT = colors.HexColor("#ED8936")
DARK = colors.HexColor("#1A202C")
LIGHT = colors.HexColor("#F7FAFC")
GRAY = colors.HexColor("#718096")
SUCCESS = colors.HexColor("#38A169")
DANGER = colors.HexColor("#E53E3E")

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "TitleCustom",
    parent=styles["Title"],
    fontSize=24,
    textColor=PRIMARY,
    spaceAfter=12,
    alignment=TA_CENTER,
    fontName="Helvetica-Bold",
)

subtitle_style = ParagraphStyle(
    "Subtitle",
    parent=styles["Normal"],
    fontSize=11,
    textColor=GRAY,
    alignment=TA_CENTER,
    spaceAfter=18,
)

h1_style = ParagraphStyle(
    "H1",
    parent=styles["Heading1"],
    fontSize=18,
    textColor=PRIMARY,
    spaceBefore=14,
    spaceAfter=10,
    fontName="Helvetica-Bold",
)

h2_style = ParagraphStyle(
    "H2",
    parent=styles["Heading2"],
    fontSize=14,
    textColor=DARK,
    spaceBefore=10,
    spaceAfter=6,
    fontName="Helvetica-Bold",
)

h3_style = ParagraphStyle(
    "H3",
    parent=styles["Heading3"],
    fontSize=12,
    textColor=SECONDARY,
    spaceBefore=8,
    spaceAfter=4,
    fontName="Helvetica-Bold",
)

body_style = ParagraphStyle(
    "Body",
    parent=styles["Normal"],
    fontSize=10,
    textColor=DARK,
    spaceAfter=6,
    leading=14,
)

bullet_style = ParagraphStyle(
    "Bullet",
    parent=styles["Normal"],
    fontSize=10,
    textColor=DARK,
    leftIndent=18,
    bulletIndent=6,
    spaceAfter=3,
    leading=14,
)

code_style = ParagraphStyle(
    "Code",
    parent=styles["Code"],
    fontSize=8.5,
    textColor=DARK,
    backColor=LIGHT,
    borderColor=GRAY,
    borderWidth=0.5,
    borderPadding=6,
    leading=12,
    fontName="Courier",
    spaceBefore=4,
    spaceAfter=6,
)

note_style = ParagraphStyle(
    "Note",
    parent=styles["Normal"],
    fontSize=9.5,
    textColor=DARK,
    backColor=colors.HexColor("#FFF5EB"),
    borderColor=ACCENT,
    borderWidth=0.5,
    borderPadding=8,
    leading=13,
    spaceAfter=8,
)


def code_block(text):
    escaped = (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\n", "<br/>")
        .replace(" ", "&nbsp;")
    )
    return Paragraph(escaped, code_style)


def bullet(text):
    return Paragraph(f"• {text}", bullet_style)


def cover_page():
    elements = []
    elements.append(Spacer(1, 1.8 * inch))
    elements.append(Paragraph("MTM-Conecta", title_style))
    elements.append(Paragraph(
        "Guía de Implementación de Módulos Pendientes — Equipo Backend",
        subtitle_style,
    ))
    elements.append(Spacer(1, 0.5 * inch))

    data = [
        ["Compañero", "Módulo asignado"],
        ["Danna", "Proyectos"],
        ["Jhon", "Auditoría"],
        ["Luis", "Reportes"],
    ]
    t = Table(data, colWidths=[2.4 * inch, 2.4 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 11),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LIGHT, colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    elements.append(t)

    elements.append(Spacer(1, 0.8 * inch))
    elements.append(Paragraph(
        "Este documento contiene la estructura, las buenas prácticas, las reglas y "
        "los detalles de cada módulo. <b>Léelo completo antes de empezar.</b> Cada "
        "compañero implementa el módulo que le corresponde respetando los patrones "
        "ya establecidos en el proyecto.",
        body_style,
    ))
    elements.append(PageBreak())
    return elements


def section_general():
    elements = []
    elements.append(Paragraph("1. Reglas Generales del Proyecto", h1_style))

    elements.append(Paragraph(
        "Antes de escribir una sola línea, ten claro lo siguiente:",
        body_style,
    ))
    elements.append(bullet("Trabaja siempre en <b>tu propia rama</b>. Nunca commitees directo a <b>dev</b> ni <b>main</b>."))
    elements.append(bullet("Al terminar tu módulo, abre un <b>Pull Request</b> a <b>dev</b>."))
    elements.append(bullet("Antes de empezar, haz <b>git pull origin dev</b> para tener lo más reciente."))
    elements.append(bullet("Si necesitas modificar archivos compartidos (<b>backend/urls.py</b>, <b>settings.py</b>, <b>access/</b>), avisa al equipo para evitar conflictos."))
    elements.append(bullet("Nunca commitees <b>archivos .pyc</b>, la carpeta <b>venv/</b>, ni archivos <b>.env</b>."))
    elements.append(bullet("Los mensajes de commit empiezan con verbo en imperativo en inglés: <b>Add</b>, <b>Fix</b>, <b>Refactor</b>, <b>Update</b>."))

    elements.append(Spacer(1, 0.15 * inch))
    elements.append(Paragraph(
        "<b>Lee primero el módulo de Beneficiarios</b> (backend/backend/beneficiaries/) "
        "— es el ejemplo más reciente y completo del patrón a seguir. Replica esa misma "
        "estructura para tu módulo.",
        note_style,
    ))
    return elements


def section_structure():
    elements = []
    elements.append(Paragraph("2. Estructura Obligatoria de Cada Módulo", h1_style))
    elements.append(Paragraph(
        "Cada módulo es una <b>app de Django</b> dentro de <i>backend/backend/&lt;nombre_app&gt;/</i> "
        "con estos archivos:",
        body_style,
    ))
    elements.append(code_block(
        "<nombre_app>/\n"
        "├── __init__.py\n"
        "├── apps.py\n"
        "├── models.py          # Modelos heredando de BaseModel\n"
        "├── serializers.py     # Convierte modelo <-> JSON\n"
        "├── paginations.py     # Paginación 10 por página\n"
        "├── filters.py         # Filtros de búsqueda\n"
        "├── views.py           # ViewSets con CRUD\n"
        "├── urls.py            # Rutas con DefaultRouter\n"
        "└── migrations/"
    ))

    elements.append(Paragraph("Registro de la app", h2_style))
    elements.append(Paragraph("Después de crear la app debes registrarla en dos archivos:", body_style))
    elements.append(bullet("<b>backend/settings.py</b> → agregar el nombre en <b>INSTALLED_APPS</b>"))
    elements.append(bullet("<b>backend/urls.py</b> → agregar <b>path(\"\", include('&lt;nombre_app&gt;.urls'))</b>"))

    elements.append(Paragraph("Crear la app de Django", h2_style))
    elements.append(code_block(
        "cd backend/backend\n"
        "python manage.py startapp <nombre_app>"
    ))
    return elements


def section_patterns():
    elements = []
    elements.append(Paragraph("3. Patrones de Código", h1_style))

    elements.append(Paragraph("3.1 Modelos", h2_style))
    elements.append(bullet("Hereda siempre de <b>app.models.BaseModel</b> (trae is_active, created_at, updated_at, soft delete e historial)."))
    elements.append(bullet("Usa <b>db_table</b> en <b>Meta</b> con nombre en plural minúscula: <b>projects</b>, <b>audits</b>, <b>reports</b>."))
    elements.append(bullet("Define <b>__str__</b> para representación legible."))
    elements.append(bullet("Para choices, usa <b>models.TextChoices</b>."))
    elements.append(code_block(
        "from app.models import BaseModel\n"
        "from django.db import models\n\n"
        "class Project(BaseModel):\n"
        "    name = models.CharField(max_length=128, null=False, blank=False)\n"
        "    description = models.TextField(blank=True, null=True)\n\n"
        "    def __str__(self):\n"
        "        return self.name\n\n"
        "    class Meta:\n"
        "        db_table = 'projects'\n"
        "        verbose_name = 'Project'\n"
        "        verbose_name_plural = 'Projects'"
    ))

    elements.append(Paragraph("3.2 Serializers", h2_style))
    elements.append(bullet("Hereda de <b>serializers.ModelSerializer</b>."))
    elements.append(bullet("Lista los campos explícitamente. <b>Nunca</b> uses <b>fields = '__all__'</b>."))
    elements.append(bullet("Marca los campos con <b>auto_now_add</b> como <b>read_only_fields</b>."))
    elements.append(code_block(
        "from rest_framework import serializers\n"
        "from .models import Project\n\n"
        "class ProjectSerializer(serializers.ModelSerializer):\n"
        "    class Meta:\n"
        "        model = Project\n"
        "        fields = ['id', 'name', 'description', 'is_active']\n"
        "        read_only_fields = ['created_at']"
    ))

    elements.append(Paragraph("3.3 Paginations", h2_style))
    elements.append(code_block(
        "from rest_framework.pagination import PageNumberPagination\n\n"
        "class ProjectPagination(PageNumberPagination):\n"
        "    page_size = 10\n"
        "    page_size_query_param = 'page_size'\n"
        "    max_page_size = 100"
    ))

    elements.append(Paragraph("3.4 Filters", h2_style))
    elements.append(code_block(
        "import django_filters\n"
        "from .models import Project\n\n"
        "class ProjectFilter(django_filters.FilterSet):\n"
        "    class Meta:\n"
        "        model = Project\n"
        "        fields = {\n"
        "            'name': ['exact', 'icontains', 'istartswith'],\n"
        "            'is_active': ['exact'],\n"
        "        }"
    ))

    elements.append(Paragraph("3.5 Views", h2_style))
    elements.append(bullet("Hereda de <b>ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet</b> en ese orden."))
    elements.append(bullet("<b>queryset</b> siempre filtrado por <b>is_active=True</b>."))
    elements.append(bullet("Activa los 3 <b>filter_backends</b> estándar."))
    elements.append(bullet("Ordenamiento por defecto descendente (<b>-id</b> o <b>-created_at</b>)."))
    elements.append(code_block(
        "from django_filters.rest_framework import DjangoFilterBackend\n"
        "from app.mixins.soft_delete_mixin import SoftDeleteMixin\n"
        "from app.mixins.export_mixin import ExportMixin\n"
        "from rest_framework import viewsets, filters\n"
        "from .serializers import ProjectSerializer\n"
        "from .paginations import ProjectPagination\n"
        "from .filters import ProjectFilter\n"
        "from .models import Project\n\n"
        "class ProjectViewSet(ExportMixin, SoftDeleteMixin, viewsets.ModelViewSet):\n"
        "    queryset = Project.objects.filter(is_active=True)\n"
        "    serializer_class = ProjectSerializer\n"
        "    pagination_class = ProjectPagination\n"
        "    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]\n"
        "    filterset_class = ProjectFilter\n"
        "    ordering_fields = ['id', 'name']\n"
        "    ordering = ['-id']"
    ))

    elements.append(Paragraph("3.6 URLs", h2_style))
    elements.append(bullet("Usa <b>DefaultRouter</b> para CRUD estándar."))
    elements.append(bullet("Usa <b>path()</b> manual solo si tienes vistas especiales (no-ViewSet)."))
    elements.append(code_block(
        "from rest_framework.routers import DefaultRouter\n"
        "from .views import ProjectViewSet\n\n"
        "router = DefaultRouter()\n"
        "router.register(r'projects', ProjectViewSet, basename='projects')\n\n"
        "urlpatterns = router.urls"
    ))
    return elements


def section_rules():
    elements = []
    elements.append(Paragraph("4. Reglas que Nadie Puede Romper", h1_style))
    rules = [
        "Nunca borrar registros físicamente — solo <b>soft delete</b> (lo hace el mixin automáticamente).",
        "Nunca exponer contraseñas ni datos sensibles en serializers.",
        "Nunca usar <b>fields = '__all__'</b> — explícitamente listar cada campo.",
        "Nunca commitear archivos <b>.pyc</b>, <b>venv/</b>, <b>.env</b> ni archivos personales.",
        "Cada acción importante debe registrarse en <b>Auditoría</b> (módulo de Jhon).",
        "Validar siempre del lado del servidor — no confiar solo en el frontend.",
        "Probar los endpoints antes de hacer commit. Un <b>401 Unauthorized</b> al pegar la URL en el navegador es señal de que el módulo funciona.",
        "Si modificas un archivo compartido, avisa al equipo.",
    ]
    for r in rules:
        elements.append(bullet(r))
    return elements


def section_danna():
    elements = []
    elements.append(PageBreak())
    elements.append(Paragraph("Danna — Módulo de Proyectos", h1_style))
    elements.append(Paragraph(
        "Este módulo gestiona los proyectos sociales de la fundación. Permite asociar "
        "beneficiarios y registrar el estado de cada proyecto.",
        body_style,
    ))

    elements.append(Paragraph("Campos del modelo Project", h2_style))
    data = [
        ["Campo", "Tipo", "Notas"],
        ["name", "CharField(128)", "Requerido"],
        ["description", "TextField", "Opcional"],
        ["start_date", "DateField", "Requerido"],
        ["end_date", "DateField", "Opcional"],
        ["status", "CharField + choices", "PLANEADO / EN_EJECUCION / FINALIZADO"],
        ["beneficiaries", "ManyToManyField", "Relación con Beneficiary"],
    ]
    t = Table(data, colWidths=[1.6 * inch, 1.8 * inch, 3.0 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LIGHT, colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.4, GRAY),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    elements.append(t)

    elements.append(Spacer(1, 0.15 * inch))
    elements.append(Paragraph("Choices del status", h3_style))
    elements.append(code_block(
        "class StatusProject(models.TextChoices):\n"
        "    PLANNED = 'PLANNED', 'Planeado'\n"
        "    IN_PROGRESS = 'IN_PROGRESS', 'En ejecución'\n"
        "    FINISHED = 'FINISHED', 'Finalizado'"
    ))

    elements.append(Paragraph("Relaciones importantes", h2_style))
    elements.append(bullet("<b>Many-to-many</b> con Beneficiarios. Un proyecto tiene varios beneficiarios y un beneficiario puede estar en varios proyectos."))
    elements.append(bullet("<b>Donaciones</b> deberán referenciar un Proyecto. Coordina con quien hizo Donaciones para agregar <b>project = FK(Project)</b> a Donation cuando termines tu modelo."))

    elements.append(Paragraph("Endpoints especiales sugeridos", h2_style))
    elements.append(bullet("<b>GET /projects/&lt;id&gt;/beneficiaries/</b> — listar beneficiarios del proyecto."))
    elements.append(bullet("<b>POST /projects/&lt;id&gt;/add-beneficiary/</b> — asociar beneficiario."))
    elements.append(bullet("<b>POST /projects/&lt;id&gt;/remove-beneficiary/</b> — desasociar."))
    elements.append(Paragraph(
        "Para los endpoints especiales, usa <b>@action(detail=True, methods=['post'], url_path='add-beneficiary')</b> dentro del ViewSet.",
        body_style,
    ))

    elements.append(Paragraph("Checklist Danna", h2_style))
    items = [
        "App creada con <b>python manage.py startapp projects</b>",
        "Registrada en <b>INSTALLED_APPS</b> y <b>backend/urls.py</b>",
        "Modelo <b>Project</b> heredando de <b>BaseModel</b>",
        "Choices con <b>TextChoices</b>",
        "Serializer, Pagination, Filter, View, URLs",
        "Migraciones creadas y aplicadas",
        "Endpoint <b>http://127.0.0.1:8000/projects/</b> responde 401",
        "Endpoints especiales para asociar/desasociar beneficiarios",
        "Coordinación con compañero de Donaciones para agregar FK a Project",
    ]
    for i in items:
        elements.append(bullet(i))
    return elements


def section_jhon():
    elements = []
    elements.append(PageBreak())
    elements.append(Paragraph("Jhon — Módulo de Auditoría", h1_style))
    elements.append(Paragraph(
        "Este módulo registra todas las acciones realizadas en el sistema para mantener "
        "trazabilidad y transparencia. <b>Es el módulo más sensible</b> porque otros "
        "módulos lo van a consumir.",
        body_style,
    ))
    elements.append(Paragraph(
        "<b>Nota importante:</b> ya existe la carpeta <b>audits/</b> en el backend pero "
        "está vacía. También hay llamados comentados a <b>log_event(...)</b> en "
        "<b>access/views.py</b> esperando que tu servicio esté listo.",
        note_style,
    ))

    elements.append(Paragraph("Campos del modelo AuditLog", h2_style))
    data = [
        ["Campo", "Tipo", "Notas"],
        ["user", "FK(User)", "Nullable — acciones del sistema sin usuario"],
        ["action", "CharField(64)", "login, create, update, delete, logout, login_failed"],
        ["model_name", "CharField(64)", "Qué modelo se afectó"],
        ["object_id", "CharField(64)", "Nullable — ID del registro afectado"],
        ["description", "TextField", "Descripción del cambio"],
        ["ip_address", "GenericIPAddressField", "Nullable"],
        ["timestamp", "DateTimeField", "auto_now_add=True"],
    ]
    t = Table(data, colWidths=[1.5 * inch, 1.6 * inch, 3.3 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LIGHT, colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.4, GRAY),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    elements.append(t)

    elements.append(Paragraph("Servicio audits/service.py", h2_style))
    elements.append(Paragraph(
        "Esta es la pieza clave. Crea el archivo <b>audits/service.py</b> con la función "
        "<b>log_event</b>. Otros módulos van a importar esta función para registrar eventos.",
        body_style,
    ))
    elements.append(code_block(
        "from .models import AuditLog\n\n"
        "def get_client_ip(request):\n"
        "    if request is None:\n"
        "        return None\n"
        "    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')\n"
        "    if x_forwarded_for:\n"
        "        return x_forwarded_for.split(',')[0]\n"
        "    return request.META.get('REMOTE_ADDR')\n\n"
        "def log_event(request=None, user=None, action='', instance=None, description=''):\n"
        "    AuditLog.objects.create(\n"
        "        user=user or (request.user if request and request.user.is_authenticated else None),\n"
        "        action=action,\n"
        "        model_name=instance.__class__.__name__ if instance else '',\n"
        "        object_id=str(instance.id) if instance else None,\n"
        "        description=description,\n"
        "        ip_address=get_client_ip(request),\n"
        "    )"
    ))

    elements.append(Paragraph("Después de crear el servicio", h2_style))
    elements.append(bullet("Abre <b>access/views.py</b> y <b>descomenta</b> los llamados a <b>log_event(...)</b>."))
    elements.append(bullet("Cambia <b># from audits.service import log_event</b> por el import sin el #."))
    elements.append(bullet("Verifica que el login/logout registre eventos."))

    elements.append(Paragraph("Importante para tu ViewSet", h2_style))
    elements.append(Paragraph(
        "Este módulo es <b>solo de lectura desde el API</b>. Los registros se crean "
        "automáticamente desde otros módulos, nunca manualmente. <b>Tu ViewSet debe "
        "deshabilitar POST, PUT, PATCH y DELETE.</b>",
        body_style,
    ))
    elements.append(code_block(
        "from rest_framework import viewsets, mixins\n\n"
        "class AuditLogViewSet(\n"
        "    mixins.ListModelMixin,\n"
        "    mixins.RetrieveModelMixin,\n"
        "    viewsets.GenericViewSet,\n"
        "):\n"
        "    queryset = AuditLog.objects.all().order_by('-timestamp')\n"
        "    serializer_class = AuditLogSerializer\n"
        "    pagination_class = AuditLogPagination"
    ))

    elements.append(Paragraph("Checklist Jhon", h2_style))
    items = [
        "App <b>audits</b> creada (la carpeta ya existe, llénala)",
        "Registrada en <b>INSTALLED_APPS</b> y <b>backend/urls.py</b>",
        "Modelo <b>AuditLog</b> heredando de <b>BaseModel</b>",
        "Servicio <b>audits/service.py</b> con función <b>log_event</b>",
        "Imports descomentados en <b>access/views.py</b>",
        "ViewSet de solo lectura (List + Retrieve únicamente)",
        "Filtros por usuario, acción, fecha",
        "Migraciones creadas y aplicadas",
        "Probado: hacer login → aparece registro en <b>/audits/</b>",
    ]
    for i in items:
        elements.append(bullet(i))
    return elements


def section_luis():
    elements = []
    elements.append(PageBreak())
    elements.append(Paragraph("Luis — Módulo de Reportes", h1_style))
    elements.append(Paragraph(
        "Este módulo <b>no tiene modelos propios</b> — consulta los otros módulos y "
        "produce información agregada. Por eso es el último en complejidad estructural, "
        "pero requiere entender bien las queries de Django.",
        body_style,
    ))
    elements.append(Paragraph(
        "<b>Importante:</b> espera a que los demás módulos estén listos antes de probar. "
        "Mientras tanto puedes ir armando la estructura y dejar los endpoints retornando "
        "datos vacíos.",
        note_style,
    ))

    elements.append(Paragraph("Endpoints sugeridos", h2_style))
    data = [
        ["Endpoint", "Qué retorna"],
        ["GET /reports/donations/", "Totales de donaciones, por fecha, donante, estado"],
        ["GET /reports/donors/", "Donantes activos, top donantes por monto"],
        ["GET /reports/beneficiaries/", "Beneficiarios atendidos por proyecto"],
        ["GET /reports/projects/", "Proyectos por estado y métricas"],
        ["GET /reports/dashboard/", "Métricas generales (totales, contadores)"],
    ]
    t = Table(data, colWidths=[2.2 * inch, 4.3 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LIGHT, colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.4, GRAY),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    elements.append(t)

    elements.append(Paragraph("Patrón a usar — APIView, no ModelViewSet", h2_style))
    elements.append(Paragraph(
        "Como no manejas un modelo propio, usa <b>APIView</b> y construye respuestas con "
        "<b>aggregate</b> y <b>annotate</b> del ORM de Django.",
        body_style,
    ))
    elements.append(code_block(
        "from rest_framework.views import APIView\n"
        "from rest_framework.response import Response\n"
        "from django.db.models import Sum, Count, Avg\n"
        "from donations.models import Donation\n\n"
        "class DonationsReportView(APIView):\n"
        "    def get(self, request):\n"
        "        total = Donation.objects.filter(is_active=True).aggregate(\n"
        "            total=Sum('amount'),\n"
        "            count=Count('id'),\n"
        "        )\n"
        "        by_status = Donation.objects.filter(is_active=True).values('status').annotate(\n"
        "            count=Count('id'),\n"
        "            total=Sum('amount'),\n"
        "        )\n"
        "        return Response({\n"
        "            'total': total,\n"
        "            'by_status': list(by_status),\n"
        "        })"
    ))

    elements.append(Paragraph("Filtros por query params", h2_style))
    elements.append(Paragraph(
        "Los reportes deben aceptar parámetros para filtrar por rango de fechas, "
        "proyecto, donante, etc.",
        body_style,
    ))
    elements.append(code_block(
        "/reports/donations/?from=2026-01-01&to=2026-12-31&status=COMPLETED"
    ))
    elements.append(Paragraph(
        "Léelos con <b>request.query_params.get('from')</b> dentro del método <b>get</b>.",
        body_style,
    ))

    elements.append(Paragraph("Exportar a Excel", h2_style))
    elements.append(bullet("Reutiliza <b>utils/exporters.py</b> — ya tiene helpers para generar archivos Excel."))
    elements.append(bullet("Agrega un endpoint adicional <b>/reports/donations/export/</b> que devuelva el archivo."))

    elements.append(Paragraph("URLs", h2_style))
    elements.append(Paragraph(
        "Como son APIViews, no uses <b>DefaultRouter</b>. Usa <b>path()</b> manual:",
        body_style,
    ))
    elements.append(code_block(
        "from django.urls import path\n"
        "from .views import (\n"
        "    DonationsReportView, DonorsReportView, BeneficiariesReportView,\n"
        "    ProjectsReportView, DashboardReportView,\n"
        ")\n\n"
        "urlpatterns = [\n"
        "    path('reports/donations/', DonationsReportView.as_view()),\n"
        "    path('reports/donors/', DonorsReportView.as_view()),\n"
        "    path('reports/beneficiaries/', BeneficiariesReportView.as_view()),\n"
        "    path('reports/projects/', ProjectsReportView.as_view()),\n"
        "    path('reports/dashboard/', DashboardReportView.as_view()),\n"
        "]"
    ))

    elements.append(Paragraph("Checklist Luis", h2_style))
    items = [
        "App <b>reports</b> creada",
        "Registrada en <b>INSTALLED_APPS</b> y <b>backend/urls.py</b>",
        "5 APIViews creadas (Donations, Donors, Beneficiaries, Projects, Dashboard)",
        "Cada endpoint acepta filtros por query params",
        "Uso correcto de <b>aggregate</b> y <b>annotate</b>",
        "Endpoint de export a Excel funcionando",
        "Probado con datos reales en los otros módulos",
    ]
    for i in items:
        elements.append(bullet(i))
    return elements


def section_workflow():
    elements = []
    elements.append(PageBreak())
    elements.append(Paragraph("5. Flujo de Trabajo con Git", h1_style))

    elements.append(Paragraph("Antes de empezar", h2_style))
    elements.append(code_block(
        "git checkout dev\n"
        "git pull origin dev\n"
        "git checkout -b <tu-nombre>"
    ))

    elements.append(Paragraph("Mientras trabajas", h2_style))
    elements.append(code_block(
        "git add .\n"
        "git commit -m \"Add <descripcion>\"\n"
        "git push origin <tu-nombre>"
    ))

    elements.append(Paragraph("Cuando termines", h2_style))
    elements.append(bullet("Abre un <b>Pull Request</b> de tu rama hacia <b>dev</b> en GitHub."))
    elements.append(bullet("Describe brevemente qué hiciste."))
    elements.append(bullet("Espera la revisión antes de mergear."))

    elements.append(Paragraph("Nombres de commits", h2_style))
    elements.append(bullet("<b>Add projects module backend</b>"))
    elements.append(bullet("<b>Add audits service and log_event integration</b>"))
    elements.append(bullet("<b>Add reports module with donations and dashboard endpoints</b>"))
    elements.append(bullet("<b>Fix migrations conflict in projects</b>"))
    return elements


def section_checklist_final():
    elements = []
    elements.append(Paragraph("6. Checklist Final Antes del Pull Request", h1_style))
    items = [
        "El servidor arranca sin errores (<b>python manage.py runserver</b>).",
        "Los endpoints responden 401 al pegarlos en el navegador.",
        "Las migraciones están creadas y aplicadas.",
        "No commiteaste <b>.pyc</b>, <b>venv/</b>, <b>.env</b>.",
        "El nombre de la rama es tu nombre.",
        "El commit empieza con un verbo en imperativo en inglés.",
        "Hiciste <b>git pull origin dev</b> antes de pushear (para no traer conflictos).",
        "Probaste tu módulo manualmente: crear, listar, editar, eliminar.",
        "No hay imports sin usar ni código comentado innecesario.",
    ]
    for i in items:
        elements.append(bullet(i))

    elements.append(Spacer(1, 0.3 * inch))
    elements.append(Paragraph(
        "<b>Si tienes dudas, pregunta antes de improvisar.</b> Es mejor preguntar tres "
        "veces que romper la arquitectura del proyecto.",
        note_style,
    ))
    return elements


def build():
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
        title="MTM-Conecta — Guía de Módulos",
        author="Equipo MTM-Conecta",
    )

    elements = []
    elements.extend(cover_page())
    elements.extend(section_general())
    elements.extend(section_structure())
    elements.extend(section_patterns())
    elements.extend(section_rules())
    elements.extend(section_danna())
    elements.extend(section_jhon())
    elements.extend(section_luis())
    elements.extend(section_workflow())
    elements.extend(section_checklist_final())

    doc.build(elements)
    print(f"PDF generated: {OUTPUT}")


if __name__ == "__main__":
    build()
