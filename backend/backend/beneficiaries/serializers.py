from rest_framework import serializers
from .models import Beneficiary, Guardian, AidLogEntry


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


class AidLogEntrySerializer(serializers.ModelSerializer):
    registered_by_name = serializers.SerializerMethodField()

    class Meta:
        model = AidLogEntry
        fields = [
            'id', 'beneficiary', 'delivery_date', 'aid_type',
            'description', 'quantity_value', 'missionary_program',
            'registered_by', 'registered_by_name', 'notes',
            'created_at',
        ]
        read_only_fields = ['registered_by', 'registered_by_name', 'created_at']

    def get_registered_by_name(self, obj):
        if obj.registered_by:
            return f"{obj.registered_by.first_name} {obj.registered_by.last_name}".strip() or obj.registered_by.username
        return None

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['registered_by'] = request.user
        return super().create(validated_data)
