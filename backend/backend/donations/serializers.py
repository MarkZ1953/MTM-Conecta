from rest_framework import serializers
from .models import Donor, Donation


class DonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = [
            'id', 'user', 'first_name', 'last_name', 'email', 'is_active'
        ]


class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = [
            'id', 'donor', 'amount', 'date', 'status', 'is_active'
        ]
        read_only_fields = ['date']