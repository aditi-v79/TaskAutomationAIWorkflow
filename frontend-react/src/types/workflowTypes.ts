// types/workflow.ts

import { Node, Edge, EdgeProps } from 'reactflow';

export type TaskType = 'summarization' | 'scraping' | 'classification' | 'email';

// Base configuration interface
interface BaseConfig {
  type: TaskType;
}

// Task-specific configurations
export interface SummarizationConfig extends BaseConfig {
  type: 'summarization';
  input_text: string;
  max_length?: number;
  min_length?: number;
}

export interface ScrapingConfig extends BaseConfig {
  type: 'scraping';
  url: string;
  selectors: string[];
}

export interface ClassificationConfig extends BaseConfig {
  type: 'classification';
  image_url: string;
  confidence_threshold?: number;
}

export interface EmailConfig extends BaseConfig {
  type: 'email';
  recipient: string;
  subject: string;
  body: string;
}

export type TaskConfig = 
  | SummarizationConfig 
  | ScrapingConfig 
  | ClassificationConfig 
  | EmailConfig;

// Custom Node and Edge types
export type CustomNode = Node<NodeData>;

// Update CustomEdge type
export interface CustomEdgeData {
  workflowId: string;
  label?: string;
  status?: 'success' | 'error' | 'processing' |'idle';
}

export type CustomEdge = Edge<CustomEdgeData>;


export type CustomEdgeProps = EdgeProps<CustomEdgeData>;


// Workflow Interface
export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: CustomNode[];
  edges: CustomEdge[];
  status: 'idle' | 'running' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

// Workflow Execution Interface
export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'running' | 'completed' | 'failed';
  logs: ExecutionLog[];
  started_at: string;
  completed_at?: string;
}

export interface ExecutionLog {
  task_id: string;
  message: string;
  timestamp: string;
  level: 'info' | 'error' | 'warning';
}

// Node Data Interface
export interface NodeData {
  label: string;
  config: TaskConfig;
}
