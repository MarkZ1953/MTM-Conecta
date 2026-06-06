import django_filters

from .models import NewsletterSubscriber


class NewsletterSubscriberFilter(django_filters.FilterSet):
    class Meta:
        model = NewsletterSubscriber
        fields = {
            'email': ['exact', 'icontains', 'istartswith'],
            'name': ['exact', 'icontains', 'istartswith'],
            'status': ['exact'],
            'origin': ['exact'],
            'consent': ['exact'],
            'subscribed_at': ['exact', 'date', 'date__lt', 'date__gt', 'lt', 'gt', 'lte', 'gte'],
            'is_active': ['exact'],
        }
