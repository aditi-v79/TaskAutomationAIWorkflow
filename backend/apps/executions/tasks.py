import asyncio
from django.utils import timezone
from apps.workflows.models import Workflow
from apps.executions.models import WorkflowExecution
from apps.ml.services import MLService


async def execute_workflow(workflow_id):
    workflow = await Workflow.objects.get(id=workflow_id)
    execution = await WorkflowExecution.objects.create(workflow=workflow)
    
    try:
        workflow.status = 'running'
        await workflow.asave()
        
        ml_service = MLService()
        
        for task in workflow.tasks:
            if task['type'] == 'summarization':
                result = await asyncio.to_thread(
                    ml_service.summarize_text,
                    task['config'].get('text', '')
                )            
            elif task['type'] == 'classification':
                result = await asyncio.to_thread(
                   ml_service.classify_image,
                   task['config'].get('image_url', '')
               )
            
            execution.logs.append({
                'task_id': task['id'],
                'message': f"Task completed: {result}",
                'timestamp': timezone.now().isoformat(),
                'level': 'info'
            })
            await execution.save()
        
        workflow.status = 'completed'
        execution.status = 'completed'
        
    except Exception as e:
        workflow.status = 'failed'
        execution.status = 'failed'
        execution.logs.append({
            'message': str(e),
            'timestamp': timezone.now().isoformat(),
            'level': 'error'
        })
    finally:
        workflow.save()
        execution.completed_at = timezone.now()
        execution.save()
        
    return str(execution.id)