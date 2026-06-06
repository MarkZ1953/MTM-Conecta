from django.contrib import admin

from .models import BlogPost


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'published_at', 'is_active')
    list_filter = ('status', 'is_active', 'published_at')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'summary', 'content')

