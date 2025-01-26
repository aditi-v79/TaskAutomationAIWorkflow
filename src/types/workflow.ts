export interface TaskNodeType {
  id: string;
  workflowId: string;  // Add this to associate with workflow
  type: 'summarization' | 'scraping' | 'classification' | 'email'
  name: string;
  position: {
    x: number;
    y: number;
  };
  inputs: string[];   // IDs of connected input nodes
  outputs: string[];  // IDs of connected output nodes
  config: SummarizationConfig | ScrapingConfig | ClassificationConfig | EmailConfig;
}

export interface Connection {
  id: string;
  workflowId: string;
  sourceId: string;    // Source task ID
  targetId: string;    // Target task ID
}

export interface ActiveConnection {
  sourceId: string;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
}

export interface SummarizationConfig {
  input_text: string;
  max_length?: number;
  min_length?: number;
 }
 
 export interface ScrapingConfig {
  url: string; 
  selectors: string[];
 }
 
 export interface ClassificationConfig {
  image_url: string;
  confidence_threshold?: number;
 }
 
 export interface EmailConfig {
  recipient: string;
  subject: string;
  body: string;
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
