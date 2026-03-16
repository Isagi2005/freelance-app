from django.contrib import admin
from .models import ActivityLog


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ['action', 'user', 'target_type', 'target_id', 'created_at']
    list_filter = ['action', 'created_at']
    search_fields = ['action', 'description', 'target_type']
    ordering = ['-created_at']
