from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import ActivityLog
from .serializers import ActivityLogSerializer, ActivityLogCreateSerializer


class ActivityLogViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['action', 'target_type']
    ordering_fields = ['created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return ActivityLogCreateSerializer
        return ActivityLogSerializer

    def get_queryset(self):
        return ActivityLog.objects.filter(user=self.request.user).select_related('user')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
