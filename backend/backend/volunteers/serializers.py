from rest_framework import serializers
from django.db import models
from .models import Volunteer, VolunteerAvailability, VolunteerTask
from projects.models import Project


class VolunteerAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerAvailability
        fields = ['id', 'volunteer', 'day_of_week', 'start_time', 'end_time', 'is_active']
        extra_kwargs = {
            'volunteer': {'required': False, 'allow_null': True}
        }


class VolunteerTaskSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = VolunteerTask
        fields = ['id', 'volunteer', 'title', 'description', 'hours_spent', 'date', 'project', 'project_name', 'is_active']


class VolunteerSerializer(serializers.ModelSerializer):
    availabilities = VolunteerAvailabilitySerializer(many=True, required=False)
    total_hours_spent = serializers.SerializerMethodField()

    class Meta:
        model = Volunteer
        fields = [
            'id', 'first_name', 'last_name', 'identification_number',
            'email', 'phone', 'profession', 'support_area', 'status',
            'notes', 'availabilities', 'total_hours_spent', 'is_active'
        ]

    def get_total_hours_spent(self, obj):
        # Calculate sum of hours spent across all tasks associated
        return obj.tasks.aggregate(total=models.Sum('hours_spent'))['total'] or 0.00

    def create(self, validated_data):
        availabilities_data = validated_data.pop('availabilities', [])
        volunteer = Volunteer.objects.create(**validated_data)
        for avail_data in availabilities_data:
            avail_data.pop('volunteer', None)
            VolunteerAvailability.objects.create(volunteer=volunteer, **avail_data)
        return volunteer

    def update(self, instance, validated_data):
        availabilities_data = validated_data.pop('availabilities', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if availabilities_data is not None:
            instance.availabilities.all().delete()
            for avail_data in availabilities_data:
                avail_data.pop('volunteer', None)
                VolunteerAvailability.objects.create(volunteer=instance, **avail_data)
                
        return instance
