<template>
  <div 
    :id="task.id"
    class="absolute bg-white rounded-lg shadow-md p-4 min-w-[200px] transition-all duration-200 border-2 border-primary"
    :class="{
      'border-primary ring-2 ring-primary/20': isSelected,
      'border-green-500': isConfigured,
      'border-red-500': hasError
    }"
    
    @click="$emit('select', task.id)"
    @dragstart="handleEdgeDragStart"
    @dragend="handleEdgeDragEnd"
  >

    <!-- Node Content -->
    <div class="flex items-center gap-2" >

      <button 
        class="p-1 cursor-move hover:bg-slate-100 rounded-md"
        @mousedown.stop="handleDragStart"
        draggable="true"
      >
        <GripVertical class="w-4 h-4 text-slate-400" />
      </button>
    

      <div class="flex-1 flex items-center gap-2 select-none" >
      <component :is="taskIcons[task.type]" class="w-5 h-5" />
      <span>{{ task.name }}</span>
      </div>
     
      <button 
        @click.stop="$emit('configure', task)"
        class="ml-auto p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <Settings class="w-4 h-4" />
      </button>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { Database, Activity, Mail, Image, Settings, GripVertical } from 'lucide-vue-next';
import type { TaskNodeType } from '../types/workflow';
import {ref} from 'vue';

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
  (e: 'connectionStart', taskId: string, position: { x: number; y: number } ): void;
  (e: 'connectionEnd', targetId: string): void;
  (e: 'dragstart', task: TaskNodeType): void;
}>();

const activeConnection = ref<{ sourceId?: string; sourceHandle?: string; targetId?: string; targetHandle?: string; position?: { x: number; y: number } } | null>(null);
// const showConfig = ref(false);

// Handle node dragging
const handleDragStart = (event: MouseEvent) => {
  event.stopPropagation();
  emit('dragstart', props.task);
};

const handleEdgeDragStart = (event: DragEvent) => {
  // Only start edge creation if not dragging from grip handle
  if ((event.target as HTMLElement).closest('button')) return;
  
  const position = { x: event.clientX, y: event.clientY };
  emit('connectionStart', props.task.id, position);
};

const handleEdgeDragEnd = (event: DragEvent) => {
  // Find the node under the cursor
  const targetElement = document.elementFromPoint(event.clientX, event.clientY);
  const targetNode = targetElement?.closest('[id]');
  
  if (targetNode && targetNode.id !== props.task.id) {
    emit('connectionEnd', targetNode.id);
  }
};

</script>

