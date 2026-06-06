from django.db.models import Sum, Count, Avg, Q
from rest_framework.response import Response
from rest_framework.views import APIView

from donations.models import Donation, Donor
from beneficiaries.models import Beneficiary
from projects.models import Project
from access.permissions import (
    CanViewBeneficiaryReports,
    CanViewDashboardReports,
    CanViewFinancialReports,
    CanViewProjectReports,
)

from .utils import apply_date_range


class DonationsReportView(APIView):
    """
    GET /reports/donations/

    Optional query params:
        from=YYYY-MM-DD
        to=YYYY-MM-DD
        status=PENDING|COMPLETED|FAILED
    """
    permission_classes = [CanViewFinancialReports]

    def get(self, request):
        qs = Donation.objects.filter(is_active=True)
        qs = apply_date_range(qs, request, field='date')

        status_filter = request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)

        totals = qs.aggregate(
            total_amount=Sum('amount'),
            count=Count('id'),
            average=Avg('amount'),
        )

        by_status = list(
            qs.values('status').annotate(
                count=Count('id'),
                total=Sum('amount'),
            ).order_by('status')
        )

        top_donors = list(
            qs.values('donor', 'donor__first_name', 'donor__last_name')
            .annotate(
                total=Sum('amount'),
                count=Count('id'),
            )
            .order_by('-total')[:10]
        )

        return Response({
            "totals": totals,
            "by_status": by_status,
            "top_donors": top_donors,
        })


class DonorsReportView(APIView):
    """GET /reports/donors/ — donor statistics and rankings."""
    permission_classes = [CanViewFinancialReports]

    def get(self, request):
        active_donors = Donor.objects.filter(is_active=True)

        totals = {
            "active_donors": active_donors.count(),
            "with_donations": active_donors.filter(donations__isnull=False).distinct().count(),
        }

        ranking = list(
            active_donors.annotate(
                donation_count=Count('donations', filter=Q(donations__is_active=True)),
                donation_total=Sum('donations__amount', filter=Q(donations__is_active=True)),
            )
            .values('id', 'first_name', 'last_name', 'email', 'donation_count', 'donation_total')
            .order_by('-donation_total')[:20]
        )

        return Response({
            "totals": totals,
            "ranking": ranking,
        })


class BeneficiariesReportView(APIView):
    """GET /reports/beneficiaries/ — beneficiary statistics by project."""
    permission_classes = [CanViewBeneficiaryReports]

    def get(self, request):
        active_beneficiaries = Beneficiary.objects.filter(is_active=True)

        totals = {
            "active_beneficiaries": active_beneficiaries.count(),
            "in_projects": active_beneficiaries.filter(projects__isnull=False).distinct().count(),
        }

        by_project = list(
            Project.objects.filter(is_active=True)
            .annotate(
                beneficiary_count=Count(
                    'beneficiaries',
                    filter=Q(beneficiaries__is_active=True),
                    distinct=True,
                )
            )
            .values('id', 'name', 'status', 'beneficiary_count')
            .order_by('-beneficiary_count')
        )

        return Response({
            "totals": totals,
            "by_project": by_project,
        })


class ProjectsReportView(APIView):
    """GET /reports/projects/ — project statistics by status."""
    permission_classes = [CanViewProjectReports]

    def get(self, request):
        qs = Project.objects.filter(is_active=True)

        totals = {
            "total": qs.count(),
        }

        by_status = list(
            qs.values('status').annotate(
                count=Count('id'),
            ).order_by('status')
        )

        with_metrics = list(
            qs.annotate(
                beneficiary_count=Count(
                    'beneficiaries',
                    filter=Q(beneficiaries__is_active=True),
                    distinct=True,
                ),
            )
            .values('id', 'name', 'status', 'start_date', 'end_date', 'beneficiary_count')
            .order_by('-start_date')
        )

        return Response({
            "totals": totals,
            "by_status": by_status,
            "projects": with_metrics,
        })


class DashboardReportView(APIView):
    """GET /reports/dashboard/ — high level metrics for the dashboard."""
    permission_classes = [CanViewDashboardReports]

    def get(self, request):
        donations_qs = Donation.objects.filter(is_active=True)
        donations_totals = donations_qs.aggregate(
            total_amount=Sum('amount'),
            count=Count('id'),
        )

        return Response({
            "beneficiaries": Beneficiary.objects.filter(is_active=True).count(),
            "donors": Donor.objects.filter(is_active=True).count(),
            "donations": {
                "count": donations_totals.get("count") or 0,
                "total_amount": donations_totals.get("total_amount") or 0,
            },
            "projects": {
                "total": Project.objects.filter(is_active=True).count(),
                "in_progress": Project.objects.filter(
                    is_active=True, status='IN_PROGRESS'
                ).count(),
                "finished": Project.objects.filter(
                    is_active=True, status='FINISHED'
                ).count(),
            },
        })
