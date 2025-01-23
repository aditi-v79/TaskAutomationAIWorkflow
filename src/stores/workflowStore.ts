import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Workflow, Task } from '../types/workflow';
import { api } from '../lib/api';

export const useWorkflowStore = defineStore('workflow', () => {
  const workflows = ref<Workflow[]>([]);
  const currentWorkflow = ref<Workflow | null>(null);

  const fetchWorkflows = async () => {
    try {
      const response = await api.workflows.list();
      workflows.value = response;
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
      // Initialize with empty array if API fails
      workflows.value = [];
    }
  };

  const createWorkflow = async (name: string, description: string) => {
    try {
      const workflow = await api.workflows.create({
        name,
        description,
        tasks: [],
        connections: []
      });
      workflows.value.unshift(workflow);
      currentWorkflow.value = workflow;
      return workflow;
    } catch (error) {
      console.error('Failed to create workflow:', error);
      // Create local workflow if API fails
      const workflow: Workflow = {
        id: crypto.randomUUID(),
        name,
        description,
        tasks: [],
        connections: [],
        status: 'idle',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      workflows.value.unshift(workflow);
      currentWorkflow.value = workflow;
      return workflow;
    }
  };

  const loadWorkflow = async (id: string) => {
    try {
      currentWorkflow.value = await api.workflows.get(id);
    } catch (error) {
      console.error('Failed to load workflow:', error);
      // Find workflow in local state if API fails
      currentWorkflow.value = workflows.value.find(w => w.id === id) || null;
    }
  };

  const addTask = async (type: Task['type'], name: string, position: { x: number, y: number }) => {
    if (!currentWorkflow.value) return;

    const task: Task = {
      id: crypto.randomUUID(),
      type,
      name,
      position,
    };

    currentWorkflow.value.tasks.push(task);
    await updateWorkflow();
  };

  const updateTaskPosition = async (taskId: string, position: { x: number, y: number }) => {
    if (!currentWorkflow.value) return;

    const task = currentWorkflow.value.tasks.find(t => t.id === taskId);
    if (task) {
      task.position = position;
      await updateWorkflow();
    }
  };

  const updateWorkflow = async () => {
    if (!currentWorkflow.value) return;
    
    try {
      const updated = await api.workflows.update(
        currentWorkflow.value.id,
        currentWorkflow.value
      );
      currentWorkflow.value = updated;
      
      // Update the workflow in the list
      const index = workflows.value.findIndex(w => w.id === updated.id);
      if (index !== -1) {
        workflows.value[index] = updated;
      }
    } catch (error) {
      console.error('Failed to update workflow:', error);
      // Update local state even if API fails
      const index = workflows.value.findIndex(w => w.id === currentWorkflow.value?.id);
      if (index !== -1) {
        workflows.value[index] = {
          ...currentWorkflow.value,
          updated_at: new Date().toISOString()
        };
      }
    }
  };

  const executeWorkflow = async (id: string) => {
    try {
      const execution = await api.workflows.execute(id);
      // Update workflow status in local state
      const workflow = workflows.value.find(w => w.id === id);
      if (workflow) {
        workflow.status = 'running';
      }
      return execution;
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      throw error;
    }
  };

  return {
    workflows,
    currentWorkflow,
    fetchWorkflows,
    createWorkflow,
    loadWorkflow,
    addTask,
    updateTaskPosition,
    updateWorkflow,
    executeWorkflow
  };
});