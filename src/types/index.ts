// 社交链接类型
export interface SocialLink {
  name: string
  url: string
  color: string
}

// 项目类型
export interface Project {
  title: string
  description: string
  url: string
  tech: string[]
  stars?: number
  forks?: number
  updatedAt?: string
  homepage?: string | null
}

// i18n 配置类型
export interface I18nConfig {
  featuredProjects: string
  copyright: string
  madeWith: string
  andCoffee: string
  projects: Project[]
}

// 多语言映射类型
export type Language = 'zh' | 'en'

// 设备视图类型
export type DeviceView = 'auto' | 'mobile' | 'desktop'
