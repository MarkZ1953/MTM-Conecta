from django.db.models import Sum, Count, Avg, DecimalField
from django.db.models.functions import TruncDate
from donations.models import Donation, Donor
from beneficiaries.models import Beneficiary
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Value
from utils.exporters import export_xlsx


# ---------------------------------------------------------------------------
# Export column definitions
# ---------------------------------------------------------------------------

DONATIONS_EXPORT_COLUMNS = [
    {"header": "ID", "accessor": lambda obj: obj["donor__id"]},
    {"header": "Donante", "accessor": lambda obj: f"{obj['donor__first_name']} {obj['donor__last_name']}"},
    {"header": "Total Donado", "accessor": lambda obj: obj["total"]},
    {"header": "Cantidad de Donaciones", "accessor": lambda obj: obj["count"]},
]


# ---------------------------------------------------------------------------
# Report Views
# ---------------------------------------------------------------------------

class DonationsReportView(APIView):
    """
    GET /reports/donations/

    Retorna totales de donaciones, agrupados por fecha, donante y estado.

    Query params opcionales:
        from        (YYYY-MM-DD)  Fecha inicio
        to          (YYYY-MM-DD)  Fecha fin
        status      (str)         Estado de la donación: PENDING, COMPLETED, FAILED
        donor_id    (int)         Filtrar por donante
    """

    def get(self, request):
        qs = Donation.objects.filter(is_active=True)

        date_from = request.query_params.get('from')
        date_to = request.query_params.get('to')
        status = request.query_params.get('status')
        donor_id = request.query_params.get('donor_id')

        if date_from:
            qs = qs.filter(date__date__gte=date_from)
        if date_to:
            qs = qs.filter(date__date__lte=date_to)
        if status:
            qs = qs.filter(status=status)
        if donor_id:
            qs = qs.filter(donor_id=donor_id)

        totals = qs.aggregate(
            total=Sum('amount'),
            count=Count('id'),
            average=Avg('amount'),
        )

        by_status = list(
            qs.values('status').annotate(
                count=Count('id'),
                total=Sum('amount'),
            )
        )

        by_date = list(
            qs.annotate(day=TruncDate('date'))
            .values('day')
            .annotate(count=Count('id'), total=Sum('amount'))
            .order_by('day')
        )

        return Response({
            'totals': totals,
            'by_status': by_status,
            'by_date': by_date,
        })


class DonorsReportView(APIView):
    """
    GET /reports/donors/

    Retorna donantes activos y top donantes por monto total donado.

    Query params opcionales:
        from        (YYYY-MM-DD)  Fecha inicio de donaciones
        to          (YYYY-MM-DD)  Fecha fin de donaciones
        limit       (int)         Cantidad de top donantes a mostrar (default: 10)
    """

    def get(self, request):
        date_from = request.query_params.get('from')
        date_to = request.query_params.get('to')
        limit = int(request.query_params.get('limit', 10))

        donations_qs = Donation.objects.filter(is_active=True, status='COMPLETED')

        if date_from:
            donations_qs = donations_qs.filter(date__date__gte=date_from)
        if date_to:
            donations_qs = donations_qs.filter(date__date__lte=date_to)

        active_donors_count = Donor.objects.filter(is_active=True).count()

        top_donors = list(
            donations_qs.values(
                'donor__id',
                'donor__first_name',
                'donor__last_name',
                'donor__email',
            ).annotate(
                total=Sum('amount'),
                count=Count('id'),
            ).order_by('-total')[:limit]
        )

        donors_with_donations = donations_qs.values('donor').distinct().count()

        return Response({
            'active_donors': active_donors_count,
            'donors_with_donations': donors_with_donations,
            'top_donors': top_donors,
        })


class BeneficiariesReportView(APIView):
    """
    GET /reports/beneficiaries/

    Retorna beneficiarios atendidos, con opción de filtrar por proyecto.

    Query params opcionales:
        project_id  (int)   Filtrar por proyecto
        is_active   (bool)  Filtrar por estado (default: true)
    """

    def get(self, request):
        project_id = request.query_params.get('project_id')
        is_active = request.query_params.get('is_active', 'true').lower() != 'false'

        qs = Beneficiary.objects.filter(is_active=is_active)

        total_beneficiaries = qs.count()

        # When the projects module is ready, uncomment this block:
        # if project_id:
        #     qs = qs.filter(projects__id=project_id)
        #
        # by_project = list(
        #     Project.objects.filter(is_active=True)
        #     .annotate(beneficiary_count=Count('beneficiaries'))
        #     .values('id', 'name', 'status', 'beneficiary_count')
        # )

        by_project = []  # Remove when projects module is ready

        return Response({
            'total_beneficiaries': total_beneficiaries,
            'by_project': by_project,
        })


