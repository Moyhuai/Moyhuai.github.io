import { ref, onMounted } from 'vue'
import { getRandomQuote } from '../data/quotes'

export function useQuotes() {
  const currentQuote = ref('')

  // 初始化时随机获取一条语录
  onMounted(() => {
    currentQuote.value = getRandomQuote()
  })

  // 刷新语录（可选功能）
  const refreshQuote = () => {
    currentQuote.value = getRandomQuote()
  }

  return {
    currentQuote,
    refreshQuote
  }
}
