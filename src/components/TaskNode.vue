<template>
  <div 
    :id="task.id"
    class="task-node"
    :class="{
      'configured': isConfigured,
      'selected': isSelected,
      'has-error': hasError
    }"
    :style="{ left: `${task.position.x}px`, top: `${task.position.y}px` }"
    draggable="true"
    @dragstart="handleDragStart"
    @click="$emit('select', task.id)"
  >
    <div class="task-header">
      <component :is="taskIcons[task.type]" class="w-5 h-5" />
      <span>{{ task.name }}</span>
      <button 
        @click.stop="$emit('configure', task)"
        class="config-button"
      >
        <Settings class="w-4 h-4" />
      </button>
    </div>
    
    <!-- Connection Points -->
    <div 
      class="connection-point input"
      :class="{ 'valid-target': isValidTarget }"
      data-type="target"
      @mouseup="handleConnectionEnd"
    ></div>
    <div 
      class="connection-point output"
      data-type="source"
      @mousedown="handleConnectionStart"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { Settings } from 'lucide-vue-next';
import { computed } from 'vue';
import type { TaskNode } from '../types/workflow';

const props = defineProps<{
  task: TaskNode;
  isSelected?: boolean;
  isConfigured?: boolean;
  isValidTarget?: boolean;
  hasError?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'configure', task: TaskNode): void;
  (e: 'connectionStart', taskId: string): void;
  (e: 'connectionEnd', taskId: string): void;
}>();

const handleConnectionStart = (event: MouseEvent) => {
  emit('connectionStart', props.task.id);
};

const handleConnectionEnd = (event: MouseEvent) => {
  emit('connectionEnd', props.task.id);
};
</script>

<style scoped>
.task-node {
  @apply absolute bg-white rounded-lg shadow-md p-4 min-w-[200px] cursor-move
         transition-all duration-200 border-2 border-transparent;
}

.task-node.selected {
  @apply border-primary ring-2 ring-primary/20;
}

.task-node.configured {
  @apply border-green-500;
}

.task-node.has-error {
  @apply border-red-500;
}

.task-header {
  @apply flex items-center gap-2;
}

.config-button {
  @apply ml-auto p-1 rounded-md hover:bg-slate-100 text-slate-500
         hover:text-slate-700 transition-colors;
}

.connection-point {
  @apply w-3 h-3 rounded-full bg-primary absolute cursor-pointer
         transition-all duration-200;
  
  &.input { 
    @apply -left-1.5 top-1/2 -translate-y-1/2;
    &.valid-target { @apply bg-green-500 scale-125; }
  }
  
  &.output { 
    @apply -right-1.5 top-1/2 -translate-y-1/2;
    &:hover { @apply scale-125; }
  }
}
</style>
