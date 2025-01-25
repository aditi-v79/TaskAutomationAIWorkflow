from django.contrib import admin
from django.urls import path, include
from rest_framework_nested import routers
from rest_framework.routers import DefaultRouter
from apps.workflows.views import WorkflowViewSet, TaskViewSet, ConnectionViewSet
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Workflow Automation API",
        default_version='v1',
        description="API documentation for the Workflow Automation Platform",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = DefaultRouter()
router.register(r'workflows', WorkflowViewSet)
workflows_router = routers.NestedDefaultRouter(router, r'workflows', lookup='workflow')
workflows_router.register(r'tasks', TaskViewSet, basename='workflow-tasks')
workflows_router.register(r'connections', ConnectionViewSet, basename='workflow-connections')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include(workflows_router.urls)),
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0)),
]