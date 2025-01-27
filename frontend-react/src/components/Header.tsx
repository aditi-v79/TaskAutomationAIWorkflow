import React, { useState } from 'react';
import { Play, Save, Settings, Edit2, ArrowLeft, Loader2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggleButton.tsx';
import { useWorkflowStore } from '../stores/workflowStore.ts';
import { useToast } from './Toast.tsx';

interface HeaderProps {
  showBackButton: boolean;
  onSave: () => void;
  onRun: () => void;
  isRunning: boolean;
  onBackToList: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showBackButton,
  onSave,
  onRun,
  isRunning,
  onBackToList
}) => {
  const isExecuting = useWorkflowStore((state) => state.isExecuting);
  const executeWorkflow = useWorkflowStore((state) => state.executeWorkflow);
  const currentWorkflow = useWorkflowStore((state) => state.currentWorkflow);
  const { addToast } = useToast();
  const [workflowName, setWorkflowName] = useState(currentWorkflow?.name || '');


  const handleExecute = async () => {
    if (!currentWorkflow) return;
    
    try {
      await executeWorkflow(currentWorkflow.id);
      addToast('Workflow executed successfully', 'success');
    } catch (error) {
      addToast('Workflow execution failed', 'error');
    }
  };

  
  
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button
              onClick={onBackToList}
              className="mr-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          )}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Workflow Builder
          </h1>
          {showBackButton && (
            <div className="flex items-center space-x-4">
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                <Edit2 className="w-4 h-4 mr-2" />
                Untitled Workflow
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {showBackButton && (
            <>
              <button onClick={onSave} className="btn-secondary">
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>

              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Execute Workflow
                  </>
                )}
              </button>

            </>
          )}

          <ThemeToggle />

          <button className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 
            dark:hover:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 
            transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
