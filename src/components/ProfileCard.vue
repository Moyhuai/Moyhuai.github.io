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
    <div class="relative mb-8">
      <img
        :src="assets.avatar"
        alt="Moyhuai"
        class="relative w-44 h-44 md:w-52 md:h-52 rounded-full border-4 border-white dark:border-gray-700 shadow-2xl object-cover transition-all duration-500 ease-in-out"
        @error="(e: any) => e.target.src = assets.avatar"
      />
      </div>

    <!-- 姓名和标题 -->
    <div class="text-center space-y-3">
      <h1 class="text-3xl md:text-4xl font-bold text-black dark:text-white transition-all duration-500 tracking-tight">
        Moyhuai
      </h1>
      <p class="text-sm text-gray-600 dark:text-gray-400">
              嗨，欢迎来到我的个人网站！
            </p>
    </div>
  </div>
</template>

<style scoped>
/* 组件特定样式保留 */
</style>
