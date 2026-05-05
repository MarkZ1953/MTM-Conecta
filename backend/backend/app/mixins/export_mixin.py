from utils.exporters import export_xlsx, export_csv
from rest_framework.decorators import action
from django.db.models import Case, When
from django.utils import timezone


class ExportMixin:
    export_columns = None
    export_filename = "export"
    export_sheet_name = "Sheet1"
    export_queryset = None

    def get_export_queryset(self):
        if self.export_queryset is not None:
            return self.export_queryset
        return self.get_queryset()

    def filter_export_queryset(self, qs):
        return qs

    @action(detail=False, methods=["post"], url_path="export-excel")
    def export_excel(self, request):
        body = request.data

        mode = body.get("mode", "selected")
        file_format = body.get("format", "xlsx")
        ids = body.get("ids", [])

        qs = self.get_export_queryset()
        qs = self.filter_export_queryset(qs)

        mode_label = "seleccionados" if mode == "selected" else "todos"
        now = timezone.now()

        if mode == "selected" and ids:
            qs = qs.filter(id__in=ids)

            preserved = Case(
                *[When(id=pk, then=pos) for pos, pk in enumerate(ids)]
            )
            qs = qs.order_by(preserved)

        filename = f"{self.export_filename}_{mode_label}_{now.strftime('%Y%m%d_%H%M%S')}"

        if file_format == "csv":
            return export_csv(
                qs,
                self.export_columns,
                filename=f"{filename}.csv",
            )

        return export_xlsx(
            qs,
            self.export_columns,
            filename=f"{filename}.xlsx",
            sheet_name=self.export_sheet_name,
        )