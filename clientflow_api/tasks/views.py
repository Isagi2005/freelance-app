from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'project']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'due_date', 'priority']

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).select_related('project')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = self.get_queryset().count()
        todo = self.get_queryset().filter(status='todo').count()
        in_progress = self.get_queryset().filter(status='in_progress').count()
        done = self.get_queryset().filter(status='done').count()

        return Response({
            'total': total,
            'todo': todo,
            'in_progress': in_progress,
            'done': done
        })

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        task.status = 'done'
        task.completed_at = timezone.now()
        task.save()
        return Response({'status': 'Task marked as complete'})
