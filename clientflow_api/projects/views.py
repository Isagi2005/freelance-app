from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'client']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'start_date', 'end_date', 'priority']

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user).select_related('client')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = self.get_queryset().count()
        planning = self.get_queryset().filter(status='planning').count()
        in_progress = self.get_queryset().filter(status='in_progress').count()
        completed = self.get_queryset().filter(status='completed').count()

        return Response({
            'total': total,
            'planning': planning,
            'in_progress': in_progress,
            'completed': completed
        })
