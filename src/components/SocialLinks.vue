<script setup lang="ts">
import { Github } from 'lucide-vue-next'
import type { SocialLink } from '../types'

defineProps<{
  links: SocialLink[]
}>()
</script>

<template>
  <!-- 社交链接 -->
  <div class="flex justify-center gap-3 mb-10 flex-wrap">
    <a
      v-for="link in links"
      :key="link.name"
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      class="group relative flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden"
    >
      <!-- 悬停背景 -->
      <div 
        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        :class="link.color"
      ></div>
      
      <!-- GitHub 图标 -->
      <Github
        v-if="link.name === 'GitHub'"
        class="w-5 h-5 relative z-10 text-gray-700 dark:text-gray-300 group-hover:text-current transition-colors duration-300"
      />
      
      <!-- Bilibili 图标 -->
      <svg
        v-else-if="link.name === 'Bilibili'"
        class="w-5 h-5 relative z-10 text-gray-700 dark:text-gray-300 group-hover:text-current transition-colors duration-300"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z"/>
      </svg>
      
      <!-- QQ 图标 -->
      <svg
        v-else-if="link.name === 'QQ'"
        class="w-5 h-5 relative z-10 text-gray-700 dark:text-gray-300 group-hover:text-current transition-colors duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M6 9.748a14.716 14.716 0 0 0 11.995 -.052c.275 -9.236 -11.104 -11.256 -11.995 .052" />
        <path d="M18 10c.984 2.762 1.949 4.765 2 7.153c.014 .688 -.664 1.346 -1.184 .303c-.346 -.696 -.952 -1.181 -1.816 -1.456" />
        <path d="M17 16c.031 1.831 .147 3.102 -1 4" />
        <path d="M8 20c-1.099 -.87 -.914 -2.24 -1 -4" />
        <path d="M6 10c-.783 2.338 -1.742 4.12 -1.968 6.43c-.217 2.227 .716 1.644 1.16 .917c.296 -.487 .898 -.934 1.808 -1.347" />
        <path d="M15.898 13l-.476 -2" />
        <path d="M8 20l-1.5 1c-.5 .5 -.5 1 .5 1h10c1 0 1 -.5 .5 -1l-1.5 -1" />
        <path d="M12.75 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M9.25 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      </svg>
      
      <!-- 微信图标 -->
      <svg
        v-else-if="link.name === 'WeChat'"
        class="w-5 h-5 relative z-10 text-gray-700 dark:text-gray-300 group-hover:text-current transition-colors duration-300"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M16.5 10c3.038 0 5.5 2.015 5.5 4.5c0 1.397 -.778 2.645 -2 3.47l0 2.03l-1.964 -1.178a6.649 6.649 0 0 1 -1.536 .178c-3.038 0 -5.5 -2.015 -5.5 -4.5s2.462 -4.5 5.5 -4.5" />
        <path d="M11.197 15.698c-.69 .196 -1.43 .302 -2.197 .302a8.008 8.008 0 0 1 -2.612 -.432l-2.388 1.432v-2.801c-1.237 -1.082 -2 -2.564 -2 -4.199c0 -3.314 3.134 -6 7 -6c3.782 0 6.863 2.57 7 5.785l0 .233" />
        <path d="M10 8h.01" />
        <path d="M7 8h.01" />
        <path d="M15 14h.01" />
        <path d="M18 14h.01" />
      </svg>
      
      <!-- 网易云音乐图标 -->
      <svg
        v-else-if="link.name === 'NeteaseCloudMusic'"
        class="w-5 h-5 relative z-10 text-gray-700 dark:text-gray-300 group-hover:text-current transition-colors duration-300"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M10 8v8l6-4z"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    </a>
  </div>
</template>
