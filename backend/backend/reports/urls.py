from django.urls import path
from .views import (
    DonationsReportView,
    DonorsReportView,
    BeneficiariesReportView,
    ProjectsReportView,
    DashboardReportView,
    DonationsExportView,
)

urlpatterns = [
    path('reports/donations/', DonationsReportView.as_view(), name='report-donations'),
    path('reports/donations/export/', DonationsExportView.as_view(), name='report-donations-export'),
    path('reports/donors/', DonorsReportView.as_view(), name='report-donors'),
    path('reports/beneficiaries/', BeneficiariesReportView.as_view(), name='report-beneficiaries'),
    path('reports/projects/', ProjectsReportView.as_view(), name='report-projects'),
    path('reports/dashboard/', DashboardReportView.as_view(), name='report-dashboard'),
]