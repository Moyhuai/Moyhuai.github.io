<script setup lang="ts">
import type { SocialLink } from '../types'

defineProps<{
  links: SocialLink[]
}>()
</script>

<template>
  <!-- 社交链接 -->
  <div class="flex justify-center gap-3 mb-10 flex-wrap">
    <a
      v-for="link in links"
      :key="link.name"
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      class="group relative flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden"
    >
      <!-- 悬停背景 -->
      <div 
        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        :class="link.color"
      ></div>
      
      <van-icon
        :name="link.icon"
        size="20"
        class="relative z-10 text-gray-700 dark:text-gray-300 group-hover:text-current transition-colors duration-300"
      />
      <span class="relative z-10 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-current transition-colors duration-300">
        {{ link.name }}
      </span>
    </a>
  </div>
</template>
