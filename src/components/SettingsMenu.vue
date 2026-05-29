<script setup lang="ts">
import { LanguagesIcon, CheckIcon, PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon, Moon, Sun, Github, Mail, Heart } from 'lucide-vue-next'

const props = defineProps<{
  isDarkMode: boolean
  isMusicPlaying: boolean
  currentTrack?: string
  currentArtist?: string
  isChinese: boolean
}>()

const emit = defineEmits<{
  toggleDarkMode: []
  toggleMusic: []
  toggleLanguage: []
}>()
</script>

<template>
  <!-- 设置菜单 -->
  <div class="space-y-2">
    <!-- 主题切换 -->
    <button
      @click="$emit('toggleDarkMode')"
      class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg"
    >
      <div class="flex items-center gap-3">
        <Sun
          v-if="isDarkMode"
          :size="18"
          class="text-yellow-500"
        />
        <Moon
          v-else
          :size="18"
          class="text-blue-500"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">
          {{ isChinese ? (isDarkMode ? '浅色模式' : '深色模式') : (isDarkMode ? 'Light Mode' : 'Dark Mode') }}
        </span>
      </div>
      <CheckIcon
        v-if="isDarkMode"
        :size="16"
        class="text-green-500"
      />
    </button>

    <!-- 语言切换 -->
    <button
      @click="$emit('toggleLanguage')"
      class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg"
    >
      <div class="flex items-center gap-3">
        <LanguagesIcon
          :size="18"
          class="text-orange-500"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">
          {{ isChinese ? 'English' : '中文' }}
        </span>
      </div>
      <CheckIcon
        v-if="!isChinese"
        :size="16"
        class="text-green-500"
      />
    
    </button>

    <!-- 音乐控制 -->
    <button
      @click="$emit('toggleMusic')"
      class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg"
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
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ currentTrack || (isChinese ? '未选择歌曲' : 'No song selected') }}
            
          </span>
          <span v-if="currentArtist" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ currentArtist }}
          </span>
        </div>
      </div>
      <Volume2Icon
        v-if="isMusicPlaying"
        :size="18"
        class="text-blue-500"
      />
      <VolumeXIcon
        v-else
        :size="18"
        class="text-gray-400"
      />
    </button>

    <!-- 分割线 -->
    <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

    <!-- 快捷链接 -->
    <div class="px-2">
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">{{ isChinese ? '快速链接' : 'Quick Links' }}</p>
      <div class="space-y-1">
        <a
          href="https://github.com/moyhuai"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <Github :size="18" class="text-gray-600 dark:text-gray-400" />
          <span class="text-sm text-gray-700 dark:text-gray-300">GitHub</span>
        </a>
        <a
          href="mailto:moyhuai@example.com"
          class="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <Mail :size="18" class="text-gray-600 dark:text-gray-400" />
          <span class="text-sm text-gray-700 dark:text-gray-300">Email</span>
        </a>
      </div>
    </div>

    <!-- 系统信息 -->
    <div class="px-2">
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">{{ isChinese ? '系统信息' : 'System Info' }}</p>
      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2">
        <div class="flex justify-between text-xs">
          <span class="text-gray-500 dark:text-gray-400">{{ isChinese ? '版本' : 'Version' }}</span>
          <span class="text-gray-700 dark:text-gray-300">v1.0.0</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-gray-500 dark:text-gray-400">{{ isChinese ? '框架' : 'Framework' }}</span>
          <span class="text-gray-700 dark:text-gray-300">Vue 3</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-gray-500 dark:text-gray-400">{{ isChinese ? '样式' : 'Style' }}</span>
          <span class="text-gray-700 dark:text-gray-300">Tailwind CSS</span>
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

    <!-- 关于 -->
    <div class="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg mt-4">
      <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
        <span class="flex items-center gap-1 justify-center">
          <Heart :size="14" class="text-red-500" />
          <span>{{ isChinese ? '用心制作' : 'Made with love' }}</span>
        </span>
      </p>
    </div>
  </div>
</template>