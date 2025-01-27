// src/components/TaskConfigModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Trash2 } from 'lucide-react';
import { CustomNode, TaskType, SummarizationConfig, ScrapingConfig, ClassificationConfig, EmailConfig } from '../types/workflowTypes.ts';
import { useWorkflowStore } from '../stores/workflowStore.ts';
import { useToast } from './Toast.tsx';

interface TaskConfigModalProps {
  isOpen: boolean;
  task?: CustomNode;
  onClose: () => void;
  onSave: (config: SummarizationConfig | ScrapingConfig | ClassificationConfig | EmailConfig) => void;
  onDelete: (nodeId: string) => void;
}

const defaultConfigs: Record<TaskType, SummarizationConfig | ScrapingConfig | ClassificationConfig | EmailConfig> = {
  summarization: { type: 'summarization', input_text: '', max_length: 130, min_length: 30 },
  scraping: { type: 'scraping', url: '', selectors: [] },
  classification: { type: 'classification', image_url: '', confidence_threshold: 0.5 },
  email: { type: 'email', recipient: '', subject: '', body: '' }
};

const TaskConfigModal: React.FC<TaskConfigModalProps> = ({ isOpen, task, onClose, onSave, onDelete  }) => {
  const [editableConfig, setEditableConfig] = useState<
    SummarizationConfig | ScrapingConfig | ClassificationConfig | EmailConfig | null
  >(null);

  const executeTask = useWorkflowStore((state) => state.executeTask);
  const { addToast } = useToast();

  useEffect(() => {
    if (task) {
      const defaultConfig = defaultConfigs[task.type];
      const currentConfig = task.config;
      setEditableConfig({ ...defaultConfig, ...currentConfig });
    } else {
      setEditableConfig(null);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editableConfig || !task) return;
  
    try {
      // First save the new configuration
      onSave(editableConfig);
      onClose();
      
      // Then execute with the new config
      await executeTask(task.id, task.type, editableConfig);
      addToast('Task configured successfully', 'success');
    } catch (error) {
      addToast('Failed to execute task', 'error');
    }
  };
  

  const updateConfig = <K extends keyof typeof editableConfig>(
    key: K,
    value: (typeof editableConfig)[K]
  ) => {
    if (editableConfig) {
      setEditableConfig({ ...editableConfig, [key]: value });
    }
  };

  const handleDelete = () => {
    if (task){
    onDelete(task.id);
    onClose();
    }
  };
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl">
          <Dialog.Title className="text-lg font-medium mb-4 dark:text-slate-100">
            Configure {task?.type}
          </Dialog.Title>


          <form onSubmit={handleSubmit} className="space-y-4">
            {task?.type === 'summarization' && editableConfig && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300 ">Input Text</label>
                  <textarea
                    value={(editableConfig as SummarizationConfig).input_text}
                    onChange={(e) => updateConfig('input_text', e.target.value)}
                    className="w-full border rounded p-2 dark:bg-slate-700"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">Max Length</label>
                  <input
                    type="number"
                    value={(editableConfig as SummarizationConfig).max_length}
                    onChange={(e) => updateConfig('max_length', Number(e.target.value))}
                    className="w-full border rounded p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">Min Length</label>
                  <input
                    type="number"
                    value={(editableConfig as SummarizationConfig).min_length}
                    onChange={(e) => updateConfig('min_length', Number(e.target.value))}
                    className="w-full border rounded p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </>
            )}

            {task?.type === 'scraping' && editableConfig && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">URL</label>
                  <input
                    type="url"
                    value={(editableConfig as ScrapingConfig).url}
                    onChange={(e) => updateConfig('url', e.target.value)}
                    className="w-full border rounded p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">CSS Selectors</label>
                  <input
                    type="text"
                    value={(editableConfig as ScrapingConfig).selectors.join(', ')}
                    onChange={(e) => updateConfig('selectors', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full border rounded p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder=".article-content, h1 dark:border-slate-600 dark:placeholder:text-slate-500"
                  />
                </div>
              </>
            )}

            {task?.type === 'classification' && editableConfig && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">Image URL</label>
                  <input
                    type="url"
                    value={(editableConfig as ClassificationConfig).image_url}
                    onChange={(e) => updateConfig('image_url', e.target.value)}
                    className="w-full border rounded p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">Confidence Threshold</label>
                  <input
                    type="number"
                    value={(editableConfig as ClassificationConfig).confidence_threshold}
                    onChange={(e) => updateConfig('confidence_threshold', Number(e.target.value))}
                    step="0.1"
                    min="0"
                    max="1"
                    className="w-full border rounded p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </>
            )}

            {task?.type === 'email' && editableConfig && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">Recipient</label>
                  <input
                    type="email"
                    value={(editableConfig as EmailConfig).recipient}
                    onChange={(e) => updateConfig('recipient', e.target.value)}
                    className="w-full border rounded p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">Subject</label>
                  <input
                    type="text"
                    value={(editableConfig as EmailConfig).subject}
                    onChange={(e) => updateConfig('subject', e.target.value)}
                    className="w-full border rounded p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">Body</label>
                  <textarea
                    value={(editableConfig as EmailConfig).body}
                    onChange={(e) => updateConfig('body', e.target.value)}
                    className="w-full border rounded p-2 dark:bg-slate-700 dark:border-slate-600"
                    rows={4}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 
                rounded text-slate-700 dark:text-slate-300
                hover:bg-slate-50 dark:hover:bg-slate-700
                transition-colors duration-200"              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-dark 
                text-white rounded transition-colors duration-200"              >
                Save
              </button>

              <button
              onClick={handleDelete}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
              <Trash2 className="w-4 h-4" />
              </button>

            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TaskConfigModal;
