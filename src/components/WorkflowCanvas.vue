<template>
  <div 
    class="relative w-full h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <!-- Grid Background -->
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>

    <!-- Existing Connections -->
    <ConnectionManager :connections="connections" :tasks="tasks" />

    <!-- Render Task Nodes -->
    <TaskNode
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      :isSelected="selectedTaskId === task.id"
      :style="{ left: `${task.position.x}px`, top: `${task.position.y}px` }"
      @select="selectTask(task.id)"
      @dragstart="handleTaskDragStart(task)"
      @dragend="handleTaskDragEnd(task, $event)"
      @connectionStart="startConnection"
      @connectionEnd="endConnection"
    />

    <!-- Empty State -->
    <div v-if="tasks.length === 0" class="absolute inset-0 flex items-center justify-center">
      <div class="text-center text-slate-500">
        <MoveIcon class="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <h3 class="text-lg font-medium mb-2">Start Building Your Workflow</h3>
        <p>Drag tasks from the sidebar to begin</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Move as MoveIcon } from 'lucide-vue-next';
import type { TaskNodeType, Connection } from '../types/workflow';
import { defineEmits,ref } from 'vue';
import { TaskType } from '../types/workflow';
import TaskNode from './TaskNode.vue';
import ConnectionManager from './ConnectionManager.vue';



defineProps<{
  tasks: TaskNodeType[];
  connections: Connection[];
  selectedTaskId?: string;
}>();

const emit = defineEmits<{
  (e: 'updateTask', task: TaskNodeType): void;
  (e: 'createConnection', connection: { sourceId: string; targetId: string }): void;
  (e: 'selectTask', taskId: string): void;
  (e: 'addTask', type: TaskType, position: { x: number; y: number }): void;
  (e: 'updateTaskPosition', taskId: string, position: { x: number; y: number }): void;
}>();

let draggedTask: TaskNodeType | null = null;
const connectionManager = ref<InstanceType<typeof ConnectionManager> | null>(null);


function handleDragOver(event: DragEvent) {
  event.preventDefault();
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  const data = event.dataTransfer?.getData('application/json');
  if (data) {
    const task = JSON.parse(data);
    // Calculate position relative to the canvas
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    
    emit('addTask', task.type, position);
  }
}

function handleTaskDragStart(task: TaskNodeType) {
  draggedTask = task;
}

function handleTaskDragEnd(task: TaskNodeType, event: DragEvent) {
  if (!draggedTask) return;
  
  const canvasRect = (event.currentTarget as HTMLElement).parentElement?.getBoundingClientRect();
  if (canvasRect) {
    const position = {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top
    };
    emit('updateTaskPosition', task.id, position);
  }
  draggedTask = null;
}

const selectTask = (id: string) => {
  emit('selectTask', id);
};

const startConnection = (taskId: string, event: MouseEvent) => {
  if (connectionManager.value) {
    connectionManager.value.startConnection(taskId,event);
  }
};

const endConnection = (taskId: string) => {
  connectionManager.value?.endConnection(taskId);
};

</script>

<style scoped>
.task-node {
  @apply absolute bg-white rounded-xl p-4 shadow-sm border border-slate-200 cursor-move select-none;
  min-width: 240px;
}
</style>
