
<template>
  <div class="w-72 bg-white border-r border-slate-200 p-6">
    <h2 class="text-lg font-semibold text-slate-900 mb-6 flex items-center">
      <Boxes class="w-5 h-5 mr-2 text-primary" />
      Available Tasks
    </h2>

    <div class="space-y-3">
      <button
          v-for="task in tasks"
          :key="task.type"
          @click="$emit('addTask', task.type)"
          class="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-slate-50
          border border-transparent hover:border-slate-200 transition-all duration-200 text-left group"
      >
        <div class="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-colors">
          <component :is="task.icon" class="w-5 h-5" />
        </div>
        <div class="flex-1">
          <p class="font-medium text-slate-900">{{ task.name }}</p>
          <p class="text-sm text-slate-500">{{ task.description }}</p>
        </div>
        <div class="opacity-0 group-hover:opacity-100 transition-opacity">
          <Plus class="w-5 h-5 text-primary" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Database, Activity, Mail, Image, Plus, Boxes } from 'lucide-vue-next';

const tasks = [
  {
    type: 'scraping',
    name: 'Data Scraping',
    description: 'Extract data from websites',
    icon: Database
  },
  {
    type: 'summarization',
    name: 'Text Summarization',
    description: 'Condense text content',
    icon: Activity
  },
  {
    type: 'email',
    name: 'Email Task',
    description: 'Send automated emails',
    icon: Mail
  },
  {
    type: 'classification',
    name: 'Image Classification',
    description: 'Analyze and categorize images',
    icon: Image
  },
];

defineEmits<{
  (e: 'addTask', type: string): void;
}>();
</script>