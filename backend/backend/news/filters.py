import django_filters

from .models import InstagramPost


class InstagramPostFilter(django_filters.FilterSet):
    class Meta:
        model = InstagramPost
        fields = {
            'instagram_id': ['exact', 'icontains'],
            'media_type': ['exact'],
            'timestamp': ['exact', 'date', 'date__lt', 'date__gt', 'lt', 'gt', 'lte', 'gte'],
            'is_visible': ['exact'],
            'is_featured': ['exact'],
            'is_active': ['exact'],
        }

