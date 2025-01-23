<template>
  <header class="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button 
          v-if="showBackButton"
          @click="$emit('backToList')" 
          class="mr-2 p-2 hover:bg-slate-50 rounded-lg"
        >
          <ArrowLeft class="w-5 h-5 text-slate-500" />
        </button>
        <h1 class="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
          Workflow Builder
        </h1>
        <div v-if="showBackButton" class="flex items-center space-x-4">
          <div class="h-6 w-px bg-slate-200" />
          <span class="text-sm text-slate-500 flex items-center">
            <Edit2 class="w-4 h-4 mr-2" />
            Untitled Workflow
          </span>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <button 
          v-if="showBackButton"
          @click="onSave" 
          class="btn-secondary"
        >
          <Save class="w-4 h-4 mr-2" />
          Save
        </button>

        <button
          v-if="showBackButton"
          @click="onRun"
          :disabled="isRunning"
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play class="w-4 h-4 mr-2" />
          {{ isRunning ? 'Running...' : 'Run Workflow' }}
        </button>

        <button class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
          <Settings class="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Play, Save, Settings, Edit2, ArrowLeft } from 'lucide-vue-next';

defineProps<{
  showBackButton: boolean;
  onSave: () => void;
  onRun: () => void;
  isRunning: boolean;
}>();

defineEmits<{
  (e: 'backToList'): void;
}>();
</script>