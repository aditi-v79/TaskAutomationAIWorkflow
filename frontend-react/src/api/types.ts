import { Workflow, WorkflowExecution, TaskConfig } from '../types/workflowTypes';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface WorkflowResponse extends ApiResponse<Workflow> {}
export interface WorkflowListResponse extends ApiResponse<Workflow[]> {}
export interface ExecutionResponse extends ApiResponse<WorkflowExecution> {}
export interface TaskExecutionResponse extends ApiResponse<{
  result: any;
  nodeId: string;
}> {}

export interface TaskExecutionRequest {
  nodeId: string;
  type: string;
  config: TaskConfig;
}
