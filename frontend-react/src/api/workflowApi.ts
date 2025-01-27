import { api } from './index.ts';
import { TaskConfig, Workflow, WorkflowExecution } from '../types/workflowTypes.ts';
import { handleApiError } from './error.ts';

export const workflowApi = {
    list: async (): Promise<Workflow[]> => {
      const response = await api.get('/workflows/');
      return response.data;
    },
  
    get: async (id: string): Promise<Workflow> => {
      const response = await api.get(`/workflows/${id}/`);
      return response.data;
    },
  
    create: async (workflow: Partial<Workflow>): Promise<Workflow> => {
      const response = await api.post('/workflows/', workflow);
      return response.data;
    },
  
    update: async (id: string, workflow: Workflow): Promise<Workflow> => {
      const response = await api.put(`/workflows/${id}/`, workflow);
      return response.data;
    },
  
    delete: async (id: string): Promise<void> => {
      await api.delete(`/workflows/${id}/`);
    },
  
    execute: async (id: string): Promise<WorkflowExecution> => {
      const response = await api.post(`/workflows/${id}/execute/`);
      return response.data;
    },

    executeTask: async (nodeId: string, type: string, config: TaskConfig, previousResult?: any) => {
      const response = await api.post('/workflows/execute-task/', {
        nodeId,
        type,
        config,
        previousResult
      });
      return response.data;
    }
  };