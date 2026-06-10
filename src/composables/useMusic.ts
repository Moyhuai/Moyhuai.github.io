
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
// 封面图片通过 download_covers.py 脚本从网易云音乐API获取
const musicFiles: MusicTrack[] = [
  {
    name: '再见',
    artist: 'G.E.M.邓紫棋',
    url: new URL('/music/再见.mp3', import.meta.url).href,
    cover: 'https://p1.music.126.net/9YuflxGL7XFAfOnINEsdWw==/109951171358446171.jpg',
    lyricsFile: '/music/再见.lrc'
  },
  {
    name: '唯一',
    artist: '告五人',
    url: new URL('/music/唯一.mp3', import.meta.url).href,
    cover: 'https://p2.music.126.net/C6Vro2l0BH59Wka9gOaC6w==/109951171180358170.jpg',
    lyricsFile: '/music/唯一.lrc'
  },
  {
    name: '小城夏天',
    artist: 'LBI利比',
    url: new URL('/music/小城夏天.mp3', import.meta.url).href,
    cover: 'https://p1.music.126.net/Ac3LYebUIET9ghN0OZpIPw==/109951167849266151.jpg',
    lyricsFile: '/music/小城夏天.lrc'
  },
  {
    name: '泡沫',
    artist: 'G.E.M.邓紫棋',
    url: new URL('/music/泡沫.mp3', import.meta.url).href,
    cover: 'https://p2.music.126.net/0Rm9y81tpJlFFGjjPfkP3A==/2437617278839346.jpg',
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
export type PlayMode = 'sequential' | 'single' | 'shuffle'

export function useMusic() {
  const isPlaying = ref(false)
  const currentTrack = ref('')
  const currentArtist = ref('')
  const currentCover = ref('')
  const currentLyrics = ref<string[]>([])
  const playMode = ref<PlayMode>('sequential')
  const volume = ref(1)
  const isMuted = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
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
    
    // 监听播放结束，根据播放模式处理
    audioElement.addEventListener('ended', () => {
      console.log('当前歌曲播放完毕')
      if (playMode.value === 'single') {
        audioElement!.currentTime = 0
        audioElement!.play().catch(err => console.error('单曲循环播放失败:', err))
      } else {
        playNext()
      }
    })
    
    audioElement.addEventListener('volumechange', () => {
      if (audioElement) {
        volume.value = audioElement.volume
        isMuted.value = audioElement.muted
        localStorage.setItem('musicVolume', audioElement.volume.toString())
        localStorage.setItem('musicMuted', audioElement.muted.toString())
      }
    })

    // 监听播放错误
    audioElement.addEventListener('error', (e) => {
      console.error('音频播放错误:', e)
      playNext()
    })

    // 监听播放进度更新
    audioElement.addEventListener('timeupdate', () => {
      if (audioElement) {
        currentTime.value = audioElement.currentTime
        duration.value = audioElement.duration || 0
      }
    })

    // 监听元数据加载完成
    audioElement.addEventListener('loadedmetadata', () => {
      if (audioElement) {
        duration.value = audioElement.duration
      }
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
    let nextIndex: number
    if (playMode.value === 'shuffle') {
      if (musicFiles.length <= 1) {
        nextIndex = 0
      } else {
        do {
          nextIndex = Math.floor(Math.random() * musicFiles.length)
        } while (nextIndex === currentTrackIndex)
      }
    } else {
      nextIndex = (currentTrackIndex + 1) % musicFiles.length
    }
    await loadTrack(nextIndex)

    if (audioElement) {
      isPlaying.value = true
      localStorage.setItem('musicPlaying', 'true')
      audioElement.play().catch(err => {
        console.error('自动播放失败:', err)
        isPlaying.value = false
        localStorage.setItem('musicPlaying', 'false')
      })
    }
  }

  // 播放上一首
  const playPrev = async () => {
    const prevIndex = (currentTrackIndex - 1 + musicFiles.length) % musicFiles.length
    await loadTrack(prevIndex)

    if (audioElement) {
      isPlaying.value = true
      localStorage.setItem('musicPlaying', 'true')
      audioElement.play().catch(err => {
        console.error('自动播放失败:', err)
        isPlaying.value = false
        localStorage.setItem('musicPlaying', 'false')
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

  const toggleMute = () => {
    if (!audioElement) return
    audioElement.muted = !audioElement.muted
    isMuted.value = audioElement.muted
    localStorage.setItem('musicMuted', audioElement.muted.toString())
  }

  const setVolume = (v: number) => {
    if (!audioElement) return
    const clamped = Math.max(0, Math.min(1, v))
    audioElement.volume = clamped
    volume.value = clamped
    if (clamped > 0 && audioElement.muted) {
      audioElement.muted = false
      isMuted.value = false
    }
    localStorage.setItem('musicVolume', clamped.toString())
    localStorage.setItem('musicMuted', audioElement.muted.toString())
  }

  // 切换播放模式：顺序 → 单曲 → 随机 → 顺序
  const togglePlayMode = () => {
    const modes: PlayMode[] = ['sequential', 'single', 'shuffle']
    const currentIndex = modes.indexOf(playMode.value)
    playMode.value = modes[(currentIndex + 1) % modes.length]
    localStorage.setItem('playMode', playMode.value)
    console.log('播放模式:', playMode.value)
  }

  // 初始化音乐状态
  onMounted(() => {
    const savedMusic = localStorage.getItem('musicPlaying')
    if (savedMusic !== null) {
      isPlaying.value = savedMusic === 'true'
    }

    const savedPlayMode = localStorage.getItem('playMode') as PlayMode | null
    if (savedPlayMode && ['sequential', 'single', 'shuffle'].includes(savedPlayMode)) {
      playMode.value = savedPlayMode
    }

    const savedVolume = localStorage.getItem('musicVolume')
    if (savedVolume !== null) {
      const v = parseFloat(savedVolume)
      if (!isNaN(v) && v >= 0 && v <= 1) {
        volume.value = v
      }
    }

    const savedMuted = localStorage.getItem('musicMuted')
    if (savedMuted !== null) {
      isMuted.value = savedMuted === 'true'
    }

    initAudio()

    if (audioElement) {
      audioElement.volume = volume.value
      audioElement.muted = isMuted.value
      
      // 如果之前是播放状态，刷新后自动恢复播放
      if (isPlaying.value) {
        audioElement.play().catch(err => {
          console.error('刷新后自动播放失败:', err)
          isPlaying.value = false
          localStorage.setItem('musicPlaying', 'false')
        })
      }
    }

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

  // 跳转到指定时间
  const seekTo = (time: number) => {
    if (!audioElement) return
    audioElement.currentTime = Math.max(0, Math.min(time, duration.value || 0))
  }

  return {
    isPlaying,
    currentTrack,
    currentArtist,
    currentCover,
    currentLyrics,
    playMode,
    volume,
    isMuted,
    currentTime,
    duration,
    toggleMusic,
    togglePlayMode,
    toggleMute,
    setVolume,
    playNext,
    playPrev,
    seekTo
  }
}