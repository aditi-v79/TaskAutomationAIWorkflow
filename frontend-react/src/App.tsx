import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import { useWorkflowStore } from './stores/workflowStore.ts';
import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
import WorkflowList from './components/WorkflowList.tsx';
import WorkflowCanvas from './components/WorkflowCanvas.tsx';
import { TaskType } from './types/workflowTypes';
import { ToastProvider } from './components/Toast.tsx';



const App: React.FC = () => {
  const navigate = useNavigate();
  const {
    workflows,
    currentWorkflow,
    fetchWorkflows,
    createWorkflow,
    loadWorkflow,
    executeWorkflow,
    addNode,
    updateNodePosition,
    updateWorkflow
  } = useWorkflowStore();

  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  const [isRunning, setIsRunning] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'editor'>('list');

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleCreateWorkflow = async () => {
    await createWorkflow('New Workflow', 'Created workflow');
    setCurrentView('editor');
  };

  const handleEditWorkflow = async (id: string) => {
    await loadWorkflow(id);
    setCurrentView('editor');
  };

  const handleRunWorkflow = async (id: string) => {
    setIsRunning(true);
    try {
      await executeWorkflow(id);
    } finally {
      setIsRunning(false);
    }
  };

  const handleAddTaskFromDrop = async (type: TaskType) => {
    if (currentWorkflow) {
      await addNode(type, `New ${type} task`);
    }
  };

  const handleUpdateTaskPosition = async (
    taskId: string,
    position: { x: number; y: number }
  ) => {
    if (currentWorkflow) {
      await updateNodePosition(taskId, position);
    }
  };

  const handleAddTask = async (type: TaskType) => {
    if (currentWorkflow) {
      await addNode(type, `New ${type} task`);
    }
  };

  const handleSave = async () => {
    if (currentWorkflow) {
      await updateWorkflow();
    }
  };

  const handleRun = async () => {
    if (workflows?.[0]) {
      setIsRunning(true);
      try {
        await executeWorkflow(workflows[0].id);
      } finally {
        setIsRunning(false);
      }
    }
  };

  return (
    <ReactFlowProvider>
    <ToastProvider>
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header
        showBackButton={currentView === 'editor'}
        onSave={handleSave}
        onRun={handleRun}
        isRunning={isRunning}
        onBackToList={() => setCurrentView('list')}
      />

      {currentView === 'list' ? (
        <WorkflowList
          workflows={workflows}
          onCreateWorkflow={handleCreateWorkflow}
          onEditWorkflow={handleEditWorkflow}
          onRunWorkflow={handleRunWorkflow}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <Sidebar onAddTask={handleAddTask} />
          <main className="flex-1 p-6 overflow-auto">
            <WorkflowCanvas
              tasks={currentWorkflow?.nodes || []}
              connections={currentWorkflow?.edges || []}
              onTaskClick={setSelectedTaskId}
              selectedTaskId={selectedTaskId}
              onUpdateTaskPosition={handleUpdateTaskPosition}
              onAddTask={handleAddTaskFromDrop}
            />
          </main>
        </div>
      )}
    </div>
    </ToastProvider>
    </ReactFlowProvider>
  );
};

export default App;