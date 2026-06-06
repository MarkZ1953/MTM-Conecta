from django.contrib import admin

from .models import NewsletterSubscriber


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'status', 'origin', 'consent', 'subscribed_at')
    list_filter = ('status', 'origin', 'consent', 'is_active')
    search_fields = ('email', 'name')
