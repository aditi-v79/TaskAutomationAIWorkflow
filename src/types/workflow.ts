export interface Task {
  id: string;
  type: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  connections: Array<{
    source: string;
    target: string;
  }>;
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