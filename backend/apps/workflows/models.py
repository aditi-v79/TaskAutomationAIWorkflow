from django.db import models
import uuid
from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch import receiver

class Workflow(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    tasks = models.JSONField()
    connections = models.JSONField(default=list)
    status = models.CharField(
        max_length=20,
        choices=[
            ('idle', 'Idle'),
            ('running', 'Running'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
        ],
        default='idle'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Invalidate cache
        cache.delete(f'workflow_{self.id}')
        cache.delete('workflow_list')
        
class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workflow = models.ForeignKey(Workflow, related_name='task_objects', on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    config = models.JSONField(default=dict)
    position_x = models.IntegerField()
    position_y = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Connection(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workflow = models.ForeignKey(Workflow, related_name='connection_objects', on_delete=models.CASCADE)
    source = models.ForeignKey(Task, related_name='source_connections', on_delete=models.CASCADE)
    target = models.ForeignKey(Task, related_name='target_connections', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

@receiver(post_save, sender=Workflow)
def invalidate_workflow_cache(sender, instance, **kwargs):
    cache.delete(f'workflow_{instance.id}')
    cache.delete('workflow_list')