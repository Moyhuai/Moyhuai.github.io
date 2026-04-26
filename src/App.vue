<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'
import ProfileCard from './components/ProfileCard.vue'
import SocialLinks from './components/SocialLinks.vue'
import ProjectList from './components/ProjectList.vue'
import SettingsMenu from './components/SettingsMenu.vue'
import BackgroundBlobs from './components/BackgroundBlobs.vue'
import { useDarkMode } from './composables/useDarkMode'
import { useLanguage } from './composables/useLanguage'
import { useMusic } from './composables/useMusic'
import { useDeviceView } from './composables/useDeviceView'
import { socialLinks } from './data/socialLinks'
import { i18n } from './data/i18n'

// 页面加载动画
const isLoaded = ref(false)
const showLoading = ref(true)

// 使用 Composables
const { isDarkMode, toggleDarkMode } = useDarkMode()
const { isChinese, toggleLanguage } = useLanguage()
const { isPlaying: isMusicPlaying, currentTrack, toggleMusic } = useMusic()
const { containerClass } = useDeviceView()

onMounted(() => {
  // 模拟加载时间，实际项目中可以根据资源加载情况调整
  setTimeout(() => {
    showLoading.value = false
    setTimeout(() => {
      isLoaded.value = true
    }, 500)
  }, 2000)
})
</script>

<template>
  <div class="theme-transition min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    
    <!-- 加载页面组件 -->
    <LoadingScreen :is-visible="showLoading" />
    
    <!-- 背景装饰元素组件 -->
    <BackgroundBlobs />

    <!-- 主要内容容器 -->
    <div class="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 md:py-16">
      
      <!-- 外围框架 -->
      <div class="relative w-full max-w-3xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 md:p-10">
        
        <!-- 设置菜单组件 -->
        <SettingsMenu
          :is-dark-mode="isDarkMode"
          :is-music-playing="isMusicPlaying"
          :current-track="currentTrack"
          :is-chinese="isChinese"
          @toggle-dark-mode="toggleDarkMode"
          @toggle-music="toggleMusic"
          @toggle-language="toggleLanguage"
        />
        
        <!-- 个人卡片组件 -->
        <div 
          :class="[containerClass, 'w-full mx-auto transform transition-all duration-700', isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0']"
        >
          <ProfileCard :is-loaded="isLoaded" />

          <!-- 社交链接组件 -->
          <SocialLinks :links="socialLinks" />

          <!-- 项目列表组件 -->
          <ProjectList
            :title="i18n[isChinese ? 'zh' : 'en'].featuredProjects"
            :projects="i18n[isChinese ? 'zh' : 'en'].projects"
          />

          <!-- 底部信息 -->
          <div class="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-500 dark:text-gray-500 mb-2">
              {{ i18n[isChinese ? 'zh' : 'en'].copyright }}
            </p>
            <div class="flex justify-center items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
              <span>{{ i18n[isChinese ? 'zh' : 'en'].madeWith }}</span>
              <span class="text-red-500 animate-pulse">❤️</span>
              <span>{{ i18n[isChinese ? 'zh' : 'en'].andCoffee }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #667eea, #764ba2);
  border-radius: 6px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #5568d3, #65408b);
  border: 2px solid transparent;
  background-clip: padding-box;
}

/* 选择文本样式 */
::selection {
  background: rgba(102, 126, 234, 0.3);
  color: inherit;
}

/* 焦点可见性优化 */
*:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
</style>
