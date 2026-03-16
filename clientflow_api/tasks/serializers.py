from rest_framework import serializers
from .models import Task
from projects.serializers import ProjectSummarySerializer


class TaskSerializer(serializers.ModelSerializer):
    project_details = ProjectSummarySerializer(source='project', read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'user', 'project', 'project_details', 'title', 'description', 'status', 'priority', 'due_date', 'estimated_hours', 'actual_hours', 'created_at', 'updated_at', 'completed_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class TaskSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'status', 'priority', 'due_date']
