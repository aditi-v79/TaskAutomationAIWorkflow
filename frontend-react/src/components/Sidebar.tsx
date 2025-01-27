// src/components/Sidebar.tsx
import React from 'react';
import { Database, Activity, Mail, Image, Plus, Boxes } from 'lucide-react';
import { TaskType } from '../types/workflowTypes';

interface SidebarProps {
  onAddTask: (type: TaskType) => void;
}

interface Task {
  type: TaskType;
  name: string;
  description: string;
  icon: React.ComponentType;
}

const tasks: Task[] = [
  {
    type: 'scraping',
    name: 'Data Scraping',
    description: 'Extract data from websites',
    icon: Database
  },
  {
    type: 'summarization',
    name: 'Text Summarization',
    description: 'Condense text content',
    icon: Activity
  },
  {
    type: 'email',
    name: 'Email Task',
    description: 'Send automated emails',
    icon: Mail
  },
  {
    type: 'classification',
    name: 'Image Classification',
    description: 'Analyze and categorize images',
    icon: Image
  },
];

const Sidebar: React.FC<SidebarProps> = ({ onAddTask }) => {

  const handleDragStart = (task: Task, event: React.DragEvent<HTMLButtonElement>) => {
    console.log("This is the type of task taht is dragged", task.type);
    event.dataTransfer.setData('application/reactflow', task.type);
  };

  return (
    <div className="w-72 bg-white border-r border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
        <Boxes className="w-5 h-5 mr-2 text-primary" />
        Available Tasks
      </h2>

      <div className="space-y-3">
        {tasks.map((task) => {
          const IconComponent = task.icon;
          return (
            <button
              key={task.type}
              draggable
              onDragStart={(e) => handleDragStart(task, e)}
              onClick={() => onAddTask(task.type)}
              className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-slate-50
                border border-transparent hover:border-slate-200 transition-all duration-200 
                text-left group"
            >
              <div className="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-colors">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{task.name}</p>
                <p className="text-sm text-slate-500">{task.description}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-5 h-5 text-primary" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
