import axios from 'axios';
import type { Workflow, WorkflowExecution } from '../types/workflow';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

export const api = {
  workflows: {
    list: async () => {
      const { data } = await instance.get<Workflow[]>('/workflows/');
      return data;
    },

    get: async (id: string) => {
      const { data } = await instance.get<Workflow>(`/workflows/${id}/`);
      return data;
    },

    create: async (workflow: Omit<Workflow, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
      const { data } = await instance.post<Workflow>('/workflows/', workflow);
      return data;
    },

    update: async (id: string, workflow: Partial<Workflow>) => {
      const { data } = await instance.put<Workflow>(`/workflows/${id}/`, workflow);
      return data;
    },

    delete: async (id: string) => {
      await instance.delete(`/workflows/${id}/`);
    },

    execute: async (id: string) => {
      const { data } = await instance.post<WorkflowExecution>(`/workflows/${id}/execute/`);
      return data;
    }
  }
};