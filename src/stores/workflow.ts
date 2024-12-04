import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Workflow, WorkflowExecution } from '../types/workflow';
import { api } from '../lib/api';

export const useWorkflowStore = defineStore('workflow', () => {
  const workflows = ref<Workflow[]>([]);
  const currentExecution = ref<WorkflowExecution | null>(null);

  const fetchWorkflows = async () => {
    workflows.value = await api.workflows.list();
  };

  const createWorkflow = async (workflow: Omit<Workflow, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    const newWorkflow = await api.workflows.create(workflow);
    workflows.value.unshift(newWorkflow);
    return newWorkflow;
  };

  const executeWorkflow = async (id: string) => {
    currentExecution.value = await api.workflows.execute(id);
    return currentExecution.value;
  };

  return {
    workflows,
    currentExecution,
    fetchWorkflows,
    createWorkflow,
    executeWorkflow
  };
});