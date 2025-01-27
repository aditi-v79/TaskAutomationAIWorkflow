import React from 'react';
import { Plus, Boxes, Edit, Play } from 'lucide-react';
import { Workflow } from '../types/workflowTypes';

interface WorkflowListProps {
  workflows: Workflow[];
  onCreateWorkflow: () => void;
  onEditWorkflow: (id: string) => void;
  onRunWorkflow: (id: string) => void;
}

const WorkflowList: React.FC<WorkflowListProps> = ({
  workflows,
  onCreateWorkflow,
  onEditWorkflow,
  onRunWorkflow
}) => {
  const getStatusClass = (status: Workflow['status']) => {
    const classes = {
      idle: 'bg-slate-100 text-slate-700',
      running: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
    };
    return classes[status];
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className={`mb-8 ${
        workflows.length > 0 ? 'flex justify-between items-center' : 'text-center'
      }`}>
        <h1 className={`text-2xl font-bold text-slate-900 ${
          workflows.length === 0 ? 'mx-auto mb-12' : ''
        }`}>
          My Workflows
        </h1>
        {workflows.length > 0 && (
          <button onClick={onCreateWorkflow} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </button>
        )}
      </div>

      {workflows.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Boxes className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No workflows yet</h3>
          <p className="text-slate-500 mb-6">Create your first workflow to get started</p>
          <button onClick={onCreateWorkflow} className="btn-primary">
            Create Workflow
            <Plus className="w-4 h-4 mr-2" />
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {workflows.map(workflow => (
            <div
              key={workflow.id}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">{workflow.name}</h3>
                  <p className="text-slate-500">{workflow.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(workflow.status)}`}>
                  {workflow.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Last updated: {new Date(workflow.updated_at).toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onEditWorkflow(workflow.id)}
                    className="btn-secondary"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  {workflow.status === 'idle' && (
                    <button 
                      onClick={() => onRunWorkflow(workflow.id)}
                      className="btn-primary"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowList;