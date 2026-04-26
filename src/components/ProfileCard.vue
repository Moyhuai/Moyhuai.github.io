<script setup lang="ts">
import { assets } from '../data/assets'

defineProps<{
  isLoaded: boolean
}>()
</script>

<template>
  <!-- 头像区域 -->
  <div class="flex flex-col items-center mb-10">
    <!-- 头像 -->
    <div class="relative mb-8 group">
      <!-- 多层渐变光晕 -->
      <div class="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-gradient"></div>
      <div class="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
      
      <img
        :src="assets.avatar"
        alt="Moyhuai"
        class="relative w-44 h-44 md:w-52 md:h-52 rounded-full border-4 border-white dark:border-gray-700 shadow-2xl object-cover group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-in-out cursor-pointer"
        @error="(e: any) => e.target.src = assets.avatar"
      />
      
      <!-- 在线状态指示器 -->
      <div class="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-700 rounded-full animate-pulse"></div>
    </div>

    <!-- 姓名和标题 -->
    <div class="text-center space-y-3">
      <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-500 tracking-tight">
        Moyhuai
      </h1>
    </div>
  </div>
</template>

<style scoped>
/* 组件特定样式保留 */
</style>
