from rest_framework import serializers
from .models import Company, CollectionPoint, CollectionRequest


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'id', 'nit', 'business_name', 'contact_name',
            'contact_email', 'contact_phone', 'is_active'
        ]


class CollectionPointSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(
        source='company.business_name', read_only=True
    )

    class Meta:
        model = CollectionPoint
        fields = [
            'id', 'company', 'company_name', 'name', 'address',
            'municipality', 'department', 'contact_name',
            'contact_phone', 'is_active'
        ]


class CollectionRequestSerializer(serializers.ModelSerializer):
    collection_point_name = serializers.CharField(
        source='collection_point.name', read_only=True
    )
    company_name = serializers.CharField(
        source='collection_point.company.business_name', read_only=True
    )

    class Meta:
        model = CollectionRequest
        fields = [
            'id', 'collection_point', 'collection_point_name',
            'company_name', 'status', 'estimated_weight_kg',
            'scheduled_date', 'driver_name', 'notes', 'is_active',
            'created_at'
        ]
        read_only_fields = ['created_at']
