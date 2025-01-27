// src/components/TaskConfigModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Trash2 } from 'lucide-react';
import { CustomNode, TaskType, SummarizationConfig, ScrapingConfig, ClassificationConfig, EmailConfig } from '../types/workflowTypes';

interface TaskConfigModalProps {
  isOpen: boolean;
  task?: CustomNode;
  onClose: () => void;
  onSave: (config: SummarizationConfig | ScrapingConfig | ClassificationConfig | EmailConfig) => void;
}

const defaultConfigs: Record<TaskType, SummarizationConfig | ScrapingConfig | ClassificationConfig | EmailConfig> = {
  summarization: { type: 'summarization', input_text: '', max_length: 130, min_length: 30 },
  scraping: { type: 'scraping', url: '', selectors: [] },
  classification: { type: 'classification', image_url: '', confidence_threshold: 0.5 },
  email: { type: 'email', recipient: '', subject: '', body: '' }
};

const TaskConfigModal: React.FC<TaskConfigModalProps> = ({ isOpen, task, onClose, onSave }) => {
  const [editableConfig, setEditableConfig] = useState<
    SummarizationConfig | ScrapingConfig | ClassificationConfig | EmailConfig | null
  >(null);

  useEffect(() => {
    if (task) {
      const defaultConfig = defaultConfigs[task.type];
      const currentConfig = task.config;
      setEditableConfig({ ...defaultConfig, ...currentConfig });
    } else {
      setEditableConfig(null);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editableConfig || !task) return;
    onSave(editableConfig);
    onClose();
  };


  const updateConfig = <K extends keyof typeof editableConfig>(
    key: K,
    value: (typeof editableConfig)[K]
  ) => {
    if (editableConfig) {
      setEditableConfig({ ...editableConfig, [key]: value });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm bg-white p-6 rounded-lg shadow-xl">
          <Dialog.Title className="text-lg font-medium mb-4">
            Configure {task?.type}
          </Dialog.Title>


          <form onSubmit={handleSubmit} className="space-y-4">
            {task?.type === 'summarization' && editableConfig && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Input Text</label>
                  <textarea
                    value={(editableConfig as SummarizationConfig).input_text}
                    onChange={(e) => updateConfig('input_text', e.target.value)}
                    className="w-full border rounded p-2"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Length</label>
                  <input
                    type="number"
                    value={(editableConfig as SummarizationConfig).max_length}
                    onChange={(e) => updateConfig('max_length', Number(e.target.value))}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Length</label>
                  <input
                    type="number"
                    value={(editableConfig as SummarizationConfig).min_length}
                    onChange={(e) => updateConfig('min_length', Number(e.target.value))}
                    className="w-full border rounded p-2"
                  />
                </div>
              </>
            )}

            {task?.type === 'scraping' && editableConfig && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <input
                    type="url"
                    value={(editableConfig as ScrapingConfig).url}
                    onChange={(e) => updateConfig('url', e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CSS Selectors</label>
                  <input
                    type="text"
                    value={(editableConfig as ScrapingConfig).selectors.join(', ')}
                    onChange={(e) => updateConfig('selectors', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full border rounded p-2"
                    placeholder=".article-content, h1"
                  />
                </div>
              </>
            )}

            {task?.type === 'classification' && editableConfig && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={(editableConfig as ClassificationConfig).image_url}
                    onChange={(e) => updateConfig('image_url', e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confidence Threshold</label>
                  <input
                    type="number"
                    value={(editableConfig as ClassificationConfig).confidence_threshold}
                    onChange={(e) => updateConfig('confidence_threshold', Number(e.target.value))}
                    step="0.1"
                    min="0"
                    max="1"
                    className="w-full border rounded p-2"
                  />
                </div>
              </>
            )}

            {task?.type === 'email' && editableConfig && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Recipient</label>
                  <input
                    type="email"
                    value={(editableConfig as EmailConfig).recipient}
                    onChange={(e) => updateConfig('recipient', e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    value={(editableConfig as EmailConfig).subject}
                    onChange={(e) => updateConfig('subject', e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Body</label>
                  <textarea
                    value={(editableConfig as EmailConfig).body}
                    onChange={(e) => updateConfig('body', e.target.value)}
                    className="w-full border rounded p-2"
                    rows={4}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>

              {/* <button
                // onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              >
              <Trash2 className="w-4 h-4" />
              </button> */}

            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TaskConfigModal;
