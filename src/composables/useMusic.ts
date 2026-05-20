
import { ref, onMounted, onUnmounted } from 'vue'

// 定义音乐轨道接口
interface MusicTrack {
  name: string
  artist: string
  url: string
  cover?: string
  lyricsFile?: string  // 歌词文件路径（相对于public目录）
}

// 音乐文件列表 - 包含歌曲名称、歌手、URL、封面和歌词文件路径
const musicFiles: MusicTrack[] = [
  {
    name: '再见',
    artist: '张震岳',
    url: new URL('/music/再见.mp3', import.meta.url).href,
    cover: '/favicon.svg',
    lyricsFile: '/music/再见.lrc'
  },
  {
    name: '唯一',
    artist: '告五人',
    url: new URL('/music/唯一.mp3', import.meta.url).href,
    cover: '/favicon.svg',
    lyricsFile: '/music/唯一.lrc'
  },
  {
    name: '小城夏天',
    artist: 'LBI利比',
    url: new URL('/music/小城夏天.mp3', import.meta.url).href,
    cover: '/favicon.svg',
    lyricsFile: '/music/小城夏天.lrc'
  },
  {
    name: '泡沫',
    artist: 'G.E.M.邓紫棋',
    url: new URL('/music/泡沫.mp3', import.meta.url).href,
    cover: '/favicon.svg',
    lyricsFile: '/music/泡沫.lrc'
  }
]

/**
 * 解析LRC格式的歌词文本
 * @param lrcText LRC格式的歌词文本
 * @returns 解析后的歌词数组
 */
const parseLyrics = (lrcText: string): string[] => {
  const lines = lrcText.split('\n')
  const lyrics: string[] = []
  
  for (const line of lines) {
    // 匹配时间戳格式 [mm:ss.xx] 或 [mm:ss.xxx]
    const match = line.match(/\[\d{2}:\d{2}\.\d{2,3}\](.*)/)
    if (match && match[1].trim()) {
      lyrics.push(match[1].trim())
    }
  }
  
  return lyrics
}

/**
 * 从文件加载歌词
 * @param lyricsFile 歌词文件路径
 * @returns Promise<string[]> 解析后的歌词数组
 */
const loadLyricsFromFile = async (lyricsFile: string): Promise<string[]> => {
  try {
    const response = await fetch(lyricsFile)
    if (!response.ok) {
      throw new Error(`Failed to load lyrics: ${response.status}`)
    }
    const text = await response.text()
    return parseLyrics(text)
  } catch (error) {
    console.error('加载歌词失败:', error)
    return []
  }
}

/**
 * 音乐播放管理 Composable
 * @returns isPlaying - 是否正在播放
 * @returns currentTrack - 当前播放的歌曲名称
 * @returns currentArtist - 当前歌手名字
 * @returns currentCover - 当前歌曲封面
 * @returns currentLyrics - 当前歌词
 * @returns toggleMusic - 切换播放状态函数
 * @returns playNext - 播放下一首
 * @returns playPrev - 播放上一首
 */
export function useMusic() {
  const isPlaying = ref(false)
  const currentTrack = ref('')
  const currentArtist = ref('')
  const currentCover = ref('')
  const currentLyrics = ref<string[]>([])
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
      playNext()
    })
    
    // 监听播放错误
    audioElement.addEventListener('error', (e) => {
      console.error('音频播放错误:', e)
      // 尝试播放下一首
      playNext()
    })
  }

  // 加载指定索引的歌曲
  const loadTrack = async (index: number) => {
    if (!audioElement || index < 0 || index >= musicFiles.length) return
    
    currentTrackIndex = index
    const track = musicFiles[index]
    currentTrack.value = track.name
    currentArtist.value = track.artist
    currentCover.value = track.cover || '/favicon.svg'
    
    // 如果有歌词文件路径，异步加载歌词
    if (track.lyricsFile) {
      currentLyrics.value = await loadLyricsFromFile(track.lyricsFile)
      console.log('已加载歌词:', currentLyrics.value.length, '行')
    } else {
      currentLyrics.value = []
    }
    
    audioElement.src = track.url
    audioElement.load()
    console.log('已加载歌曲:', currentTrack.value, '- 歌手:', currentArtist.value)
    
    // 更新 Media Session 元数据
    updateMediaSessionMetadata(track)
  }

  // 播放下一首
  const playNext = async () => {
    const nextIndex = (currentTrackIndex + 1) % musicFiles.length
    await loadTrack(nextIndex)
    
    if (isPlaying.value && audioElement) {
      audioElement.play().catch(err => {
        console.error('自动播放失败:', err)
      })
    }
  }

  // 播放上一首
  const playPrev = async () => {
    const prevIndex = (currentTrackIndex - 1 + musicFiles.length) % musicFiles.length
    await loadTrack(prevIndex)
    
    if (isPlaying.value && audioElement) {
      audioElement.play().catch(err => {
        console.error('自动播放失败:', err)
      })
    }
  }

  // 更新 Media Session 元数据
  const updateMediaSessionMetadata = (track: MusicTrack) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.name,
        artist: track.artist,
        album: 'Personal Playlist',
        artwork: [
          { src: track.cover || '/favicon.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      })
    }
  }

  // 更新 Media Session 播放状态
  const updateMediaSessionPlaybackState = () => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying.value ? 'playing' : 'paused'
    }
  }

  // 初始化 Media Session API
  const initMediaSession = () => {
    if (!('mediaSession' in navigator)) {
      console.log('浏览器不支持 Media Session API')
      return
    }

    // 设置初始元数据
    updateMediaSessionMetadata(musicFiles[0])

    // 设置播放控制处理器
    navigator.mediaSession.setActionHandler('play', () => {
      if (!isPlaying.value) {
        toggleMusic()
      }
    })

    navigator.mediaSession.setActionHandler('pause', () => {
      if (isPlaying.value) {
        toggleMusic()
      }
    })

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      playPrev()
    })

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      playNext()
    })

    // 监听音频播放状态变化，同步到 Media Session
    audioElement?.addEventListener('play', () => {
      updateMediaSessionPlaybackState()
    })

    audioElement?.addEventListener('pause', () => {
      updateMediaSessionPlaybackState()
    })
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
    
    // 初始化 Media Session API
    initMediaSession()
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
          console.log('音乐播放中:', currentTrack.value, '-', currentArtist.value)
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
    currentArtist,
    currentCover,
    currentLyrics,
    toggleMusic,
    playNext,
    playPrev
  }
}
