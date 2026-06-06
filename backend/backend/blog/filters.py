import django_filters

from .models import BlogPost


class BlogPostFilter(django_filters.FilterSet):
    class Meta:
        model = BlogPost
        fields = {
            'title': ['exact', 'icontains', 'istartswith'],
            'slug': ['exact', 'icontains'],
            'status': ['exact'],
            'published_at': ['exact', 'date', 'date__lt', 'date__gt', 'lt', 'gt', 'lte', 'gte'],
            'is_active': ['exact'],
        }

