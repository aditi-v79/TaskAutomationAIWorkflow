from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.cache import cache
from django.conf import settings
from .models import Workflow
from .serializers import WorkflowSerializer, TaskSerializer, ConnectionSerializer
from apps.executions.tasks import execute_workflow
from .constants import VALID_TASK_CONNECTIONS


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
    
    @action(detail=False, methods=['POST'])
    async def execute_task(self, request):
        try:
            node_id = request.data.get('nodeId')
            task_type = request.data.get('type')
            config = request.data.get('config')
            
            # Map frontend task types to service method names
            method_mapping = {
                'scraping': 'scrape_web',
                'summarization': 'summarize_text',
                'classification': 'classify_image',
                'email': 'send_email'
            }
            
            # Get the correct method name
            method_name = method_mapping.get(task_type)
            if not method_name:
                return Response({
                    'nodeId': node_id,
                    'error': f'Invalid task type: {task_type}',
                    'status': 'error'
                }, status=400)

            # Initialize ML service and execute
            ml_service = MLService()
            result = await getattr(ml_service, method_name)(config)
            
            return Response({
                'nodeId': node_id,
                'result': result,
                'status': 'success'
            })

        except Exception as e:
            return Response({
                'nodeId': node_id,
                'error': str(e),
                'status': 'error'
            }, status=400)

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