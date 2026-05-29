<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProfileCard from './components/ProfileCard.vue'
import SocialLinks from './components/SocialLinks.vue'
import ProjectList from './components/ProjectList.vue'
import SettingsMenu from './components/SettingsMenu.vue'
import BackgroundBlobs from './components/BackgroundBlobs.vue'
import { useDarkMode } from './composables/useDarkMode'
import { useLanguage } from './composables/useLanguage'
import { useMusic } from './composables/useMusic'

import { socialLinks } from './data/socialLinks'
import { i18n } from './data/i18n'
import { quotes } from './data/quotes'
import { Menu, Sun } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'

const showSettings = ref(false)
const isLoaded = ref(false)
const currentQuote = ref('')

// 响应式控制页面滚动
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768 // md 断点
}

onMounted(() => {
  // 更新时间
  updateTime()
  setInterval(updateTime, 1000)

  // 初始化随机语录
  refreshQuote()

  const loadEle = document.getElementById("loading-screen");
  if (loadEle) {
    loadEle.classList.add("hide");
    isLoaded.value = true;
  }

  // 初始化检查
  checkMobile()
  // 监听窗口大小变化
  window.addEventListener('resize', checkMobile)
})

// 使用 Composables
const { isDarkMode, toggleDarkMode } = useDarkMode()
const { isChinese, toggleLanguage } = useLanguage()
const { isPlaying: isMusicPlaying, currentTrack, toggleMusic } = useMusic()


// 获取当前时间
const currentTime = ref(new Date())
const timeString = ref('')
const dateString = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  timeString.value = `${hours}:${minutes}:${seconds}`

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  dateString.value = `${weekdays[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}.`
}

// 随机获取一条语录（不与上一次重复）
const refreshQuote = () => {
  const lastIndex = parseInt(localStorage.getItem('lastQuoteIndex') || '-1')
  let randomIndex
  
  // 如果只有一条语录，直接使用
  if (quotes.length === 1) {
    randomIndex = 0
  } else {
    // 循环直到生成不同的索引
    do {
      randomIndex = Math.floor(Math.random() * quotes.length)
    } while (randomIndex === lastIndex)
  }
  
  currentQuote.value = quotes[randomIndex]
  localStorage.setItem('lastQuoteIndex', randomIndex.toString())
}

onMounted(() => {
  // 更新时间
  updateTime()
  setInterval(updateTime, 1000)

  // 初始化随机语录
  refreshQuote()

  const loadEle = document.getElementById("loading-screen");
  if (loadEle) {
    loadEle.classList.add("hide");
    isLoaded.value = true;
  }
})

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const SettingsMenuRef = ref();

onClickOutside(SettingsMenuRef, () => {
  showSettings.value = false;
});

</script>

