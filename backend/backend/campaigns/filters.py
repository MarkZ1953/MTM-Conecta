import django_filters
from .models import Campaign


class CampaignFilter(django_filters.FilterSet):
    class Meta:
        model = Campaign
        fields = {
            'subject': ['exact', 'icontains'],
            'content_type': ['exact'],
            'recipient_group': ['exact'],
            'status': ['exact'],
            'is_active': ['exact'],
        }