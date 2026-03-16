from django.contrib import admin
from .models import Invoice, InvoiceItem


class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'client', 'project', 'status', 'total', 'user', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['invoice_number', 'notes']
    ordering = ['-created_at']
    inlines = [InvoiceItemInline]
