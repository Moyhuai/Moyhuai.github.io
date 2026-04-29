<script setup lang="ts">
import { ref } from 'vue'

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

const showSettings = ref(false)
</script>

<template>
  <!-- 设置按钮 - 位于框架右上角 -->
  <div class="absolute top-4 right-4 z-50">
    <div 
      class="relative group"
      @mouseenter="showSettings = true"
      @mouseleave="showSettings = false"
    >
      <!-- 设置按钮 -->
      <button
        class="p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-gray-100 dark:border-gray-700"
      >
        <svg
          class="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 group-hover:rotate-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      <!-- 设置菜单 -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-show="showSettings"
          class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- 暗黑模式切换 -->
          <button
            @click="$emit('toggleDarkMode')"
            class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div class="flex items-center gap-3">
              <van-icon
                :name="isDarkMode ? 'checked' : 'close'"
                :class="isDarkMode ? 'text-green-500' : 'text-gray-400'"
                size="18"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {{ isChinese ? '暗黑模式' : 'Dark Mode' }}
              </span>
            </div>
            <van-icon
              name="moon-o"
              size="20"
              class="text-purple-500"
            />
          </button>

         
          <!-- 语言切换 -->
          <button
            @click="$emit('toggleLanguage')"
            class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border-t border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center gap-3">
              <van-icon
                name="checked"
                class="text-green-500"
                size="18"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {{ isChinese ? '英文' : 'Chinese' }}
              </span>
            </div>
            <van-icon
              name="translator"
              size="20"
              class="text-orange-500"
            />
          </button>
           <!-- 音乐控制 -->
          <button
            @click="$emit('toggleMusic')"
            class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border-t border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center gap-3">
              <van-icon
                :name="isMusicPlaying ? 'pause' : 'play'"
                :class="isMusicPlaying ? 'text-blue-500' : 'text-gray-400'"
                size="18"
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
            <van-icon
              :name="isMusicPlaying ? 'volume-o' : 'mute-o'"
              size="20"
              :class="isMusicPlaying ? 'text-blue-500' : 'text-gray-400'"
            />
          </button>

        </div>
      </transition>
    </div>
  </div>
</template>
