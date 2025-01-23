import type { TaskNode } from '../types/workflow';

type TaskType = TaskNode['type'];

const CONNECTION_RULES: Record<TaskType, TaskType[]> = {
  'scraping': ['summarization', 'email'],
  'summarization': ['email'],
  'email': [],
  'classification': ['email', 'summarization']
};

export const connectionValidation = {
  isValidConnection(sourceType: TaskType, targetType: TaskType): boolean {
    return CONNECTION_RULES[sourceType]?.includes(targetType) ?? false;
  },

  getValidTargets(sourceType: TaskType): TaskType[] {
    return CONNECTION_RULES[sourceType] || [];
  },

  getValidationMessage(sourceType: TaskType, targetType: TaskType): string {
    if (this.isValidConnection(sourceType, targetType)) {
      return '';
    }
    return `Cannot connect ${sourceType} to ${targetType}`;
  }
};