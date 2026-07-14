import { ref, onMounted } from 'vue'
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

const CACHE_KEY = 'github_latest_project_cache'
const CACHE_EXPIRY_KEY = 'github_latest_project_cache_expiry'
const CACHE_DURATION = 1 * 60 * 60 * 1000 // 1小时缓存

export function useGitHubProjects(username: string = 'moyhuai') {
  const projects = ref<Project[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  // 从缓存获取数据
  const getCachedData = (): Project[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      const expiry = localStorage.getItem(CACHE_EXPIRY_KEY)
      
      if (!cached || !expiry) return null
      
      // 检查缓存是否过期
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

  // 保存数据到缓存
  const setCachedData = (data: Project[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      localStorage.setItem(CACHE_EXPIRY_KEY, Date.now().toString())
    } catch (err) {
      console.error('保存缓存失败:', err)
    }
  }

  const fetchProjects = async () => {
    // 先尝试从缓存加载
    const cached = getCachedData()
    if (cached) {
      projects.value = cached
      loading.value = false
      console.log('使用缓存的GitHub项目数据')
      return
    }

    try {
      loading.value = true
      error.value = null

      // 获取用户的公共仓库
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=1`)
      
      if (!response.ok) {
        throw new Error(`GitHub API 请求失败: ${response.status}`)
      }

      const repos: GitHubRepo[] = await response.json()

      // 转换为 Project 格式
      projects.value = repos
        .filter(repo => !repo.fork && repo.name !== 'Moyhuai.github.io') // 过滤掉 fork 的仓库和自己的网站仓库
        .map(repo => {
          // 格式化更新时间
          const timeAgo = formatDate(repo.updated_at)
          
          return {
            title: repo.name,
            description: repo.description || '暂无描述',
            url: repo.html_url,
            tech: [
              repo.language || 'Unknown',
              ...repo.topics.slice(0, 3) // 最多显示3个topics
            ].filter(Boolean),
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updatedAt: timeAgo,
            homepage: repo.homepage
          }
        })

      // 保存到缓存
      setCachedData(projects.value)
      console.log('GitHub项目数据已缓存')
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      console.error('获取 GitHub 项目失败:', err)
      
      // 如果API请求失败但有缓存，仍使用缓存
      const cached = getCachedData()
      if (cached) {
        projects.value = cached
        console.log('API请求失败，使用缓存数据')
      }
    } finally {
      loading.value = false
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return "今天";
    } else if (diffDays === 1) {
        return "昨天";
    } else if (diffDays < 30) {
        return `${diffDays} 天前`
    } else if (diffDays < 365) {
        return `${Math.floor(diffDays / 30)} 个月前}`
    } else {
        return `${Math.floor(diffDays / 365)} 年前`
    }
};

  onMounted(() => {
    fetchProjects()
  })

  return {
    projects,
    loading,
    error,
    fetchProjects
  }
}
