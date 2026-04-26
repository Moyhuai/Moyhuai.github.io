<script setup lang="ts">
import type { Project } from '../types'

defineProps<{
  title: string
  projects: Project[]
}>()
</script>

<template>
  <!-- 项目展示 -->
  <div class="mb-10">
    <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-5 text-center">
      {{ title }}
    </h3>
    <div class="space-y-3">
      <a
        v-for="(project, index) in projects"
        :key="index"
        :href="project.url"
        target="_blank"
        rel="noopener noreferrer"
        class="group block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300"
      >
        <div class="flex items-start justify-between mb-1.5">
          <h4 class="font-semibold text-base text-gray-900 dark:text-white transition-colors duration-300">
            {{ project.title }}
          </h4>
          <van-icon 
            name="arrow" 
            class="text-gray-400 transition-all duration-300"
            size="16"
          />
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
          {{ project.description }}
        </p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="tech in project.tech"
            :key="tech"
            class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
          >
            {{ tech }}
          </span>
        </div>
      </a>
    </div>
  </div>
</template>