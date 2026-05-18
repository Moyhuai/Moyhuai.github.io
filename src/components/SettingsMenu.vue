<script setup lang="ts">
import { MoonIcon, LanguagesIcon, CheckIcon, XIcon, PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from 'lucide-vue-next'

const props = defineProps<{
  isDarkMode: boolean
  isMusicPlaying: boolean
  currentTrack?: string
  isChinese: boolean
}>()

const emit = defineEmits<{
  toggleDarkMode: []
  toggleMusic: []
  toggleLanguage: []
}>()
</script>

<template>
  <!-- 设置菜单 - 直接显示 -->
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    <div
      class="w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <!-- 暗黑模式切换 -->
      <button
        @click="$emit('toggleDarkMode')"
        class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <div class="flex items-center gap-3">
          <CheckIcon
            v-if="isDarkMode"
            :size="18"
            class="text-green-500"
          />
          <XIcon
            v-else
            :size="18"
            class="text-gray-400"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ isChinese ? '暗黑模式' : 'Dark Mode' }}
          </span>
        </div>
        <MoonIcon
          :size="20"
          class="text-purple-500"
        />
      </button>

     
      <!-- 语言切换 -->
      <button
        @click="$emit('toggleLanguage')"
        class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center gap-3">
          <CheckIcon
            :size="18"
            class="text-green-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ isChinese ? '英文' : 'Chinese' }}
          </span>
        </div>
        <LanguagesIcon
          :size="20"
          class="text-orange-500"
        />
      </button>
       <!-- 音乐控制 -->
      <button
        @click="$emit('toggleMusic')"
        class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center gap-3">
          <PauseIcon
            v-if="isMusicPlaying"
            :size="18"
            class="text-blue-500"
          />
          <PlayIcon
            v-else
            :size="18"
            class="text-gray-400"
          />
          <div class="flex flex-col items-start">
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ isChinese ? (isMusicPlaying ? '音乐播放中' : '音乐') : (isMusicPlaying ? 'Music Playing' : 'Music') }}
            </span>
            <span v-if="currentTrack && isMusicPlaying" class="text-xs text-blue-500 mt-0.5">
              {{ currentTrack }}
            </span>
          </div>
        </div>
        <Volume2Icon
          v-if="isMusicPlaying"
          :size="20"
          class="text-blue-500"
        />
        <VolumeXIcon
          v-else
          :size="20"
          class="text-gray-400"
        />
      </button>

    </div>
  </transition>
</template>
