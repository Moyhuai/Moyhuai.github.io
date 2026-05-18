<script setup lang="ts">
import { ArrowRight, Star, GitFork, ExternalLink, Loader2 } from 'lucide-vue-next'
import { useGitHubProjects } from '../composables/useGitHubProjects'
import type { Project } from '../types'

const props = defineProps<{
  title: string
  githubUsername?: string
  projects?: Project[]
}>()

// 如果提供了 githubUsername，则从 GitHub API 获取项目
const { projects: githubProjects, loading, error } = useGitHubProjects(props.githubUsername)

// 使用传入的 projects 或从 GitHub 获取的 projects
const displayProjects = props.projects || githubProjects
</script>

<template>
  <!-- 项目展示 -->
  <div class="mb-10">
    <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-5 text-center">
      {{ title }}
    </h3>

    <!-- 加载状态 -->
    <div v-if="loading && !props.projects" class="flex justify-center items-center py-10">
      <Loader2 class="w-6 h-6 animate-spin text-gray-400" />
      <span class="ml-2 text-gray-500 dark:text-gray-400">加载项目中...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error && !props.projects" class="text-center py-10">
      <p class="text-red-500 dark:text-red-400 mb-2">加载失败</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
    </div>

    <!-- 项目列表 -->
    <div v-else class="space-y-3">
      <a
        v-for="(project, index) in displayProjects"
        :key="index"
        :href="project.url"
        target="_blank"
        rel="noopener noreferrer"
        class="group block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h4 class="font-semibold text-base text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
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
        
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {{ project.description }}
        </p>
        
        <!-- 技术栈标签 -->
        <div class="flex flex-wrap gap-1.5 mb-3">
          <span
            v-for="tech in project.tech"
            :key="tech"
            class="px-2 py-0.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-gray-700 dark:text-gray-300 text-xs rounded-md border border-blue-100 dark:border-blue-800/50"
          >
            {{ tech }}
          </span>
        </div>
        
        <!-- 项目统计信息 -->
        <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
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
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
