<template>
  <Dialog :open="isOpen" @close="onClose">
    <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel class="mx-auto max-w-sm bg-white p-6 rounded-lg shadow-xl">
        <DialogTitle class="text-lg font-medium mb-4">Configure {{ task?.type }}</DialogTitle>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Summarization -->
          <template v-if="task?.type === 'summarization'&& editableConfig">
            <div>
              <label class="block text-sm font-medium mb-1">Input Text</label>
              <textarea 
                v-model="(editableConfig as SummarizationConfig).input_text" 
                class="w-full border rounded p-2"
                rows="4"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Max Length</label>
              <input 
                type="number" 
                v-model.number="(editableConfig as SummarizationConfig).max_length"
                class="w-full border rounded p-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Min Length</label>
              <input 
                type="number" 
                v-model.number="(editableConfig as SummarizationConfig).min_length"
                class="w-full border rounded p-2"
              />
            </div>
          </template>

          <!-- Web Scraping -->
          <template v-if="task?.type === 'scraping'&& editableConfig">
            <div>
              <label class="block text-sm font-medium mb-1">URL</label>
              <input 
                type="url" 
                v-model="(editableConfig as ScrapingConfig).url"
                class="w-full border rounded p-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">CSS Selectors</label>
              <input 
                type="text" 
                v-model="(editableConfig as ScrapingConfig).selectors"
                class="w-full border rounded p-2"
                placeholder=".article-content, h1"
              />
            </div>
          </template>

          <!-- Image Classification -->
          <template v-if="task?.type === 'classification'&& editableConfig">
            <div>
              <label class="block text-sm font-medium mb-1">Image URL</label>
              <input 
                type="url" 
                v-model="(editableConfig as ClassificationConfig).image_url"
                class="w-full border rounded p-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Confidence Threshold</label>
              <input 
                type="number" 
                v-model.number="(editableConfig as ClassificationConfig).confidence_threshold"
                step="0.1"
                min="0"
                max="1"
                class="w-full border rounded p-2"
              />
            </div>
          </template>

          <!-- Email -->
          <template v-if="task?.type === 'email'&& editableConfig">
            <div>
              <label class="block text-sm font-medium mb-1">Recipient</label>
              <input 
                type="email" 
                v-model="(editableConfig as EmailConfig).recipient"
                class="w-full border rounded p-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Subject</label>
              <input 
                type="text" 
                v-model="(editableConfig as EmailConfig).subject"
                class="w-full border rounded p-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Body</label>
              <textarea 
                v-model="(editableConfig as EmailConfig).body"
                class="w-full border rounded p-2"
                rows="4"
              />
            </div>
          </template>

          <div class="flex justify-end space-x-2">
            <button type="button" @click="onClose" class="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        </form>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import type { TaskNodeType, TaskType, SummarizationConfig, ScrapingConfig, ClassificationConfig, EmailConfig } from '../types/workflow';

const props = defineProps<{
  isOpen: boolean;
  task?: TaskNodeType;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', config: SummarizationConfig | ScrapingConfig | ClassificationConfig | EmailConfig): void;
}>();

const editableConfig = ref<SummarizationConfig | ScrapingConfig | ClassificationConfig | EmailConfig | null>(null);


const defaultConfigs:Record<TaskType, SummarizationConfig | ScrapingConfig | ClassificationConfig | EmailConfig>  = {
  summarization: { input_text: '', max_length: 130, min_length: 30 },
  scraping: { url: '', selectors: [] },
  classification: { image_url: '', confidence_threshold: 0.5 },
  email: { recipient: '', subject: '', body: '' }
};

// Type guard function
function isSummarizationConfig(config: any): config is SummarizationConfig {
  return (config as SummarizationConfig).input_text !== undefined;
}

const isScrapingConfig = (config: any): config is ScrapingConfig =>
  typeof (config as ScrapingConfig).url === 'string' && Array.isArray((config as ScrapingConfig).selectors);

const isClassificationConfig = (config: any): config is ClassificationConfig =>
  typeof (config as ClassificationConfig).image_url === 'string';

const isEmailConfig = (config: any): config is EmailConfig =>
  typeof (config as EmailConfig).recipient === 'string' && typeof (config as EmailConfig).subject === 'string';

// Get typed config based on task type
function getConfigForTask(task: TaskNodeType) {
  switch (task.type) {
    case 'summarization':
      return task.config as SummarizationConfig;
    case 'scraping':
      return task.config as ScrapingConfig;
    case 'classification':
      return task.config as ClassificationConfig;
    case 'email':
      return task.config as EmailConfig;
  }
}
// Watch for task changes and initialize config
watch(
  () => props.task,
  (newTask) => {
    if (!newTask) {
      editableConfig.value = null;
      return;
    }
    const defaultConfig = defaultConfigs[newTask.type];
    const currentConfig = getConfigForTask(newTask);
    editableConfig.value = { ...defaultConfig, ...currentConfig };
  },
  { immediate: true }
);

// Handle form submission
const handleSubmit = () => {
  if (!editableConfig.value || !props.task) return;

  // Validate config type before emitting
  switch (props.task.type) {
    case 'summarization':
      if (isSummarizationConfig(editableConfig.value)) {
        emit('save', editableConfig.value);
      }
      break;
    case 'scraping':
      if (isScrapingConfig(editableConfig.value)) {
        emit('save', editableConfig.value);
      }
      break;
    case 'classification':
      if (isClassificationConfig(editableConfig.value)) {
        emit('save', editableConfig.value);
      }
      break;
    case 'email':
      if (isEmailConfig(editableConfig.value)) {
        emit('save', editableConfig.value);
      }
      break;
  }
  onClose();
};


const onClose = () => {
  emit('close');
};


</script>