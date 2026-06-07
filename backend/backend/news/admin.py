from django.contrib import admin

from .models import InstagramPost


@admin.register(InstagramPost)
class InstagramPostAdmin(admin.ModelAdmin):
    list_display = ('instagram_id', 'media_type', 'timestamp', 'is_visible', 'is_featured', 'is_active')
    list_filter = ('media_type', 'is_visible', 'is_featured', 'is_active')
    search_fields = ('instagram_id', 'caption')
    readonly_fields = ('instagram_id', 'media_type', 'media_url', 'thumbnail_url', 'permalink', 'timestamp', 'children')

