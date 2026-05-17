from django.contrib import admin
from .models import Event, Attendance, EventAct, Evidence

admin.site.register(Event)
admin.site.register(Attendance)
admin.site.register(EventAct)
admin.site.register(Evidence)
