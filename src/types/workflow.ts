export interface TaskNodeType {
  id: string;
  workflowId: string;  // Add this to associate with workflow
  type: 'scraping' | 'summarization' | 'email' | 'classification';
  name: string;
  position: {
    x: number;
    y: number;
  };
  inputs: string[];   // IDs of connected input nodes
  outputs: string[];  // IDs of connected output nodes
  config: Record<string, any>;
}

export interface Connection {
  id: string;
  workflowId: string;
  sourceId: string;    // Source task ID
  targetId: string;    // Target task ID
  sourceHandle?: string; // Optional: for multiple connection points
  targetHandle?: string;
  status?: string; 

}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  tasks: TaskNodeType[];
  connections: Connection[];
  status: 'idle' | 'running' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'running' | 'completed' | 'failed';
  logs: Array<{
    task_id: string;
    message: string;
    timestamp: string;
    level: 'info' | 'error' | 'warning';
  }>;
  started_at: string;
  completed_at?: string;
}

export type TaskType = 'scraping' | 'summarization' | 'email' | 'classification';
