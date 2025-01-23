<template>
  <div class="max-w-5xl mx-auto py-8 px-4">
    <div 
      class="mb-8"
      :class="{
        'flex justify-between items-center': workflows.length > 0,
        'text-center': workflows.length === 0
      }"
    >
      <h1 
        class="text-2xl font-bold text-slate-900"
        :class="{
          'mx-auto mb-12': workflows.length === 0
        }"
      >
        My Workflows
      </h1>
      <button 
        v-if="workflows.length > 0"
        @click="$emit('createWorkflow')" 
        class="btn-primary"
      >
        <Plus class="w-4 h-4 mr-2" />
        Create Workflow
      </button>
    </div>

    <div v-if="workflows.length === 0" class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
        <Boxes class="w-8 h-8 text-slate-400" />
      </div>
      <h3 class="text-lg font-medium text-slate-900 mb-2">No workflows yet</h3>
      <p class="text-slate-500 mb-6">Create your first workflow to get started</p>
      <button @click="$emit('createWorkflow')" class="btn-primary">
        <Plus class="w-4 h-4 mr-2" />
        Create Workflow
      </button>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="workflow in workflows"
        :key="workflow.id"
        class="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary/50 transition-colors"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-medium text-slate-900 mb-1">{{ workflow.name }}</h3>
            <p class="text-slate-500">{{ workflow.description }}</p>
          </div>
          <span :class="getStatusClass(workflow.status)" class="px-3 py-1 rounded-full text-sm font-medium">
            {{ workflow.status }}
          </span>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-500">
            Last updated: {{ new Date(workflow.updated_at).toLocaleDateString() }}
          </div>
          <div class="flex items-center space-x-2">
            <button 
              @click="$emit('editWorkflow', workflow.id)"
              class="btn-secondary"
            >
              <Edit class="w-4 h-4 mr-2" />
              Edit
            </button>
            <button 
              v-if="workflow.status === 'idle'"
              @click="$emit('runWorkflow', workflow.id)"
              class="btn-primary"
            >
              <Play class="w-4 h-4 mr-2" />
              Run
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Boxes, Edit, Play } from 'lucide-vue-next';
import type { Workflow } from '../types/workflow';

defineProps<{
  workflows: Workflow[];
}>();

defineEmits<{
  (e: 'createWorkflow'): void;
  (e: 'editWorkflow', id: string): void;
  (e: 'runWorkflow', id: string): void;
}>();

function getStatusClass(status: Workflow['status']) {
  const classes = {
    idle: 'bg-slate-100 text-slate-700',
    running: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };
  return classes[status];
}
</script>
