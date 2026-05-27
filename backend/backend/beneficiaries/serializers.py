from rest_framework import serializers
from .models import Beneficiary, Guardian


class BeneficiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiary
        fields = [
            'id', 'first_name', 'last_name', 'birth_date',
            'identification_number', 'municipality', 'treatment_stage',
            'treatment_status', 'received_aid', 'follow_up_notes',
            'photo', 'authorization_doc', 'registration_date', 'notes',
            'is_active'
        ]
        read_only_fields = ['registration_date']


class GuardianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guardian
        fields = [
            'id', 'beneficiary', 'first_name', 'last_name',
            'identification_number', 'phone_number', 'email', 'is_active'
        ]
