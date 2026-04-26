
import { ref, onMounted, onUnmounted } from 'vue'

// 定义音乐轨道接口
interface MusicTrack {
  name: string
  url: string
}

// 音乐文件列表 - 直接存储可读的中文歌曲名称和URL
const musicFiles: MusicTrack[] = [
  {
    name: '再见',
    url: new URL('../assets/music/再见.mp3', import.meta.url).href
  },
  {
    name: '唯一',
    url: new URL('../assets/music/唯一.mp3', import.meta.url).href
  },
  {
    name: '小城夏天',
    url: new URL('../assets/music/小城夏天.mp3', import.meta.url).href
  },
  {
    name: '泡沫',
    url: new URL('../assets/music/泡沫.mp3', import.meta.url).href
  }
]

/**
 * 音乐播放管理 Composable
 * @returns isPlaying - 是否正在播放
 * @returns currentTrack - 当前播放的歌曲名称
 * @returns toggleMusic - 切换播放状态函数
 */
export function useMusic() {
  const isPlaying = ref(false)
  const currentTrack = ref('')
  let audioElement: HTMLAudioElement | null = null
  let currentTrackIndex = 0

  // 初始化音乐
  const initAudio = () => {
    // 创建音频元素
    audioElement = new Audio()
    
    // 设置初始音轨
    loadTrack(0)
    
    // 监听音频加载成功
    audioElement.addEventListener('canplay', () => {
      console.log('音频加载成功，可以播放:', currentTrack.value)
    })
    
    // 监听播放结束，自动播放下一首
    audioElement.addEventListener('ended', () => {
      console.log('当前歌曲播放完毕，切换到下一首')
      playNextTrack()
    })
    
    // 监听播放错误
    audioElement.addEventListener('error', (e) => {
      console.error('音频播放错误:', e)
      // 尝试播放下一首
      playNextTrack()
    })
  }

  // 加载指定索引的歌曲
  const loadTrack = (index: number) => {
    if (!audioElement || index < 0 || index >= musicFiles.length) return
    
    currentTrackIndex = index
    const track = musicFiles[index]
    currentTrack.value = track.name
    
    audioElement.src = track.url
    audioElement.load()
    console.log('已加载歌曲:', currentTrack.value)
  }

  // 播放下一首（随机）
  const playNextTrack = () => {
    let nextIndex
    do {
      nextIndex = Math.floor(Math.random() * musicFiles.length)
    } while (nextIndex === currentTrackIndex && musicFiles.length > 1)
    
    loadTrack(nextIndex)
    
    if (isPlaying.value && audioElement) {
      audioElement.play().catch(err => {
        console.error('自动播放失败:', err)
      })
    }
  }

  // 初始化音乐状态
  onMounted(() => {
    // 从 localStorage 恢复音乐状态
    const savedMusic = localStorage.getItem('musicPlaying')
    if (savedMusic !== null) {
      isPlaying.value = savedMusic === 'true'
    }
    
    // 初始化音频元素
    initAudio()
  })

  // 组件卸载时清理
  onUnmounted(() => {
    if (audioElement) {
      audioElement.pause()
      audioElement = null
    }
  })

  // 切换音乐播放
  const toggleMusic = () => {
    if (!audioElement) {
      console.error('音频元素未初始化')
      return
    }

    isPlaying.value = !isPlaying.value
    localStorage.setItem('musicPlaying', isPlaying.value.toString())

    if (isPlaying.value) {
      // 播放音乐
      audioElement.play()
        .then(() => {
          console.log('音乐播放中:', currentTrack.value)
        })
        .catch(err => {
          console.error('音乐播放失败:', err)
          isPlaying.value = false
          localStorage.setItem('musicPlaying', 'false')
        })
    } else {
      // 暂停音乐
      audioElement.pause()
      console.log('音乐已暂停:', currentTrack.value)
    }
  }

  return {
    isPlaying,
    currentTrack,
    toggleMusic
  }
}
