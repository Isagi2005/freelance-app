from django.contrib import admin
from .models import Client


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'contact_name', 'email', 'status', 'user', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['company_name', 'contact_name', 'email']
    ordering = ['-created_at']
