<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <Header
        :onSave="handleSave"
        :onRun="handleRun"
        :isRunning="isRunning"
    />
    <div class="flex-1 flex overflow-hidden">
      <Sidebar @addTask="handleAddTask" />
      <main class="flex-1 p-6 overflow-auto">
        <WorkflowCanvas
            :tasks="tasks"
            @taskClick="setSelectedTaskId"
            :selectedTaskId="selectedTaskId"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWorkflowStore } from './stores/workflow';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import WorkflowCanvas from './components/WorkflowCanvas.vue';
import type { Task } from './types/workflow';

const store = useWorkflowStore();
const tasks = ref<Task[]>([]);
const selectedTaskId = ref<string>();
const isRunning = ref(false);

const handleAddTask = (type: string) => {
  const newTask: Task = {
    id: crypto.randomUUID(),
    type: type as Task['type'],
    name: `New ${type} task`,
    config: {},
    position: { x: 100, y: 100 },
  };
  tasks.value.push(newTask);
};

const handleSave = async () => {
  await store.createWorkflow({
    name: 'New Workflow',
    description: 'Created workflow',
    tasks: tasks.value,
    connections: [],
  });
};

const handleRun = async () => {
  if (store.workflows?.[0]) {
    isRunning.value = true;
    try {
      await store.executeWorkflow(store.workflows[0].id);
    } finally {
      isRunning.value = false;
    }
  }
};

const setSelectedTaskId = (taskId: string) => {
  selectedTaskId.value = taskId;
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
