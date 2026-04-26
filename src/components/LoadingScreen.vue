<script setup lang="ts">
import { assets } from '../data/assets'
import BackgroundBlobs from './BackgroundBlobs.vue'

defineProps<{
  isVisible: boolean
}>()
</script>

<template>
  <Transition name="loading-fade">
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <!-- 背景装饰组件 -->
      <BackgroundBlobs />

      <!-- 头像和名字 -->
      <div class="flex flex-col items-center gap-6">
        <!-- 头像 -->
        <div class="relative group">
          <!-- 多层渐变光晕 -->
          <div class="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 animate-gradient"></div>
          <div class="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-full blur-xl opacity-30"></div>
          
          <img
            :src="assets.avatar"
            alt="Moyhuai"
            class="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-700 shadow-2xl object-cover animate-float"
            @error="(e: any) => e.target.src = assets.avatar"
          />
        </div>

        <!-- 名字 -->
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse tracking-tight">
          Moyhuai
        </h1>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 淡入淡出过渡 */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.5s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
</style>
