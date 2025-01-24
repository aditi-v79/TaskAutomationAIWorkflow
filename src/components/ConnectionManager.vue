<template>
  <div class="connections-layer">
    <!-- Existing Connections -->
    <ConnectionLine
      v-for="connection in connections"
      :key="connection.id"
      :source="getNodePosition(connection.sourceId)"
      :target="getNodePosition(connection.targetId)"
      :status="connection.status"
    />

    <!-- Active Connection Line -->
    <ConnectionLine
      v-if="activeConnection"
      :source="activeConnection.source"
      :target="activeConnection.target"
      :status="activeConnection.isValid ? 'valid' : 'invalid'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { connectionValidation } from '../services/connectionValidation';
import type { Connection, TaskNodeType } from '../types/workflow';

const props = defineProps<{
  connections: Connection[];
  tasks: TaskNodeType[];
}>();

const emit = defineEmits<{
  (e: 'createConnection', payload: { sourceId: string; targetId: string }): void;
}>();

const activeConnection = ref<{
  source: { x: number; y: number };
  target: { x: number; y: number };
  sourceTask?: TaskNodeType;
  isValid: boolean;
} | null>(null);

// Function to get node position
const getNodePosition = (taskId: string) => {
  const task = props.tasks.find(t => t.id === taskId);
  return task ? task.position : { x: 0, y: 0 }; // Default position if task not found
};

// Connection handling methods
const startConnection = (taskId: string, event: MouseEvent) => {
  const sourceTask = props.tasks.find(t => t.id === taskId);
  if (!sourceTask) return;

  activeConnection.value = {
    source: getNodePosition(taskId),
    target: { x: event.clientX, y: event.clientY },
    sourceTask,
    isValid: false
  };
};

const updateConnection = (event: MouseEvent) => {
  if (!activeConnection.value) return;
  activeConnection.value.target = { x: event.clientX, y: event.clientY };
};

const endConnection = (targetTaskId: string) => {
  if (!activeConnection.value?.sourceTask) return;

  const targetTask = props.tasks.find(t => t.id === targetTaskId);
  if (!targetTask) return;

  const isValid = connectionValidation.isValidConnection(
    activeConnection.value.sourceTask.type,
    targetTask.type
  );

  if (isValid) {
    emit('createConnection', {
      sourceId: activeConnection.value.sourceTask.id,
      targetId: targetTaskId
    });
  }

  activeConnection.value = null;
  
  // Expose methods
defineExpose({
  startConnection,
  endConnection,
});

};
</script>
