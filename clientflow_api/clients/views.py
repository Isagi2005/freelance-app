from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Client
from .serializers import ClientSerializer


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['company_name', 'contact_name', 'email']
    ordering_fields = ['created_at', 'company_name']

    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = self.get_queryset().count()
        active = self.get_queryset().filter(status='active').count()
        inactive = self.get_queryset().filter(status='inactive').count()
        leads = self.get_queryset().filter(status='lead').count()

        return Response({
            'total': total,
            'active': active,
            'inactive': inactive,
            'leads': leads
        })
