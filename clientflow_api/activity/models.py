from django.db import models
from django.conf import settings


class ActivityLog(models.Model):
    ACTION_CHOICES = [
        ('created_client', 'Created Client'),
        ('updated_client', 'Updated Client'),
        ('deleted_client', 'Deleted Client'),
        ('created_project', 'Created Project'),
        ('updated_project', 'Updated Project'),
        ('deleted_project', 'Deleted Project'),
        ('created_task', 'Created Task'),
        ('updated_task', 'Updated Task'),
        ('deleted_task', 'Deleted Task'),
        ('completed_task', 'Completed Task'),
        ('created_invoice', 'Created Invoice'),
        ('updated_invoice', 'Updated Invoice'),
        ('sent_invoice', 'Sent Invoice'),
        ('paid_invoice', 'Marked Invoice as Paid'),
        ('deleted_invoice', 'Deleted Invoice'),
        ('user_login', 'User Login'),
        ('user_logout', 'User Logout'),
        ('file_upload', 'File Upload'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.CharField(max_length=255, blank=True)
    target_type = models.CharField(max_length=50, blank=True)
    target_id = models.PositiveIntegerField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'activity_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.action} - {self.created_at}"
