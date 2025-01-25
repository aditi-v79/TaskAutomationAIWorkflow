from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.cache import cache
from django.conf import settings
from .models import Workflow
from .serializers import WorkflowSerializer
from apps.executions.tasks import execute_workflow

class WorkflowViewSet(viewsets.ModelViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    filterset_fields = ['status']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        if self.action == 'list':
            cache_key = 'workflow_list'
            queryset = cache.get(cache_key)
            if queryset is None:
                queryset = super().get_queryset()
                cache.set(cache_key, queryset, timeout=settings.CACHE_TTL)
            return queryset
        return super().get_queryset()

    def get_object(self):
        obj = cache.get(f'workflow_{self.kwargs["pk"]}')
        if obj is None:
            obj = super().get_object()
            cache.set(f'workflow_{obj.id}', obj, timeout=settings.CACHE_TTL)
        return obj

    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        workflow = self.get_object()
        execution = execute_workflow.delay(str(workflow.id))
        return Response({
            'execution_id': execution.id,
            'status': 'started'
        })

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(workflow_id=self.kwargs['workflow_pk'])

    def perform_create(self, serializer):
        workflow = Workflow.objects.get(pk=self.kwargs['workflow_pk'])
        serializer.save(workflow=workflow)

class ConnectionViewSet(viewsets.ModelViewSet):
    serializer_class = ConnectionSerializer

    def get_queryset(self):
        return Connection.objects.filter(workflow_id=self.kwargs['workflow_pk'])

    def perform_create(self, serializer):
        workflow = Workflow.objects.get(pk=self.kwargs['workflow_pk'])
        serializer.save(workflow=workflow)