from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'company_name', 'is_active', 'created_at']
    list_filter = ['is_active', 'is_freelancer', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name', 'company_name']
    ordering = ['-created_at']

    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone', 'company_name', 'avatar', 'is_freelancer')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('email', 'first_name', 'last_name', 'phone', 'company_name')}),
    )
