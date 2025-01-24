<template>
  <div 
    :id="task.id"
    class="absolute bg-white rounded-lg shadow-md p-4 min-w-[200px] cursor-move transition-all duration-200 border-2 border-primary"
    :class="{
      'border-primary ring-2 ring-primary/20': isSelected,
      'border-green-500': isConfigured,
      'border-red-500': hasError
    }"
    draggable="true"
    @click="$emit('select', task.id)"
  >
  <!-- Source Handle (Output) -->
  <button 
      class="handle handle-right"
      @mousedown.stop="handleConnectionStart"
    >
      <div class="handle-point"></div>
  </button>

    <!-- Node Content -->
    <div class="flex items-center gap-2">
      <component :is="taskIcons[task.type]" class="w-5 h-5" />
      <span>{{ task.name }}</span>
      <button 
        @click.stop="$emit('configure', task)"
        class="ml-auto p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <Settings class="w-4 h-4" />
      </button>
    </div>

      <!-- Target Handle (Input) -->
    <button 
      class="handle handle-left"
      @mousedown="handleConnectionEnd"
    >
      <div class="handle-point"></div>
    </button>


  </div>
</template>

<script setup lang="ts">
import { Database, Activity, Mail, Image, Settings } from 'lucide-vue-next';
import type { TaskNodeType } from '../types/workflow';


const taskIcons = {
  scraping: Database,
  summarization: Activity,
  email: Mail,
  classification: Image,
};

const props = defineProps<{
  task: TaskNodeType;
  isSelected?: boolean;
  isConfigured?: boolean;
  isValidTarget?: boolean;
  hasError?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'configure', task: TaskNodeType): void;
  (e: 'connectionStart', taskId: string, event: MouseEvent): void;
  (e: 'connectionEnd', taskId: string): void;
}>();

const handleConnectionStart = (event: MouseEvent) => {
  event.stopPropagation();
  emit('connectionStart', props.task.id,event);
};

const handleConnectionEnd = (event: MouseEvent) => {
  event.stopPropagation();
  emit('connectionEnd', props.task.id);
};
</script>

<style scoped>
.handle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.handle-left {
  left: -10px;
}

.handle-right {
  right: -10px;
}

.handle-point {
  width: 12px;
  height: 12px;
  background-color: white;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  transition: all 0.2s;
}

.handle:hover .handle-point {
  transform: scale(1.2);
  border-color: #2563eb;
}
</style>
