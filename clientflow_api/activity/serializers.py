from rest_framework import serializers
from .models import ActivityLog
from accounts.serializers import UserSerializer


class ActivityLogSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = ActivityLog
        fields = ['id', 'user', 'user_details', 'action', 'description', 'target_type', 'target_id', 'metadata', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class ActivityLogCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = ['action', 'description', 'target_type', 'target_id', 'metadata']
