from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum
from .models import Invoice
from .serializers import InvoiceSerializer, InvoiceCreateSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'client', 'project']
    search_fields = ['invoice_number', 'notes']
    ordering_fields = ['created_at', 'issue_date', 'due_date', 'total']

    def get_serializer_class(self):
        if self.action == 'create':
            return InvoiceCreateSerializer
        return InvoiceSerializer

    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user).select_related('client', 'project').prefetch_related('items')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        total_count = queryset.count()
        total_amount = queryset.aggregate(total=Sum('total'))['total'] or 0
        paid = queryset.filter(status='paid').aggregate(total=Sum('total'))['total'] or 0
        pending = queryset.filter(status__in=['draft', 'sent']).aggregate(total=Sum('total'))['total'] or 0
        overdue = queryset.filter(status='overdue').aggregate(total=Sum('total'))['total'] or 0

        return Response({
            'total_count': total_count,
            'total_amount': total_amount,
            'paid': paid,
            'pending': pending,
            'overdue': overdue
        })

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = 'paid'
        invoice.save()
        return Response({'status': 'Invoice marked as paid'})

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = 'sent'
        invoice.save()
        return Response({'status': 'Invoice marked as sent'})
