<template>
  <svg class="absolute inset-0 pointer-events-none z-100000">
    <path
      :d="generatePath"
      fill="none"
      stroke="#64748b"
      stroke-width="2"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  source: { x: number; y: number };
  target: { x: number; y: number };
}>();

const generatePath = computed(() => {
  const { source, target } = props;
  const deltaX = target.x - source.x;
  const deltaY = target.y - source.y;
  const controlPointOffset = Math.abs(deltaX) * 0.5;

  return `M ${source.x} ${source.y} 
          C ${source.x + controlPointOffset} ${source.y},
            ${target.x - controlPointOffset} ${target.y},
            ${target.x} ${target.y}`;
});
</script>
