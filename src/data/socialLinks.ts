import type { SocialLink } from '../types'

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    color: 'hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900'
  },
  {
    name: 'QQ',
    url: 'tencent://message/?uin=YOUR_QQ_NUMBER',
    color: 'hover:bg-blue-500 hover:text-white'
  },
  {
    name: 'WeChat',
    url: '#wechat',
    color: 'hover:bg-green-500 hover:text-white'
  },
  {
    name: 'Bilibili',
    url: 'https://space.bilibili.com/',
    color: 'hover:bg-pink-500 hover:text-white'
  }
]
