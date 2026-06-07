<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { LanguagesIcon, CheckIcon, PauseIcon, PlayIcon, Github, Mail, Heart, SkipBack, SkipForward, Shuffle, Volume1 } from 'lucide-vue-next'

const props = defineProps<{
  isDarkMode: boolean
  isMusicPlaying: boolean
  currentTrack?: string
  currentArtist?: string
  currentCover?: string
  isChinese: boolean
}>()

const emit = defineEmits<{
  toggleDarkMode: []
  toggleMusic: []
  toggleLanguage: []
  playNext: []
  playPrev: []
}>()

// 进度条相关
const progress = ref(0)
const duration = ref(100)
const currentTime = ref(0)
const audioElement = ref<HTMLAudioElement | null>(null)
const isShuffle = ref(false)

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

function toggleShuffle() {
  isShuffle.value = !isShuffle.value
}
</script>

<template>
  <!-- 设置菜单 -->
  <div class="space-y-2">
    <!-- 主题切换 -->
    <div class="sidebar-footer-row">
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

    <!-- 音乐播放器 -->
    <div class="player cursor-pointer" style="--theme: #fddedc;">
      <div class="top flex gap-4">
        <div class="cover-container relative">
          <div class="vinyl-disc hidden"></div>
          <img 
            crossorigin="anonymous" 
            :src="currentCover" 
            :alt="currentTrack || 'Album cover'" 
            class="w-20 h-20 rounded-lg shadow-lg static-mode object-cover"
            @error="(e) => (e.target as HTMLImageElement).src = '/avatar.png'"
          />
          <div class="cover-center hidden"></div>
          
        </div>
        <div class="info-container flex-1 min-w-0">
          <div class="name-artist">
            <div class="name text-base font-semibold text-gray-800 dark:text-gray-200 truncate">
              {{ currentTrack || (isChinese ? '未选择歌曲' : 'No song selected') }}
            </div>
            <div class="artist text-sm text-gray-500 dark:text-gray-400">
              {{ currentArtist || (isChinese ? '未知歌手' : 'Unknown Artist') }}
            </div>
          </div>
          <div class="cur-lyric text-xs text-gray-400 dark:text-gray-500 mt-1">
            作曲 : {{ currentArtist || (isChinese ? '未知' : 'Unknown') }}
          </div>
          <div class="progress-container flex items-center gap-3 mt-3">
            <div class="cur-time text-xs text-gray-400 dark:text-gray-500">
              {{ formattedCurrentTime }}
            </div>
            <div 
              class="progress-bar flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer overflow-hidden"
              @click="seekTo"
            >
              <div 
                class="progress h-full bg-[var(--theme)] rounded-full transition-all duration-100"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
            <div class="total-time text-xs text-gray-400 dark:text-gray-500">
              {{ formattedDuration }}
            </div>
          </div>
        </div>
      </div>
      <div class="bottom mt-4">
        <div class="controls flex items-center justify-center gap-5">
          <div 
            class="control order p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            :title="isChinese ? '随机播放' : 'Shuffle'"
            @click="toggleShuffle"
          >
            <Shuffle :size="20" :class="isShuffle ? 'text-[var(--theme)]' : 'text-gray-500 dark:text-gray-400'" />
          </div>
          <div 
            class="control prev p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            :title="isChinese ? '上一首' : 'Previous'"
            @click="$emit('playPrev')"
          >
            <SkipBack :size="20" class="text-gray-500 dark:text-gray-400" />
          </div>
          <div 
            class="control play w-12 h-12 rounded-full bg-[var(--theme)] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-md"
            :title="isChinese ? (isMusicPlaying ? '暂停' : '播放') : (isMusicPlaying ? 'Pause' : 'Play')"
            @click="$emit('toggleMusic')"
          >
            <PauseIcon v-if="isMusicPlaying" :size="24" class="text-white" />
            <PlayIcon v-else :size="24" class="text-white" />
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
            title="60%"
          >
            <Volume1 :size="20" class="text-gray-500 dark:text-gray-400" />
          </div>
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
          <span>{{ isChinese ? '用心制作' : 'Made with love' }}</span>
        </span>
      </p>
    </div>
  </div>
</template>