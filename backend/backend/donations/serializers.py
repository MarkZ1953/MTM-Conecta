from rest_framework import serializers
from .models import Donor, Donation


class DonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = [
            'id', 'user', 'donor_type', 'organization_name',
            'first_name', 'last_name', 'email', 'subscription_amount',
            'payment_day', 'category', 'marketing_opt_in', 'is_active'
        ]
        read_only_fields = ['category']

    def validate_payment_day(self, value):
        if value < 1 or value > 28:
            raise serializers.ValidationError("El día de pago debe estar entre 1 y 28.")
        return value


class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = [
            'id', 'donor', 'amount', 'donation_type', 'date',
            'status', 'is_active'
        ]
        read_only_fields = ['date']
