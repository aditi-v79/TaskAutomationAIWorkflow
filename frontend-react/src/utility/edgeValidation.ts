// src/utils/edgeValidation.ts
import { Node, Edge } from 'reactflow';
import { TaskType, CustomNode } from '../types/workflowTypes';

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

const validConnections: Record<TaskType, TaskType[]> = {
  scraping: ['summarization', 'email'],
  classification: ['email'],
  summarization: ['email'],
  email: [],
};

export const validateConnection = (
    sourceNode: CustomNode, 
    targetNode: CustomNode,
    edges: Edge[]
  ): ValidationResult => {
    console.log('Validating connection between:', {
        source: sourceNode?.data?.config?.type,
        target: targetNode?.data?.config?.type
    });


    // Basic validation
     if (!sourceNode?.data?.config?.type || !targetNode?.data?.config?.type) {
        return { 
            isValid: false, 
            message: `Invalid node configuration: ${sourceNode?.data?.config?.type} -> ${targetNode?.data?.config?.type}` 
        };
    }

    const sourceType = sourceNode.data.config.type;
    const targetType = targetNode.data.config.type;
  
    // Check incoming connection
    const hasIncomingConnection = edges.some(edge => edge.target === targetNode.id);
    if (hasIncomingConnection) {
      return { isValid: false, message: 'Node can only have one incoming connection' };
    }
  
    // Check cycles
    if (wouldCreateCycle(sourceNode.id, targetNode.id, edges)) {
      return { isValid: false, message: 'Cycles not allowed' };
    }
  
    // Validate connection types
    const allowedTargets = validConnections[sourceType] || [];
    if (!allowedTargets.includes(targetType)) {
      return { isValid: false, message: `Cannot connect ${sourceType} to ${targetType}` };
    }
  
    return { isValid: true };
  };

// Helper function to detect cycles
const wouldCreateCycle = (sourceId: string, targetId: string, edges: Edge[]): boolean => {
  const visited = new Set<string>();
  const stack = [targetId];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === sourceId) return true;
    if (visited.has(current)) continue;
    visited.add(current);

    const outgoingEdges = edges.filter(edge => edge.source === current);
    stack.push(...outgoingEdges.map(edge => edge.target));
  }

  return false;
};
