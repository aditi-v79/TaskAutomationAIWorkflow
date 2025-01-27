import { CustomNode, CustomEdge, TaskConfig, TaskResult } from '../types/workflowTypes';

const VALID_CONNECTIONS = {
  scraping: {
    validTargets: ['summarization', 'email'],
    outputMapping: {
      summarization: 'input_text',
      email: 'body'
    }
  },
  classification: {
    validTargets: ['email'],
    outputMapping: {
      email: 'body'
    }
  },
  summarization: {
    validTargets: ['email'],
    outputMapping: {
      email: 'body'
    }
  },
  email: {
    validTargets: [],
    outputMapping: {}
  }
};

export class WorkflowExecutor {
  private nodes: CustomNode[];
  private edges: CustomEdge[];
  private executed: Set<string> = new Set();
  private results: Record<string, TaskResult> = {};

  constructor(nodes: CustomNode[], edges: CustomEdge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  private getNodeDependencies(nodeId: string): string[] {
    return this.edges
      .filter(edge => edge.target === nodeId)
      .map(edge => edge.source);
  }

  private canExecuteNode(nodeId: string): boolean {
    const dependencies = this.getNodeDependencies(nodeId);
    return dependencies.every(depId => this.executed.has(depId));
  }

  private getInputsForNode(nodeId: string): Record<string, any> {
    const dependencies = this.getNodeDependencies(nodeId);
    return dependencies.reduce((inputs, depId) => ({
      ...inputs,
      [depId]: this.results[depId]?.result
    }), {});
  }

  private updateConfigWithInputs(node: CustomNode, inputs: Record<string, any>): TaskConfig {
    const sourceNodes = this.getNodeDependencies(node.id)
      .map(id => this.nodes.find(n => n.id === id))
      .filter((n): n is CustomNode => n !== undefined);

    const config = { ...node.data.config };

    sourceNodes.forEach(sourceNode => {
      const sourceType = sourceNode.data.config.type;
      const targetType = node.data.config.type;
      const mapping = VALID_CONNECTIONS[sourceType]?.outputMapping[targetType];
      
      if (mapping && inputs[sourceNode.id]) {
        config[mapping] = inputs[sourceNode.id];
      }
    });

    return config;
  }

  public getExecutionOrder(): CustomNode[] {
    const order: CustomNode[] = [];
    const visited = new Set<string>();
    const temp = new Set<string>();

    const visit = (nodeId: string) => {
      if (temp.has(nodeId)) {
        throw new Error('Workflow has a cycle');
      }
      if (visited.has(nodeId)) return;

      temp.add(nodeId);

      const outgoingEdges = this.edges.filter(e => e.source === nodeId);
      for (const edge of outgoingEdges) {
        visit(edge.target);
      }

      temp.delete(nodeId);
      visited.add(nodeId);
      const node = this.nodes.find(n => n.id === nodeId);
      if (node) order.unshift(node);
    };

    const startNodes = this.nodes.filter(node => 
      !this.edges.some(edge => edge.target === node.id)
    );

    for (const node of startNodes) {
      visit(node.id);
    }

    return order;
  }

  public getNextExecutableNodes(): CustomNode[] {
    return this.nodes.filter(node => 
      !this.executed.has(node.id) && this.canExecuteNode(node.id)
    );
  }

  public markNodeAsExecuted(nodeId: string, result: TaskResult) {
    this.executed.add(nodeId);
    this.results[nodeId] = result;
  }

  public getNodeConfig(nodeId: string): TaskConfig {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) throw new Error('Node not found');
    
    const inputs = this.getInputsForNode(nodeId);
    return this.updateConfigWithInputs(node, inputs);
  }
}

export default WorkflowExecutor;
