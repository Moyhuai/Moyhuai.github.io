<template>
  <div class="desktop-pet-container" :class="{ 'sidebar-open': sidebarOpen }">
    <!-- 宠物主体 -->
    <div
      class="pet-character"
      :class="{
        'performing-action': isPerformingAction,
        'is-clicked': isClicked
      }"
      @click="handlePetPet"
      @dblclick="playWithPet"
    >
      <!-- 当前动作图片 -->
      <img
        v-if="currentActionImage"
        :src="currentActionImage"
        alt="Pet Action"
        class="pet-action-image"
      />

      <!-- 默认宠物图片 -->
      <img
        v-if="!currentActionImage"
        :src="currentImage"
        alt="XiaoHei"
        class="pet-image"
      />

      <!-- 心情增加动画 -->
      <transition name="float-up">
        <div v-if="showEmotionIncrease" class="emotion-increase">
          <img src="/ixiaohei/emotion increasing animation.png" alt="Happy" />
        </div>
      </transition>
    </div>

    <!-- 状态显示 -->
    <div class="pet-status" :class="{ 'status-hidden': !showStatus }">
      <div class="status-item">
        <span class="status-label">心情</span>
        <div class="status-bar">
          <div
            class="status-fill emotion"
            :style="{ width: `${petState.emotion}%` }"
          ></div>
        </div>
        <span class="status-value">{{ petState.emotion }}</span>
      </div>

      <div class="status-item">
        <span class="status-label">体力</span>
        <div class="status-bar">
          <div
            class="status-fill stamina"
            :style="{ width: `${petState.stamina}%` }"
          ></div>
        </div>
        <span class="status-value">{{ petState.stamina }}</span>
      </div>

      <div class="status-item">
        <span class="status-label">清洁</span>
        <div class="status-bar">
          <div
            class="status-fill cleanliness"
            :style="{ width: `${petState.cleanliness}%` }"
          ></div>
        </div>
        <span class="status-value">{{ petState.cleanliness }}</span>
      </div>
    </div>

    <!-- 交互按钮 -->
    <div class="pet-controls" :class="{ 'controls-hidden': !showControls }">
      <button
        class="control-btn"
        @click="toggleStatus"
        title="显示/隐藏状态"
      >
        📊
      </button>
      <button
        class="control-btn"
        @click="toggleControls"
        title="显示/隐藏控制"
      >
        ⚙️
      </button>
    </div>

    <!-- 物品菜单 -->
    <div v-if="showControls" class="items-menu">
      <div class="menu-section">
        <h3>食物</h3>
        <div class="items-grid">
          <button
            v-for="food in foodItems"
            :key="food.id"
            class="item-btn"
            :disabled="foodInventory[food.id] <= 0"
            @click="handleFeedPet(food.id)"
          >
            <img :src="food.image" :alt="food.name" />
            <span>{{ food.name }}</span>
            <span class="item-count">{{ foodInventory[food.id] }}</span>
          </button>
        </div>
      </div>

      <div class="menu-section">
        <h3>洗澡用品</h3>
        <div class="items-grid">
          <button
            v-for="bath in bathItems"
            :key="bath.id"
            class="item-btn"
            :disabled="bathInventory[bath.id] <= 0"
            @click="handleBathPet(bath.id)"
          >
            <img :src="bath.image" :alt="bath.name" />
            <span>{{ bath.name }}</span>
            <span class="item-count">{{ bathInventory[bath.id] }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 提示信息 -->
    <transition name="fade">
      <div v-if="showTip" class="pet-tip">
        {{ tipMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useDesktopPet } from '../composables/useDesktopPet'

const props = defineProps<{
  sidebarOpen?: boolean
}>()

const sidebarOpen = ref(props.sidebarOpen ?? false)

watch(() => props.sidebarOpen, (newVal) => {
  sidebarOpen.value = newVal ?? false
})

const {
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
  feedPet,
  bathPet,
  petPet,
  playWithPet,
  startDecay
} = useDesktopPet()

const showStatus = ref(false)
const showControls = ref(false)
const showEmotionIncrease = ref(false)
const showTip = ref(false)
const tipMessage = ref('')
const isClicked = ref(false)

const toggleStatus = () => {
  showStatus.value = !showStatus.value
}

const toggleControls = () => {
  showControls.value = !showControls.value
}

const showTipMessage = (message: string) => {
  tipMessage.value = message
  showTip.value = true
  setTimeout(() => {
    showTip.value = false
  }, 2000)
}

// 重写petPet方法以显示提示
const handlePetPet = () => {
  isClicked.value = true
  petPet()
  showEmotionIncrease.value = true
  setTimeout(() => {
    showEmotionIncrease.value = false
    isClicked.value = false
  }, 1000)
  showTipMessage('摸摸小黑~')
}

// 重写feedPet方法以显示提示
const handleFeedPet = (foodId: string) => {
  const success = feedPet(foodId)
  if (success) {
    const food = foodItems.find(f => f.id === foodId)
    showTipMessage(`喂了${food?.name}！`)
  } else {
    showTipMessage('没有食物了！')
  }
}

// 重写bathPet方法以显示提示
const handleBathPet = (bathId: string) => {
  const success = bathPet(bathId)
  if (success) {
    const bath = bathItems.find(b => b.id === bathId)
    showTipMessage(`给小黑洗澡！`)
  } else {
    showTipMessage('没有洗澡用品了！')
  }
}

onMounted(() => {
  startDecay()
})
</script>

<style scoped>
.desktop-pet-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  transition: all 0.3s ease;
}

@media (min-width: 769px) {
  .desktop-pet-container.sidebar-open {
    right: auto;
    left: 20px;
    align-items: flex-start;
  }
}

.pet-character {
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;
  transition: transform 0.3s ease;
  transform-origin: center center;
}

.pet-character:hover {
  transform: scale(1.05);
}

.pet-character.performing-action {
  transform: scale(1.1);
}

.pet-character.is-clicked {
  animation: click-bounce 0.5s ease-out;
}

@keyframes click-bounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

.pet-image,
.pet-action-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.emotion-increase {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
}

.emotion-increase img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.pet-status {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-width: 200px;
}

.pet-status.status-hidden {
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-label {
  font-size: 12px;
  color: #666;
  min-width: 40px;
}

.status-bar {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.status-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 4px;
}

.status-fill.emotion {
  background: linear-gradient(90deg, #ff6b6b, #ffd93d);
}

.status-fill.stamina {
  background: linear-gradient(90deg, #4ecdc4, #44a08d);
}

.status-fill.cleanliness {
  background: linear-gradient(90deg, #a8e6cf, #88d8b0);
}

.status-value {
  font-size: 12px;
  font-weight: 600;
  min-width: 30px;
  text-align: right;
}

.pet-controls {
  display: flex;
  gap: 8px;
  transition: all 0.3s ease;
}

.pet-controls.controls-hidden {
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s ease;
}

.control-btn:hover {
  transform: scale(1.1);
  background: white;
}

.items-menu {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 280px;
}

.menu-section {
  margin-bottom: 16px;
}

.menu-section:last-child {
  margin-bottom: 0;
}

.menu-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}

.item-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.item-btn:hover:not(:disabled) {
  border-color: #4ecdc4;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.2);
}

.item-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-btn img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.item-btn span {
  font-size: 12px;
  color: #333;
}

.item-count {
  font-size: 10px;
  color: #666;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
}

.pet-tip {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 1001;
}

/* 动画 */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes idle {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-3px) rotate(-1deg);
  }
  75% {
    transform: translateY(-3px) rotate(1deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.float-up-enter-active {
  transition: all 0.5s ease;
}

.float-up-leave-active {
  transition: all 0.3s ease;
}

.float-up-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.float-up-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

/* 响应式 */
@media (max-width: 768px) {
  .desktop-pet-container {
    bottom: 10px;
    right: 10px;
  }

  .pet-character {
    width: 80px;
    height: 80px;
  }

  .pet-status {
    min-width: 160px;
    padding: 10px 12px;
  }

  .items-menu {
    min-width: 240px;
    padding: 12px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .pet-status,
  .control-btn,
  .items-menu {
    background: rgba(30, 30, 30, 0.9);
    color: white;
  }

  .status-label {
    color: #aaa;
  }

  .status-bar {
    background: #444;
  }

  .item-btn {
    background: #333;
    border-color: #555;
  }

  .item-btn span {
    color: white;
  }

  .item-count {
    background: #444;
    color: #aaa;
  }
}
</style>