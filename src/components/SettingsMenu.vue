<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {  PauseIcon, PlayIcon, Github, Mail, Heart, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume1, Volume2, VolumeX } from 'lucide-vue-next'
import type { PlayMode } from '../composables/useMusic'

const props = defineProps<{
  isDarkMode: boolean
  isMusicPlaying: boolean
  currentTrack?: string
  currentArtist?: string
  currentCover?: string
  isChinese: boolean
  playMode?: PlayMode
  volume?: number
  isMuted?: boolean
}>()

const emit = defineEmits<{
  toggleDarkMode: []
  toggleMusic: []
  toggleLanguage: []
  togglePlayMode: []
  playNext: []
  playPrev: []
  toggleMute: []
}>()

// 进度条相关
const progress = ref(0)
const duration = ref(100)
const currentTime = ref(0)
const audioElement = ref<HTMLAudioElement | null>(null)
const playModeLabel = computed(() => {
  const mode = props.playMode || 'sequential'
  if (mode === 'sequential') return props.isChinese ? '顺序播放' : 'Sequential'
  if (mode === 'single') return props.isChinese ? '单曲循环' : 'Repeat One'
  return props.isChinese ? '随机播放' : 'Shuffle'
})

const volumePercent = computed(() => Math.round((props.volume ?? 1) * 100))

const volumeIcon = computed(() => {
  if (props.isMuted || (props.volume ?? 1) === 0) return VolumeX
  if ((props.volume ?? 1) < 0.5) return Volume1
  return Volume2
})

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function updateProgress() {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
    duration.value = audioElement.value.duration || 100
    progress.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
  }
}

let progressInterval: number | null = null

onMounted(() => {
  audioElement.value = document.querySelector('audio')
  if (audioElement.value) {
    progressInterval = window.setInterval(updateProgress, 100)
  }
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})

function seekTo(event: MouseEvent) {
  const target = event.target as HTMLDivElement
  const rect = target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percent = x / rect.width
  if (audioElement.value) {
    audioElement.value.currentTime = percent * (audioElement.value.duration || 100)
  }
}


</script>

<template>
  <!-- 设置菜单 -->
  <div class="space-y-2">
    <!-- 主题切换 -->
    <div class="sidebar-footer-row">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ isChinese ? '深色模式' : 'Dark Mode' }}</span>
      </div>
      <label class="theme-toggle" for="theme-checkbox">
        <input type="checkbox" id="theme-checkbox" :checked="isDarkMode" @change="$emit('toggleDarkMode')" />
        <span class="slider">
          <span class="knob-container">
            <span class="sun">☀</span>
            <span class="moon">☾</span>
          </span>
        </span>
      </label>
    </div>

    <!-- 语言切换 -->
    <div class="sidebar-footer-row">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ isChinese ? 'English' : '中文' }}</span>
      </div>
      <label class="theme-toggle lang-toggle" for="lang-checkbox">
        <input type="checkbox" id="lang-checkbox" :checked="!isChinese" @change="$emit('toggleLanguage')" />
        <span class="slider">
          <span class="knob-container">
            <span class="zh">中</span>
            <span class="en">EN</span>
          </span>
        </span>
      </label>
    </div>

    <!-- 音乐播放器 -->
    <div class="player cursor-pointer" style="--theme: var(--color-player-theme);">
      <!-- 封面和歌曲信息 -->
      <div class="flex justify-center items-center mb-4">
        <div class="cover-container relative w-32 h-32">
          <div
            class="vinyl-disc"
            :class="{ 'rotating': isMusicPlaying, 'hidden': !isMusicPlaying }"
          ></div>
          <img
            crossorigin="anonymous"
            :src="currentCover"
            :alt="currentTrack || 'Album cover'"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg object-cover transition-all duration-500 z-10"
            :class="isMusicPlaying ? 'w-18 h-18 rounded-full rotating' : 'w-32 h-32 rounded-lg'"
            @error="(e) => (e.target as HTMLImageElement).src = '/avatar.png'"
          />
        </div>
        <div class="info-container flex-1 min-w-0 ml-2 max-w-48">
          <div class="name-artist">
            <div class="name text-lg font-semibold text-gray-800 dark:text-gray-200 truncate text-center max-h-7">
              {{ currentTrack || (isChinese ? '未选择歌曲' : 'No song selected') }}
            </div>
            <div class="artist text-base text-gray-500 dark:text-gray-400 text-center truncate max-h-6">
              {{ currentArtist || (isChinese ? '未知歌手' : 'Unknown Artist') }}
            </div>
          </div>
          <div class="cur-lyric text-sm text-gray-400 dark:text-gray-500 mt-1 text-center truncate max-h-5">
            作曲 : {{ currentArtist || (isChinese ? '未知' : 'Unknown') }}
          </div>
        </div>
      </div>
      <!-- 进度条 -->
      <div class="progress-bar-container mx-2 mb-4 flex justify-center h-full">
        <div class="flex items-center gap-2 w-full max-w-xs">
          <span class="text-xs text-gray-500 dark:text-gray-400 w-10">{{ formattedCurrentTime }}</span>
          <div
            class="progress-bar flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer overflow-hidden"
            @click="seekTo"
          >
            <div
              class="progress h-full bg-[var(--theme)] rounded-full transition-all duration-100"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400 w-10">{{ formattedDuration }}</span>
        </div>
      </div>
      <!-- 控制按钮 -->
      <div class="controls flex items-center justify-center gap-5">
        <div
          class="control order p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          :title="playModeLabel"
          @click="$emit('togglePlayMode')"
        >
          <Repeat v-if="(playMode || 'sequential') === 'sequential'" :size="20" class="text-gray-500" />
          <Repeat1 v-else-if="playMode === 'single'" :size="20" class="text-gray-500" />
          <Shuffle v-else :size="20" class=" text-gray-500" />
        </div>
        <div
          class="control prev p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          :title="isChinese ? '上一首' : 'Previous'"
          @click="$emit('playPrev')"
        >
          <SkipBack :size="20" class="text-gray-500 dark:text-gray-400" />
        </div>
        <div
          class="control play w-14 h-14 rounded-full bg-[var(--theme)] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-md"
          :title="isChinese ? (isMusicPlaying ? '暂停' : '播放') : (isMusicPlaying ? 'Pause' : 'Play')"
          @click="$emit('toggleMusic')"
        >
          <PauseIcon v-if="isMusicPlaying" :size="28" class="text-white" />
          <PlayIcon v-else :size="28" class="text-white" />
        </div>
        <div
          class="control next p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          :title="isChinese ? '下一首' : 'Next'"
          @click="$emit('playNext')"
        >
          <SkipForward :size="20" class="text-gray-500 dark:text-gray-400" />
        </div>
        <div
          class="control volume p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          :title="isMuted ? (isChinese ? '已静音' : 'Muted') : `${volumePercent}%`"
          @click="$emit('toggleMute')"
        >
          <component :is="volumeIcon" :size="20" class="text-gray-500 dark:text-gray-400" />
        </div>
      </div>
    </div>

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
          <span>{{ isChinese ? 'Moyhuai用心制作' : 'Moyhuai Made with love' }}</span>
        </span>
      </p>
    </div>
  </div>
</template>