import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Connection,
  Edge,
  EdgeTypes,
  NodeChange,
  applyNodeChanges,
  FitViewOptions,
  OnConnect,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode.tsx';
import CustomEdge from './CustomEdge.tsx';
import InteractiveEdge from './InteractiveEdge.tsx';
import { TaskType, CustomNode as CustomNodeType, CustomEdge as CustomeEdgeTypes } from '../types/workflowTypes';
import { validateConnection } from '../utility/edgeValidation.ts'; 
import { useToast } from './Toast.tsx';


const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
  interactive: InteractiveEdge,
};

const WorkflowCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<CustomNodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { addToast } = useToast();



  const fitViewOptions: FitViewOptions = {
    padding: 0.99,
  };

  const nodeTypes = {
    customNode: CustomNode
  };


  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  const onConnect: OnConnect = useCallback((connection: Connection) => {
    console.log('Connection:', connection);  // Debug the connection object

    
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);

    if (!sourceNode || !targetNode) {
      addToast('Cannot find connected nodes', 'error');
      return;
  }


    console.log('Found nodes:', { sourceNode, targetNode });  // Debug found nodes

    // console.log('Source Node:', sourceNode);
    // console.log('Target Node:', targetNode);
    // console.log('Source Type:', sourceNode?.data?.config?.type);
    // console.log('Target Type:', targetNode?.data?.config?.type);

      const validation = validateConnection(sourceNode, targetNode, edges);

      if (!validation.isValid) {
        addToast(validation.message || 'Invalid connection', 'warning');
        return;
      }

    setEdges((prevEdges) => [
      ...prevEdges,
      {
        id: `edge-${connection.source}-${connection.target}`,
        source: connection.source!,
        target: connection.target!,
      },
    ]);
  }, [edges, nodes, addToast]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') as TaskType;
      
      if (!type) return;

      const position = {
        x: event.clientX - event.currentTarget.getBoundingClientRect().left,
        y: event.clientY - event.currentTarget.getBoundingClientRect().top,
      };

      const newNode: CustomNodeType = {
        id: `${type}-${nodes.length + 1}`,
        type: 'customNode',
        position,
        data: { 
          label: type,
          config: type === 'email' ? {
            type: 'email',
            recipient: '',
            subject: '',
            body: ''
          } : type === 'summarization' ? {
            type: 'summarization',
            input_text: '',
            max_length: 100,
            min_length: 30
          } : type === 'scraping' ? {
            type: 'scraping',
            url: '',
            selectors: []
          } : {
            type: 'classification',
            image_url: '',
            confidence_threshold: 0.5
          }
        },
      };

      setNodes((prevNodes) => [...prevNodes, newNode]);
    },
    [nodes]
);




  return (
    <ReactFlowProvider>
        <div className="h-screen flex flex-col" onDragOver={onDragOver} onDrop={onDrop} style={{ width: '100%', height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            fitViewOptions={fitViewOptions}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView={false}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        </ReactFlowProvider>
    
  );
};

export default WorkflowCanvas;
