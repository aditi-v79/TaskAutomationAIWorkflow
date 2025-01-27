import axios from 'axios';
import { Workflow, WorkflowExecution } from '../types/workflowTypes';

const BASE_URL = 'http://localhost:8000/api'; 

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
};

export default {
  workflows: workflowApi,
};
