import { ref, onMounted } from 'vue'

/**
 * 多语言管理 Composable
 * @returns isChinese - 当前是否为中文
 * @returns toggleLanguage - 切换语言函数
 */
export function useLanguage() {
  const isChinese = ref(true)

  // 初始化语言状态
  onMounted(() => {
    // 从 localStorage 恢复语言设置
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage !== null) {
      isChinese.value = savedLanguage === 'zh'
    }
  })

  // 切换语言
  const toggleLanguage = () => {
    isChinese.value = !isChinese.value
    localStorage.setItem('language', isChinese.value ? 'zh' : 'en')
    console.log('当前语言:', isChinese.value ? '中文' : 'English')
  }

  return {
    isChinese,
    toggleLanguage
  }
}
