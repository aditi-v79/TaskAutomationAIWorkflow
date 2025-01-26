<template>
  <div 
    class="relative w-full h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <!-- Grid Background -->
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>

    <!-- Render Active Connection -->
  <ConnectionLine
    v-if="activeConnection"
    :source="activeConnection.sourcePosition"
    :target="activeConnection.targetPosition"
  />

  <!-- Render Existing Connections -->
  <ConnectionLine
    v-for="connection in connections"
    :key="connection.id"
    :source="getNodePosition(connection.sourceId)"
    :target="getNodePosition(connection.targetId)"
  />


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
      @connectionStart="StartNodeConnection"
      @connectionEnd="EndNodeConnection"
      @configure="openConfigModal"
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

    <!--Task Config Modal -->
    <TaskConfigModal 
     v-if="showConfig"
    :is-open="showConfig"
    :task="selectedTaskForConfig"
    @close="showConfig = false"
    @save="handleConfigSave"
  />

</template>

<script setup lang="ts">
import { Move as MoveIcon } from 'lucide-vue-next';
import type { TaskNodeType, Connection, ScrapingConfig,SummarizationConfig,EmailConfig, ClassificationConfig } from '../types/workflow';
import { defineEmits,ref } from 'vue';
import { TaskType,ActiveConnection } from '../types/workflow';
import TaskNode from './TaskNode.vue';
import TaskConfigModal from './TaskConfigModal.vue';
import ConnectionLine from './ConnectionLine.vue';



 defineProps<{
  tasks: TaskNodeType[];
  connections: Connection[];
  selectedTaskId?: string;
}>();

const emit = defineEmits<{
  (e: 'addTask', type: TaskType, position: { x: number; y: number }): void;
  (e: 'updateTask', task: TaskNodeType): void;
  (e: 'selectTask', taskId: string): void;
  (e: 'updateTaskPosition', taskId: string, position: { x: number; y: number }): void;
  (e: 'createConnection', connection: { sourceId: string; targetId: string }): void;
}>();

let draggedTask: TaskNodeType | null = null;
const activeConnection = ref<ActiveConnection | null>(null);
const showConfig = ref(false);
const selectedTaskForConfig = ref<TaskNodeType | undefined>(undefined); ;

const getNodePosition = (nodeId: string) => {
  const node = document.getElementById(nodeId);
  if (!node) return { x: 0, y: 0 };

  const rect = node.getBoundingClientRect();
  return {
    x:  rect.left + rect.width,
    y: rect.top + (rect.height / 2)
  };
};

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
    
     // Check if the drop occurred on a task node handle
    const targetNode = document.elementFromPoint(event.clientX, event.clientY)?.closest('.task-node');
    if (targetNode) {
      const targetTaskId = targetNode.id;
      emit('createConnection', {
        sourceId: task.id,
        targetId: targetTaskId
      });
    } else {
      emit('addTask', task.type, position);
    }
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

function StartNodeConnection( taskId: string, position: { x: number, y: number } ) {
  console.log('StartNodeConnection called:', {taskId, position});
  activeConnection.value = {
    sourceId: taskId,
    sourcePosition: position,
    targetPosition: position,
  };
}

const EndNodeConnection = ( targetId: string) => {
  if (activeConnection.value && activeConnection.value.sourceId !== targetId) {
    emit('createConnection', {
      sourceId: activeConnection.value.sourceId,
      targetId
    });
  }
  activeConnection.value = null;
};

// function handleMouseMove(event: MouseEvent) {
//   if (activeConnection.value) {
//     console.log('Mouse Move:', { x: event.clientX, y: event.clientY });
//     activeConnection.value.targetPosition = { x: event.clientX, y: event.clientY };
//   }
// }


const openConfigModal = (task: TaskNodeType) => {
  selectedTaskForConfig.value = task;
  showConfig.value = true;
};

const handleConfigSave = (config: SummarizationConfig | ScrapingConfig | ClassificationConfig | EmailConfig) => {
  if (selectedTaskForConfig.value) {
    const updatedTask = {
      ...selectedTaskForConfig.value,
      config
    };
    emit('updateTask', updatedTask);
  }
  showConfig.value = false;
  selectedTaskForConfig.value = undefined;
};


</script>

<style scoped>
.task-node {
  @apply absolute bg-white rounded-xl p-4 shadow-sm border border-slate-200 cursor-move select-none;
  min-width: 240px;
}
</style>