<template>
  <div
    class="theme-transition min-h-screen bg-linear-to-br from-sky-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    :style="{ overflowY: isMobile ? 'auto' : 'hidden' }">
    <BackgroundBlobs />

    <!-- 顶部导航栏 -->
    <nav
      class="fixed top-0 left-0 right-0 z-50 bg-sky-100/95 dark:bg-gray-800/95 backdrop-blur-md px-6 py-2 md:relative">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Logo 区域 -->
        <div class="flex items-center gap-2 ">
          <img src="/avatar.png" alt="Logo" class="w-18 h-18 rounded-full" />
          <div class="flex flex-col gap-5 ">
            <div class="flex items-baseline gap-0.5 ">
              <span class="text-lg font-bold text-gray-800 dark:text-gray-200 italic">Moyhuai</span>
              <span class="text-[0.6rem] text-gray-500 dark:text-gray-400 italic">| MyIndex</span>
            </div>

          </div>
        </div>

        <!-- 右侧操作按钮 -->
        <div class="flex items-center gap-3">
          <button @click="toggleDarkMode"
            class="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300"
            title="切换主题">
            <Sun v-if="isDarkMode" class="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <Sun v-else class="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button @click="toggleSettings"
            class="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300"
            title="打开侧边栏">
            <Menu class="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </button>
        </div>
      </div>
    </nav>

    <!-- 侧边栏遮罩层 -->
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showSettings"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        @click="showSettings = false"
      ></div>
    </transition>

    <!-- 侧边栏菜单 -->
    <transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="showSettings"
        class="fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[500px] lg:w-[550px] xl:w-[600px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col">
       <!-- 侧边栏头部 -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 text-center">
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ i18n[isChinese ? 'zh' : 'en'].settings }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ i18n[isChinese ? 'zh' : 'en'].personalizeExperience }}</p>
        </div>

        <!-- 侧边栏内容 -->
        <div class="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <SettingsMenu
            :is-dark-mode="isDarkMode"
            :is-music-playing="isMusicPlaying"
            :current-track="currentTrack"
            :is-chinese="isChinese"
            @toggle-dark-mode="toggleDarkMode"
            @toggle-music="toggleMusic"
            @toggle-language="toggleLanguage"
          />
        </div>

        <!-- 侧边栏底部 -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="showSettings = false"
            class="w-full px-4 py-2 bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 rounded-lg text-black dark:text-black transition-colors duration-200"
          
          >
            {{ i18n[isChinese ? 'zh' : 'en'].closeSidebar }}
          </button>
        </div>
      </div>
    </transition>

    <!-- 主内容区 -->
    <main class="relative z-10 px-4 pt-24 pb-12 md:py-16">
      <div class="max-w-2xl mx-auto">
      <!-- 双列布局 -->
        <div :class="[
          'transform transition-all duration-700',
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        ]">

          <!-- 左侧列 -->
          <div class="float-left w-full md:w-[calc(50%-10px)] space-y-6">
            <!-- 头像卡片 -->
            <div
              class="bg-linear-to-br from-sky-100/80 to-teal-100/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-md rounded-2xl p-5 shadow-lg">
              <ProfileCard :is-loaded="isLoaded" />
            </div>

            <!-- 名言卡片 -->
            <div class="bg-sky-50/80 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-md border border-sky-100/50 dark:border-gray-700/50">
              <div class="flex items-start gap-3">
                <span class="text-xl text-gray-700 dark:text-gray-300 font-serif italic">"知识不能替代友谊，比起失去你，我宁愿做个笨蛋。</span>
               
              </div>
            </div>

            <!-- 社交链接 -->
            <SocialLinks :links="socialLinks" />
          </div>

          <!-- 右侧列 -->
          <div class="float-right w-full md:w-[calc(50%-12px)] space-y-6">
            <!-- 时间卡片 -->
            <div
              class="max-w-md bg-linear-to-br from-sky-200/80 to-teal-200/80 dark:from-gray-700/80 dark:to-gray-600/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <div class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-3 font-mono">
                {{ timeString }}
              </div>
              <div class="text-base text-gray-600 dark:text-gray-400 italic">
                {{ dateString }}
              </div>
              <div class="mt-4 pt-4 border-t border-sky-300/30 dark:border-gray-600/30">
                <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ currentQuote }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-2 text-right">
                  —— 《精选语录》
                </p>
              </div>
            </div>

            <!-- 项目列表 -->
            <ProjectList :title="i18n[isChinese ? 'zh' : 'en'].featuredProjects" github-username="moyhuai" />


            <!-- 展示更多按钮 -->
            <div class="text-center">
              <button
                class="px-6 py-3 bg-sky-100/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full text-gray-700 dark:text-gray-300 hover:bg-sky-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 hover:scale-105">
                <span class="flex items-center justify-center gap-2">
                  <span>📦</span>
                  <span class="text-gray-700 dark:text-gray-300">展示更多仓库</span>
                </span>
              </button>
            </div>
          </div>

          <!-- 清除浮动 -->
          <div class="clear-both"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 隐藏滚动条 */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
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