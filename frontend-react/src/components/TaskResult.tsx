import React from 'react';
import { Loader2 } from 'lucide-react';
import { useWorkflowStore } from "../stores/workflowStore.ts";

const TaskResult: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const result = useWorkflowStore((state) => state.taskResults[nodeId]);
    const executionProgress = useWorkflowStore((state) => state.executionProgress[nodeId]);

  
    if (!result && !executionProgress) return null;
  
    return (
      <div className="mt-2 p-2 rounded text-sm border-t dark:border-slate-600">
        {/* Execution Progress */}
        {executionProgress === 'processing' && (
          <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </div>
        )}
  
        {/* Result Display */}
        {result && (
          <>
            <div className="flex items-center gap-2">
              <span className={`${
                result.status === 'success' ? 'text-green-500 dark:text-green-400' :
                result.status === 'error' ? 'text-red-500 dark:text-red-400' :
                'text-gray-500 dark:text-gray-400'
              }`}>
                {result.status}
              </span>
            </div>
            
            {result.status === 'success' && result.result && (
              <div className="mt-2 text-xs overflow-auto max-h-20 text-slate-700 dark:text-slate-300">
                {typeof result.result === 'string' 
                  ? result.result 
                  : JSON.stringify(result.result, null, 2)
                }
              </div>
            )}
            
            {result.status === 'error' && result.error && (
              <div className="mt-2 text-xs text-red-500 dark:text-red-400">
                {result.error}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  export default TaskResult;
  