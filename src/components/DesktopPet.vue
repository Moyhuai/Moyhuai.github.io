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
  petPet,
  playWithPet,
  startDecay
} = useDesktopPet()

const showEmotionIncrease = ref(false)
const showTip = ref(false)
const tipMessage = ref('')
const isClicked = ref(false)

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





.pet-tip {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-bg-overlay);
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
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
}
</style>