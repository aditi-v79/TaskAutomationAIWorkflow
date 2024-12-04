from rest_framework import serializers
from .models import Workflow

class WorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workflow
        fields = '__all__'
        read_only_fields = ('id', 'status', 'created_at', 'updated_at')