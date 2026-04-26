import type { Project } from '../types'

export const projects: Record<'zh' | 'en', Project[]> = {
  zh: [
    {
      title: '项目 1',
      description: '基于 Vue.js 和 Node.js 构建的 Web 应用程序',
      url: 'https://github.com',
      tech: ['Vue.js', 'Node.js', 'MongoDB']
    },
    {
      title: '项目 2',
      description: '使用 React Native 开发的移动应用',
      url: 'https://github.com',
      tech: ['React Native', 'TypeScript']
    },
    {
      title: '项目 3',
      description: '开源的数据可视化库',
      url: 'https://github.com',
      tech: ['D3.js', 'JavaScript']
    }
  ],
  en: [
    {
      title: 'Project 1',
      description: 'A web application built with Vue.js and Node.js',
      url: 'https://github.com',
      tech: ['Vue.js', 'Node.js', 'MongoDB']
    },
    {
      title: 'Project 2',
      description: 'Mobile app developed with React Native',
      url: 'https://github.com',
      tech: ['React Native', 'TypeScript']
    },
    {
      title: 'Project 3',
      description: 'Open source library for data visualization',
      url: 'https://github.com',
      tech: ['D3.js', 'JavaScript']
    }
  ]
}
