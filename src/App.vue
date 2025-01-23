<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <Header
      :showBackButton="currentView === 'editor'"
      :onSave="handleSave"
      :onRun="handleRun"
      :isRunning="isRunning"
      @backToList="currentView = 'list'"
    />
    
    <template v-if="currentView === 'list'">
      <WorkflowList
        :workflows="workflows"
        @createWorkflow="handleCreateWorkflow"
        @editWorkflow="handleEditWorkflow"
        @runWorkflow="handleRunWorkflow"
      />
    </template>

    <template v-else>
      <div class="flex-1 flex overflow-hidden">
        <Sidebar @addTask="handleAddTask" />
        <main class="flex-1 p-6 overflow-auto">
          <WorkflowCanvas
            :tasks="currentWorkflow?.tasks || []"
            @taskClick="setSelectedTaskId"
            :selectedTaskId="selectedTaskId"
            @updateTaskPosition="handleUpdateTaskPosition"
            @addTask="handleAddTaskFromDrop"
          />
        </main>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWorkflowStore } from './stores/workflowStore';
import { storeToRefs } from 'pinia';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import WorkflowCanvas from './components/WorkflowCanvas.vue';
import WorkflowList from './components/WorkflowList.vue';
import type { Task } from './types/workflow';

const store = useWorkflowStore();
const { workflows, currentWorkflow } = storeToRefs(store);
const selectedTaskId = ref<string>();
const isRunning = ref(false);
const currentView = ref<'list' | 'editor'>('list');

onMounted(async () => {
  await store.fetchWorkflows();
});

const handleCreateWorkflow = async () => {
  await store.createWorkflow('New Workflow', 'Created workflow');
  currentView.value = 'editor';
};

const handleEditWorkflow = async (id: string) => {
  await store.loadWorkflow(id);
  currentView.value = 'editor';
};

const handleRunWorkflow = async (id: string) => {
  isRunning.value = true;
  try {
    await store.executeWorkflow(id);
  } finally {
    isRunning.value = false;
  }
};

const handleAddTaskFromDrop = async (type: Task['type'], position: { x: number, y: number }) => {
  if (currentWorkflow.value) {
    await store.addTask(type, `New ${type} task`, position);
  }
};

const handleUpdateTaskPosition = async (taskId: string, position: { x: number, y: number }) => {
  if (currentWorkflow.value) {
    await store.updateTaskPosition(taskId, position);
  }
};

const handleAddTask = async (type: Task['type']) => {
  if (currentWorkflow.value) {
    await store.addTask(type, `New ${type} task`, { x: 100, y: 100 });
  }
};

const handleSave = async () => {
  if (currentWorkflow.value) {
    await store.updateWorkflow();
  }
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
