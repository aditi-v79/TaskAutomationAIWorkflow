// src/stores/workflowStore.ts
import {create} from 'zustand';
import { 
  Workflow, 
  CustomNode,
  CustomEdge,
  TaskType,
  NodeData,
  SummarizationConfig, 
  ScrapingConfig, 
  ClassificationConfig, 
  EmailConfig,
  TaskConfig
} from '../types/workflowTypes';
import api, { workflowApi } from '../api/index.ts';
import { handleApiError } from '../api/error.ts';

interface WorkflowState {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  fetchWorkflows: () => Promise<void>;
  createWorkflow: (name: string, description: string) => Promise<Workflow>;
  loadWorkflow: (id: string) => Promise<void>;
  addNode: (type: TaskType, name: string) => Promise<void>;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => Promise<void>;
  updateWorkflow: () => Promise<void>;
  executeWorkflow: (id: string) => Promise<any>;
  createEdge: (connection: { sourceId: string; targetId: string }) => Promise<void>;
}

const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  currentWorkflow: null,

  fetchWorkflows: async () => {
    try {
      const response = await workflowApi.list();
      set({ workflows: response });
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('Failed to fetch workflows:', apiError);
      set({ workflows: [] });
    }
  },

  createWorkflow: async (name: string, description: string) => {
    try {
      const workflow = await api.workflows.create({
        name,
        description,
        nodes: [],
        edges: []
      });
      set(state => ({
        workflows: [workflow, ...state.workflows],
        currentWorkflow: workflow
      }));
      return workflow;
    } catch (error) {
      console.error('Failed to create workflow:', error);
      const workflow: Workflow = {
        id: crypto.randomUUID(),
        name,
        description,
        nodes: [],
        edges: [],
        status: 'idle',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      set(state => ({
        workflows: [workflow, ...state.workflows],
        currentWorkflow: workflow
      }));
      return workflow;
    }
  },

  loadWorkflow: async (id: string) => {
    try {
      const workflow = await api.workflows.get(id);
      set({ currentWorkflow: workflow });
    } catch (error) {
      console.error('Failed to load workflow:', error);
      const workflow = get().workflows.find(w => w.id === id) || null;
      set({ currentWorkflow: workflow });
    }
  },

  addNode: async (type: TaskType, name: string) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const spacingX = 300;
    const spacingY = 150;
    const existingNodes = currentWorkflow.nodes;

    let position = { x: 150, y: 150 };

    if (existingNodes.length > 0) {
      const lastNode = existingNodes[existingNodes.length - 1];
      position.x = lastNode.position.x + spacingX;

      if (position.x > 800) {
        position.x = 100;
        position.y = lastNode.position.y + spacingY;
      } else {
        position.y = lastNode.position.y;
      }
    }

    const config: TaskConfig = (() => {
      switch (type) {
        case 'summarization':
          return {
            type: 'summarization',
            input_text: '',
            max_length: 100,
            min_length: 30,
          };
        case 'scraping':
          return {
            type: 'scraping',
            url: '',
            selectors: [],
          };
        case 'classification':
          return {
            type: 'classification',
            image_url: '',
            confidence_threshold: 0.5,
          };
        case 'email':
          return {
            type: 'email',
            recipient: '',
            subject: '',
            body: '',
          };
        default:
          throw new Error(`Unsupported task type: ${type}`);
      }
    })();

    const newNode: CustomNode = {
      id: crypto.randomUUID(),
      type: 'customNode',
      position,
      data: {
        label: name,
        config
      }
    };

    set(state => ({
      currentWorkflow: {
        ...currentWorkflow,
        nodes: [...currentWorkflow.nodes, newNode]
      }
    }));

    await get().updateWorkflow();
  },

  createEdge: async (connection: { sourceId: string; targetId: string }) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const newEdge: CustomEdge = {
      id: `edge-${connection.sourceId}-${connection.targetId}`,
      source: connection.sourceId,
      target: connection.targetId,
      data: {
        workflowId: currentWorkflow.id,
        status: 'idle'
      }
    };

    set(state => ({
      currentWorkflow: {
        ...currentWorkflow,
        edges: [...currentWorkflow.edges, newEdge]
      }
    }));

    await get().updateWorkflow();
  },

  updateNodePosition: async (nodeId: string, position: { x: number; y: number }) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    set(state => ({
      currentWorkflow: {
        ...currentWorkflow,
        nodes: currentWorkflow.nodes.map(node =>
          node.id === nodeId ? { ...node, position } : node
        )
      }
    }));

    await get().updateWorkflow();
  },

  updateWorkflow: async () => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    try {
      const updated = await api.workflows.update(currentWorkflow.id, currentWorkflow);
      set(state => ({
        currentWorkflow: updated,
        workflows: state.workflows.map(w =>
          w.id === updated.id ? updated : w
        )
      }));
    } catch (error) {
      console.error('Failed to update workflow:', error);
      set(state => ({
        workflows: state.workflows.map(w =>
          w.id === currentWorkflow.id
            ? { ...currentWorkflow, updated_at: new Date().toISOString() }
            : w
        )
      }));
    }
  },

  executeWorkflow: async (id: string) => {
    try {
      const execution = await api.workflows.execute(id);
      set(state => ({
        workflows: state.workflows.map(w =>
          w.id === id ? { ...w, status: 'running' } : w
        )
      }));
      return execution;
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      throw error;
    }
  },
}));

export {useWorkflowStore};
