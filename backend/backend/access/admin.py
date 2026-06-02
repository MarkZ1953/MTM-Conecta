from django.contrib import admin
from .models import UserAccountProfile


@admin.register(UserAccountProfile)
class UserAccountProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "google_email", "marketing_opt_in", "news_opt_in", "updated_at")
    search_fields = ("user__username", "user__email", "google_email")
