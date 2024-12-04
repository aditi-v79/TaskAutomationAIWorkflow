from django.db import models
import uuid
from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch import receiver

class WorkflowExecution(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workflow = models.ForeignKey('workflows.Workflow', on_delete=models.CASCADE, related_name='executions')
    status = models.CharField(
        max_length=20,
        choices=[
            ('running', 'Running'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
        ],
        default='running'
    )
    logs = models.JSONField(default=list)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['started_at']),
            models.Index(fields=['workflow']),
        ]

    def __str__(self):
        return f"Execution of {self.workflow.name} ({self.status})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Invalidate cache
        cache.delete(f'execution_{self.id}')
        cache.delete(f'workflow_executions_{self.workflow_id}')

@receiver(post_save, sender=WorkflowExecution)
def invalidate_execution_cache(sender, instance, **kwargs):
    cache.delete(f'execution_{instance.id}')
    cache.delete(f'workflow_executions_{instance.workflow_id}')