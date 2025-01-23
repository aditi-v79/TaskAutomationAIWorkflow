<template>
    <svg class="connection-line" pointer-events="none">
      <defs>
        <marker
          :id="markerId"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" :fill="getStatusColor" />
        </marker>
      </defs>
      <path
        :d="generatePath()"
        :stroke="getStatusColor"
        :class="status"
        fill="none"
        stroke-width="2"
        :marker-end="`url(#${markerId})`"
      />
    </svg>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  const props = defineProps<{
    source: { x: number; y: number };
    target: { x: number; y: number };
    status?: 'valid' | 'invalid' | 'default';
  }>();
  
  const markerId = computed(() => `marker-${props.status || 'default'}`);
  
  const getStatusColor = computed(() => {
    switch (props.status) {
      case 'valid': return '#22c55e';
      case 'invalid': return '#ef4444';
      default: return '#3b82f6';
    }
  });
  
  const generatePath = () => {
    const deltaX = props.target.x - props.source.x;
    const controlPoint1X = props.source.x + deltaX * 0.5;
    const controlPoint2X = props.target.x - deltaX * 0.5;
    
    return `M ${props.source.x},${props.source.y} 
            C ${controlPoint1X},${props.source.y} 
              ${controlPoint2X},${props.target.y} 
              ${props.target.x},${props.target.y}`;
  };
  </script>
  
  <style scoped>
  .connection-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  path {
    transition: stroke 0.2s ease;
    
    &.valid { @apply stroke-green-500; }
    &.invalid { @apply stroke-red-500; }
    &.default { @apply stroke-blue-500; }
  }
  </style>
  
  