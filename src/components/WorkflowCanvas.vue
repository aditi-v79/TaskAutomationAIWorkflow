
<template>
  <div class="relative w-full h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden">
    <!-- Grid Background -->
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>

    <!-- Tasks -->
    <div
        v-for="task in tasks"
        :key="task.id"
        class="task-node"
        :class="{ 'ring-2 ring-primary ring-offset-2': selectedTaskId === task.id }"
        :style="{ left: `${task.position.x}px`, top: `${task.position.y}px` }"
        @click="$emit('taskClick', task.id)"
    >
      <div class="flex items-center space-x-4">
        <div class="p-2.5 bg-primary/10 rounded-lg text-primary">
          <component :is="taskIcons[task.type]" class="w-6 h-6" />
        </div>
        <div>
          <h3 class="font-medium text-slate-900">{{ task.name }}</h3>
          <p class="text-sm text-slate-500 capitalize">{{ task.type }}</p>
        </div>
      </div>
    </div>

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
import { Database, Activity, Mail, Image, Move as MoveIcon } from 'lucide-vue-next';
import type { Task } from '../types/workflow';

const taskIcons = {
  scraping: Database,
  summarization: Activity,
  email: Mail,
  classification: Image,
};

defineProps<{
  tasks: Task[];
  selectedTaskId?: string;
}>();

defineEmits<{
  (e: 'taskClick', id: string): void;
}>();
</script>