import React, { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Settings } from 'lucide-react';
import TaskConfigModal from './TaskConfigModal.tsx';
import { NodeData, TaskConfig } from '../types/workflowTypes';

interface CustomNodeProps {
  data: NodeData;
  id: string;
}

const CustomNodeComponent: React.FC<CustomNodeProps> = ({ data, id }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nodeName, setNodeName] = useState(`New ${data.config.type} Task`);

  const handleDoubleClick = (e: React.MouseEvent) => {
    console.log("entered handle double click");
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleNameChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  const handleConfigSave = (newConfig: TaskConfig) => {
    setIsConfigOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 min-w-[160px] border-2 border-primary">
      
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 text-sm">
          {isEditing ? (
            <input
              type="text"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              onKeyDown={handleNameChange}
              onBlur={() => setIsEditing(false)}
              className="w-full px-1 border rounded"
              autoFocus
            />
          ) : (
            <span onDoubleClick={handleDoubleClick}>{nodeName}</span>
          )}
        </div>

        <button 
          className="p-0.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsConfigOpen(true);
          }}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />

      <TaskConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleConfigSave}
        task={{
          type: data.config.type,
          config: data.config
        }}
      />
    </div>
  );
};


export default React.memo(CustomNodeComponent);