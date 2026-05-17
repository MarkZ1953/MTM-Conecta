from rest_framework import serializers
from .models import Event, Attendance, EventAct, Evidence


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = [
            'id', 'beneficiary', 'event', 'attended', 'notes'
        ]


class EventActSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAct
        fields = [
            'id', 'event', 'content', 'digital_signature_path',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['created_at', 'updated_at']


class EvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidence
        fields = [
            'id', 'event', 'file', 'description',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['created_at', 'updated_at']


class EventSerializer(serializers.ModelSerializer):
    attendees_count = serializers.SerializerMethodField()
    evidences_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date',
            'location', 'attendees_count', 'evidences_count',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_attendees_count(self, obj):
        return obj.attendances.count()

    def get_evidences_count(self, obj):
        return obj.evidences.count()


class EventDetailSerializer(serializers.ModelSerializer):
    """
    Serializer para detalle completo de Event incluyendo relaciones.
    """
    attendances = AttendanceSerializer(many=True, read_only=True)
    evidences = EvidenceSerializer(many=True, read_only=True)
    act = EventActSerializer(read_only=True)
    attendees_count = serializers.SerializerMethodField()
    evidences_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date',
            'location', 'attendees', 'attendances', 'evidences', 'act',
            'attendees_count', 'evidences_count',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_attendees_count(self, obj):
        return obj.attendances.count()

    def get_evidences_count(self, obj):
        return obj.evidences.count()
