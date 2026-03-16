from rest_framework import serializers
from .models import Project
from clients.serializers import ClientSerializer


class ProjectSerializer(serializers.ModelSerializer):
    client_details = ClientSerializer(source='client', read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'user', 'client', 'client_details', 'name', 'description', 'status', 'priority', 'budget', 'start_date', 'end_date', 'progress', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class ProjectSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'status', 'progress']
