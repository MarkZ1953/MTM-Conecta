from rest_framework import serializers
from .models import Donor, Donation


class DonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = [
            'id', 'user', 'donor_type', 'organization_name',
            'first_name', 'last_name', 'email', 'is_active'
        ]


class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = [
            'id', 'donor', 'amount', 'donation_type', 'date',
            'status', 'is_active'
        ]
        read_only_fields = ['date']
