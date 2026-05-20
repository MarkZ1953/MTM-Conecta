from django.urls import path

from .views import (
    DonationsReportView,
    DonorsReportView,
    BeneficiariesReportView,
    ProjectsReportView,
    DashboardReportView,
)

urlpatterns = [
    path('reports/donations/', DonationsReportView.as_view(), name='reports-donations'),
    path('reports/donors/', DonorsReportView.as_view(), name='reports-donors'),
    path('reports/beneficiaries/', BeneficiariesReportView.as_view(), name='reports-beneficiaries'),
    path('reports/projects/', ProjectsReportView.as_view(), name='reports-projects'),
    path('reports/dashboard/', DashboardReportView.as_view(), name='reports-dashboard'),
]
