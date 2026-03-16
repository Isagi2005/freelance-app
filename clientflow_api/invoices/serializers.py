from rest_framework import serializers
from .models import Invoice, InvoiceItem
from clients.serializers import ClientSerializer
from projects.serializers import ProjectSummarySerializer


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'total']
        read_only_fields = ['id', 'total']


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    client_details = ClientSerializer(source='client', read_only=True)
    project_details = ProjectSummarySerializer(source='project', read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'user', 'project', 'project_details', 'client', 'client_details', 'invoice_number', 'status', 'issue_date', 'due_date', 'subtotal', 'tax_rate', 'tax_amount', 'total', 'notes', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'subtotal', 'tax_amount', 'total']


class InvoiceCreateSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)

    class Meta:
        model = Invoice
        fields = ['project', 'client', 'invoice_number', 'status', 'issue_date', 'due_date', 'tax_rate', 'notes', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        invoice = Invoice.objects.create(**validated_data)

        subtotal = 0
        for item_data in items_data:
            item = InvoiceItem.objects.create(invoice=invoice, **item_data)
            subtotal += item.total

        invoice.subtotal = subtotal
        invoice.tax_amount = subtotal * (invoice.tax_rate / 100)
        invoice.total = subtotal + invoice.tax_amount
        invoice.save()

        return invoice


class InvoiceSummarySerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.company_name', read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'status', 'total', 'client_name', 'due_date']
