from django.http import HttpResponse
from openpyxl import Workbook
import csv


def build_row(obj, columns):
    return [col["accessor"](obj) for col in columns]
  
  
def export_xlsx(qs, columns, filename="export.xlsx", sheet_name="Datos"):
    wb = Workbook()
    ws = wb.active
    ws.title = sheet_name

    ws.append([col["header"] for col in columns])

    for obj in qs.iterator():
        ws.append(build_row(obj, columns))

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = f'attachment; filename="{filename}"'

    wb.save(response)
    return response


def export_csv(qs, columns, filename="export.csv"):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'

    writer = csv.writer(response)
    writer.writerow([col["header"] for col in columns])

    for obj in qs.iterator():
        writer.writerow(build_row(obj, columns))

    return response
