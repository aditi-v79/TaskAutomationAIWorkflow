from rest_framework import serializers
from .models import Workflow, Task, Connection

class WorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workflow
        fields = '__all__'
        read_only_fields = ('id', 'status', 'created_at', 'updated_at')

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'type', 'name', 'config', 'position_x', 'position_y', 'workflow']
        read_only_fields = ('id', 'created_at', 'updated_at')

class ConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        fields = ['id', 'source', 'target', 'workflow']
        read_only_fields = ('id', 'created_at')