import { ref, onMounted } from 'vue'

/**
 * 暗黑模式管理 Composable
 * @returns isDarkMode - 当前是否暗黑模式
 * @returns toggleDarkMode - 切换暗黑模式函数
 */
export function useDarkMode() {
  const isDarkMode = ref(false)

  // 初始化暗黑模式状态
  onMounted(() => {
    // 从 localStorage 恢复暗黑模式设置
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) {
      isDarkMode.value = savedDarkMode === 'true'
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // 检测系统主题偏好
      isDarkMode.value = true
    }

    // 应用暗黑模式
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    }
  })

  // 切换暗黑模式
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  return {
    isDarkMode,
    toggleDarkMode
  }
}
