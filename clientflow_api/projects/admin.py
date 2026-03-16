from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'client', 'status', 'priority', 'user', 'created_at']
    list_filter = ['status', 'priority', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['-created_at']