class ProjectsReportView(APIView):
    """
    GET /reports/projects/

    Retorna proyectos agrupados por estado con métricas de beneficiarios.

    Query params opcionales:
        status      (str)   Filtrar por estado: PLANNED, IN_PROGRESS, FINISHED
        from        (YYYY-MM-DD)  Fecha de inicio mínima
        to          (YYYY-MM-DD)  Fecha de inicio máxima
    """

    def get(self, request):
        # Uncomment when projects module is ready:
        # from projects.models import Project
        # status = request.query_params.get('status')
        # date_from = request.query_params.get('from')
        # date_to = request.query_params.get('to')
        #
        # qs = Project.objects.filter(is_active=True)
        #
        # if status:
        #     qs = qs.filter(status=status)
        # if date_from:
        #     qs = qs.filter(start_date__gte=date_from)
        # if date_to:
        #     qs = qs.filter(start_date__lte=date_to)
        #
        # by_status = list(
        #     qs.values('status').annotate(count=Count('id'))
        # )
        #
        # projects_detail = list(
        #     qs.annotate(beneficiary_count=Count('beneficiaries'))
        #     .values('id', 'name', 'status', 'start_date', 'end_date', 'beneficiary_count')
        #     .order_by('-id')
        # )
        #
        # return Response({
        #     'total': qs.count(),
        #     'by_status': by_status,
        #     'projects': projects_detail,
        # })

        # Placeholder until projects module is ready
        return Response({
            'total': 0,
            'by_status': [],
            'projects': [],
            'detail': 'Projects module not yet available.',
        })


class DashboardReportView(APIView):
    """
    GET /reports/dashboard/

    Retorna métricas generales del sistema: totales y contadores de todos
    los módulos.
    """

    def get(self, request):
        total_beneficiaries = Beneficiary.objects.filter(is_active=True).count()
        total_donors = Donor.objects.filter(is_active=True).count()

        donations_summary = Donation.objects.filter(
            is_active=True, status='COMPLETED'
        ).aggregate(
            total_collected=Sum('amount'),
            total_donations=Count('id'),
        )

        donations_by_status = list(
            Donation.objects.filter(is_active=True)
            .values('status')
            .annotate(count=Count('id'), total=Sum('amount'))
        )

        # Uncomment when projects module is ready:
        # from projects.models import Project
        # total_projects = Project.objects.filter(is_active=True).count()
        # projects_by_status = list(
        #     Project.objects.filter(is_active=True)
        #     .values('status').annotate(count=Count('id'))
        # )

        return Response({
            'beneficiaries': {
                'total': total_beneficiaries,
            },
            'donors': {
                'total': total_donors,
            },
            'donations': {
                'total_collected': donations_summary['total_collected'] or 0,
                'total_count': donations_summary['total_donations'] or 0,
                'by_status': donations_by_status,
            },
            'projects': {
                'total': 0,           # Replace with total_projects
                'by_status': [],      # Replace with projects_by_status
            },
        })


# ---------------------------------------------------------------------------
# Export Views
# ---------------------------------------------------------------------------

class DonationsExportView(APIView):
    """
    GET /reports/donations/export/

    Exporta el reporte de donaciones agrupado por donante a un archivo Excel.

    Query params opcionales:
        from        (YYYY-MM-DD)  Fecha inicio
        to          (YYYY-MM-DD)  Fecha fin
        status      (str)         Estado de la donación
    """

    def get(self, request):
        qs = Donation.objects.filter(is_active=True)

        date_from = request.query_params.get('from')
        date_to = request.query_params.get('to')
        status = request.query_params.get('status')

        if date_from:
            qs = qs.filter(date__date__gte=date_from)
        if date_to:
            qs = qs.filter(date__date__lte=date_to)
        if status:
            qs = qs.filter(status=status)

        grouped_qs = (
            qs.values(
                'donor__id',
                'donor__first_name',
                'donor__last_name',
                'donor__email',
            ).annotate(
                total=Sum('amount'),
                count=Count('id'),
            ).order_by('-total')
        )

        EXPORT_COLUMNS = [
            {"header": "ID Donante", "accessor": lambda obj: obj['donor__id']},
            {"header": "Nombre", "accessor": lambda obj: obj['donor__first_name']},
            {"header": "Apellido", "accessor": lambda obj: obj['donor__last_name']},
            {"header": "Email", "accessor": lambda obj: obj['donor__email']},
            {"header": "Total Donado", "accessor": lambda obj: obj['total']},
            {"header": "# Donaciones", "accessor": lambda obj: obj['count']},
        ]

        # export_xlsx expects a queryset with .iterator(), so we wrap the list
        class QuerysetWrapper:
            def __init__(self, data):
                self.data = data

            def iterator(self):
                return iter(self.data)

        return export_xlsx(
            QuerysetWrapper(list(grouped_qs)),
            EXPORT_COLUMNS,
            filename="reporte_donaciones.xlsx",
            sheet_name="Donaciones",
        )