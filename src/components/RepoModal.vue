<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { X, ArrowRight, Star, GitFork, ExternalLink, Loader2 } from 'lucide-vue-next'
import type { Project } from '../types'

interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  updated_at: string
  created_at: string
  fork: boolean
  homepage: string | null
}

const props = defineProps<{
  githubUsername?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const projects = ref<Project[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const CACHE_KEY = 'github_all_projects_cache'
const CACHE_EXPIRY_KEY = 'github_all_projects_cache_expiry'
const CACHE_DURATION = 1 * 60 * 60 * 1000 // 1小时缓存

const getCachedData = (): Project[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY)
    
    if (!cached || !expiry) return null
    
    if (Date.now() - parseInt(expiry) > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(CACHE_EXPIRY_KEY)
      return null
    }
    
    return JSON.parse(cached)
  } catch (err) {
    console.error('读取缓存失败:', err)
    return null
  }
}

const setCachedData = (data: Project[]) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    localStorage.setItem(CACHE_EXPIRY_KEY, Date.now().toString())
  } catch (err) {
    console.error('保存缓存失败:', err)
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "今天"
  } else if (diffDays === 1) {
    return "昨天"
  } else if (diffDays < 30) {
    return `${diffDays} 天前`
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} 个月前`
  } else {
    return `${Math.floor(diffDays / 365)} 年前`
  }
}

const fetchAllProjects = async () => {
  const cached = getCachedData()
  if (cached) {
    projects.value = cached
    loading.value = false
    console.log('使用缓存的所有GitHub项目数据')
    return
  }

  try {
    loading.value = true
    error.value = null

    const username = props.githubUsername || 'moyhuai'
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
    
    if (!response.ok) {
      throw new Error(`GitHub API 请求失败: ${response.status}`)
    }

    const repos: GitHubRepo[] = await response.json()

    projects.value = repos
      .filter(repo => !repo.fork && repo.name !== 'Moyhuai.github.io')
      .map(repo => {
        const timeAgo = formatDate(repo.updated_at)
        
        return {
          title: repo.name,
          description: repo.description || '暂无描述',
          url: repo.html_url,
          tech: [
            repo.language || 'Unknown',
            ...repo.topics.slice(0, 3)
          ].filter(Boolean),
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updatedAt: timeAgo,
          homepage: repo.homepage
        }
      })

    setCachedData(projects.value)
    console.log('所有GitHub项目数据已缓存')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
    console.error('获取 GitHub 项目失败:', err)
    
    const cached = getCachedData()
    if (cached) {
      projects.value = cached
      console.log('API请求失败，使用缓存数据')
    }
  } finally {
    loading.value = false
  }
}

// 阻止背景滚动
const preventScroll = () => {
  document.body.style.overflow = 'hidden'
}

const restoreScroll = () => {
  document.body.style.overflow = ''
}

onMounted(() => {
  fetchAllProjects()
  preventScroll()
})

onUnmounted(() => {
  restoreScroll()
})

const handleClose = () => {
  restoreScroll()
  emit('close')
}
</script>

<template>
  <transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      @click.self="handleClose"
    >
      <transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="scale-95 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-95 opacity-0"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          <!-- 头部 -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
            <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">所有仓库</h2>
            <button
              @click="handleClose"
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              title="关闭"
            >
              <X class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <!-- 内容区 -->
          <div class="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <!-- 加载状态 -->
            <div v-if="loading" class="flex justify-center items-center py-10">
              <Loader2 class="w-6 h-6 animate-spin text-gray-400" />
              <span class="ml-2 text-gray-500 dark:text-gray-400">加载项目中...</span>
            </div>

            <!-- 错误状态 -->
            <div v-else-if="error" class="text-center py-10">
              <p class="text-red-500 dark:text-red-400 mb-2">加载失败</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
            </div>

            <!-- 项目列表 -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                v-for="(project, index) in projects"
                :key="index"
                :href="project.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-semibold text-sm text-gray-800 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {{ project.title }}
                      </h4>
                      <ExternalLink class="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <!-- 项目主页链接(如果有) -->
                    <a 
                      v-if="project.homepage" 
                      :href="project.homepage"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mb-1"
                      @click.stop
                    >
                      <span>🌐</span>
                      <span>{{ project.homepage.replace(/^https?:\/\//, '') }}</span>
                    </a>
                  </div>
                  <ArrowRight 
                    class="w-4 h-4 text-gray-400 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0 ml-2"
                  />
                </div>
                
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed line-clamp-2">
                  {{ project.description }}
                </p>
                
                <!-- 技术栈标签 -->
                <div class="flex flex-wrap gap-1.5 mb-3">
                  <span
                    v-for="tech in project.tech"
                    :key="tech"
                    class="px-2 py-0.5 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                  >
                    {{ tech }}
                  </span>
                </div>
                
                <!-- 项目统计信息 -->
                <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2">
                  <div v-if="project.stars !== undefined" class="flex items-center gap-1">
                    <Star class="w-3.5 h-3.5" />
                    <span>{{ project.stars }}</span>
                  </div>
                  <div v-if="project.forks !== undefined" class="flex items-center gap-1">
                    <GitFork class="w-3.5 h-3.5" />
                    <span>{{ project.forks }}</span>
                  </div>
                  <div v-if="project.updatedAt" class="flex items-center gap-1 ml-auto">
                    <span>🕒</span>
                    <span>{{ project.updatedAt }}</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
