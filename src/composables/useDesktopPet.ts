import { ref, computed } from 'vue'

export interface PetState {
  emotion: number
  stamina: number
  cleanliness: number
}

export interface FoodItem {
  id: string
  name: string
  image: string
  buff: number
  actionImage: string
}

export interface BathItem {
  id: string
  name: string
  image: string
  buff: number
  actionImage: string
}

const MAX_VALUE = 100
const MIN_VALUE = 0

export function useDesktopPet() {
  // 自动播放的动画列表
  const autoPlayAnimations = [
    '/ixiaohei/shake-head-txt.gif',
    '/ixiaohei/playing guitar.gif',
    '/ixiaohei/play heixiu.gif',
    '/ixiaohei/licking the claw.gif',
    '/ixiaohei/eat-watermelon-txt.gif',
    '/ixiaohei/eat drumstick.gif',
    '/ixiaohei/bye.gif'
  ]

  // 宠物状态
  const petState = ref<PetState>({
    emotion: 60,
    stamina: 60,
    cleanliness: 60
  })

  // 当前显示的图片
  const currentImage = ref('/ixiaohei/icon.png')
  const currentActionImage = ref('')
  const isPerformingAction = ref(false)

  // 食物库存
  const foodInventory = ref<Record<string, number>>({
    'FOOD_001': 10,
    'FOOD_002': 10
  })

  // 洗澡用品库存
  const bathInventory = ref<Record<string, number>>({
    'BATH_001': 10
  })

  // 物品定义
  const foodItems: FoodItem[] = [
    {
      id: 'FOOD_001',
      name: '鸡蛋',
      image: '/ixiaohei/foods/egg.png',
      buff: 10,
      actionImage: '/ixiaohei/eat drumstick.gif'
    },
    {
      id: 'FOOD_002',
      name: '牛奶',
      image: '/ixiaohei/foods/milk.png',
      buff: 5,
      actionImage: '/ixiaohei/eat drumstick.gif'
    }
  ]

  const bathItems: BathItem[] = [
    {
      id: 'BATH_001',
      name: '肥皂',
      image: '/ixiaohei/bath/soap.png',
      buff: 10,
      actionImage: '/ixiaohei/bath/soap.png'
    }
  ]

  // 计算属性
  const emotionLevel = computed(() => {
    const value = petState.value.emotion
    if (value >= 80) return 'happy'
    if (value >= 60) return 'normal'
    if (value >= 40) return 'sad'
    return 'depressed'
  })

  const staminaLevel = computed(() => {
    const value = petState.value.stamina
    if (value >= 80) return 'energetic'
    if (value >= 60) return 'normal'
    if (value >= 40) return 'tired'
    return 'exhausted'
  })

  const cleanlinessLevel = computed(() => {
    const value = petState.value.cleanliness
    if (value >= 80) return 'clean'
    if (value >= 60) return 'normal'
    if (value >= 40) return 'dirty'
    return 'filthy'
  })

  // 方法
  const updateEmotion = (delta: number) => {
    petState.value.emotion = Math.max(MIN_VALUE, Math.min(MAX_VALUE, petState.value.emotion + delta))
  }

  const updateStamina = (delta: number) => {
    petState.value.stamina = Math.max(MIN_VALUE, Math.min(MAX_VALUE, petState.value.stamina + delta))
  }

  const updateCleanliness = (delta: number) => {
    petState.value.cleanliness = Math.max(MIN_VALUE, Math.min(MAX_VALUE, petState.value.cleanliness + delta))
  }

  const performAction = (actionImage: string, duration: number) => {
    if (isPerformingAction.value) return

    isPerformingAction.value = true
    currentActionImage.value = actionImage

    setTimeout(() => {
      currentActionImage.value = ''
      isPerformingAction.value = false
    }, duration)
  }

  const feedPet = (foodId: string) => {
    const food = foodItems.find(f => f.id === foodId)
    if (!food || foodInventory.value[foodId] <= 0) return false

    performAction(food.actionImage, 2000)

    updateStamina(food.buff)
    updateEmotion(5)
    foodInventory.value[foodId]--

    return true
  }

  const bathPet = (bathId: string) => {
    const bath = bathItems.find(b => b.id === bathId)
    if (!bath || bathInventory.value[bathId] <= 0) return false

    performAction(bath.actionImage, 2000)

    updateCleanliness(bath.buff)
    updateEmotion(5)
    bathInventory.value[bathId]--

    return true
  }

  const petPet = () => {
    if (isPerformingAction.value) return

    performAction('/ixiaohei/licking the claw.gif', 1500)
    updateEmotion(10)
  }

  const playWithPet = () => {
    if (isPerformingAction.value) return

    performAction('/ixiaohei/play heixiu.gif', 2000)
    updateEmotion(15)
    updateStamina(-5)
  }

  const playRandomAnimation = () => {
    if (isPerformingAction.value) return

    // 从本地存储获取已播放的动画列表
    let playedAnimations: string[] = []
    try {
      const stored = localStorage.getItem('playedAnimations')
      if (stored) {
        playedAnimations = JSON.parse(stored)
        // 验证数据格式
        if (!Array.isArray(playedAnimations)) {
          playedAnimations = []
        }
      }
    } catch (e) {
      playedAnimations = []
    }
    
    // 过滤出未播放过的动画
    const unplayedAnimations = autoPlayAnimations.filter(anim => !playedAnimations.includes(anim))
    
    let randomAnimation: string
    
    if (unplayedAnimations.length > 0) {
      // 如果有未播放的动画，随机选择一个
      const randomIndex = Math.floor(Math.random() * unplayedAnimations.length)
      randomAnimation = unplayedAnimations[randomIndex]
      
      // 记录到本地存储
      const newPlayedAnimations = [...playedAnimations, randomAnimation]
      localStorage.setItem('playedAnimations', JSON.stringify(newPlayedAnimations))
    } else {
      // 如果所有动画都播放过了，重置并随机选择一个
      localStorage.removeItem('playedAnimations')
      const randomIndex = Math.floor(Math.random() * autoPlayAnimations.length)
      randomAnimation = autoPlayAnimations[randomIndex]
      localStorage.setItem('playedAnimations', JSON.stringify([randomAnimation]))
    }
    
    performAction(randomAnimation, 2000)
  }

  const startDecay = () => {
    setInterval(() => {
      updateEmotion(-1)
      updateStamina(-1)
      updateCleanliness(-0.5)
    }, 30000)

    setInterval(() => {
      playRandomAnimation()
    }, 3000)
  }

  return {
    petState,
    currentImage,
    currentActionImage,
    isPerformingAction,
    foodInventory,
    bathInventory,
    foodItems,
    bathItems,
    emotionLevel,
    staminaLevel,
    cleanlinessLevel,
    updateEmotion,
    updateStamina,
    updateCleanliness,
    feedPet,
    bathPet,
    performAction,
    petPet,
    playWithPet,
    startDecay
  }
}
