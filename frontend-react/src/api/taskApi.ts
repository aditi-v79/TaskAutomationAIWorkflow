import { api } from './index.ts';
import { TaskExecutionRequest, TaskExecutionResponse } from './types.ts';
import { TaskConfig } from '../types/workflowTypes.ts';
import { handleApiError } from './error.ts';

export const taskApi = {
  execute: async (nodeId: string, type: string, config: TaskConfig): Promise<TaskExecutionResponse> => {
    try {
      const response = await api.post('/tasks/execute/', {
        nodeId,
        type,
        config
      } as TaskExecutionRequest);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getResult: async (nodeId: string): Promise<TaskExecutionResponse> => {
    try {
      const response = await api.get(`/tasks/${nodeId}/result/`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};
