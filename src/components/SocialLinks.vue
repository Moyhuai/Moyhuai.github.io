<script setup lang="ts">
import { ref } from 'vue'
import type { SocialLink } from '../types'

defineProps<{
  links: SocialLink[]
}>()

// 微信弹窗控制
const showWeChatModal = ref(false)

const openWeChatModal = () => {
  showWeChatModal.value = true
}

const closeWeChatModal = () => {
  showWeChatModal.value = false
}
</script>

<template>
  <!-- 社交链接 -->
  <div class="flex justify-center gap-3 mb-10 flex-wrap  h-screen w-full ">
    
    <a
      v-for="link in links"
      :key="link.name"
      :href="link.url"
      :target="link.name === 'WeChat' ? undefined : '_blank'"
      :rel="link.name === 'WeChat' ? undefined : 'noopener noreferrer'"
      @click.prevent="link.name === 'WeChat' ? openWeChatModal() : undefined"
      class="group relative flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden cursor-pointer"
    >
      <!-- 悬停背景 -->
      <div 
        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        :class="link.color"
      ></div>
      
      <!-- GitHub 图标 -->
      <svg v-if="link.name === 'GitHub'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height="24" width="24">
        <!-- Font Awesome Free v7.2.0 by @fontawesome -->
        <path d="M237.9 461.4C237.9 463.4 235.6 465 232.7 465C229.4 465.3 227.1 463.7 227.1 461.4C227.1 459.4 229.4 457.8 232.3 457.8C235.3 457.5 237.9 459.1 237.9 461.4zM206.8 456.9C206.1 458.9 208.1 461.2 211.1 461.8C213.7 462.8 216.7 461.8 217.3 459.8C217.9 457.8 216 455.5 213 454.6C210.4 453.9 207.5 454.9 206.8 456.9zM251 455.2C248.1 455.9 246.1 457.8 246.4 460.1C246.7 462.1 249.3 463.4 252.3 462.7C255.2 462 257.2 460.1 256.9 458.1C256.6 456.2 253.9 454.9 251 455.2zM316.8 72C178.1 72 72 177.3 72 316C72 426.9 141.8 521.8 241.5 555.2C254.3 557.5 258.8 549.6 258.8 543.1C258.8 536.9 258.5 502.7 258.5 481.7C258.5 481.7 188.5 496.7 173.8 451.9C173.8 451.9 162.4 422.8 146 415.3C146 415.3 123.1 399.6 147.6 399.9C147.6 399.9 172.5 401.9 186.2 425.7C208.1 464.3 244.8 453.2 259.1 446.6C261.4 430.6 267.9 419.5 275.1 412.9C219.2 406.7 162.8 398.6 162.8 302.4C162.8 274.9 170.4 261.1 186.4 243.5C183.8 237 175.3 210.2 189 175.6C209.9 169.1 258 202.6 258 202.6C278 197 299.5 194.1 320.8 194.1C342.1 194.1 363.6 197 383.6 202.6C383.6 202.6 431.7 169 452.6 175.6C466.3 210.3 457.8 237 455.2 243.5C471.2 261.2 481 275 481 302.4C481 398.9 422.1 406.6 366.2 412.9C375.4 420.8 383.2 435.8 383.2 459.3C383.2 493 382.9 534.7 382.9 542.9C382.9 549.4 387.5 557.3 400.2 555C500.2 521.8 568 426.9 568 316C568 177.3 455.5 72 316.8 72zM169.2 416.9C167.9 417.9 168.2 420.2 169.9 422.1C171.5 423.7 173.8 424.4 175.1 423.1C176.4 422.1 176.1 419.8 174.4 417.9C172.8 416.3 170.5 415.6 169.2 416.9zM158.4 408.8C157.7 410.1 158.7 411.7 160.7 412.7C162.3 413.7 164.3 413.4 165 412C165.7 410.7 164.7 409.1 162.7 408.1C160.7 407.5 159.1 407.8 158.4 408.8zM190.8 444.4C189.2 445.7 189.8 448.7 192.1 450.6C194.4 452.9 197.3 453.2 198.6 451.6C199.9 450.3 199.3 447.3 197.3 445.4C195.1 443.1 192.1 442.8 190.8 444.4zM179.4 429.7C177.8 430.7 177.8 433.3 179.4 435.6C181 437.9 183.7 438.9 185 437.9C186.6 436.6 186.6 434 185 431.7C183.6 429.4 181 428.4 179.4 429.7z"/>
      </svg>
      
      <!-- Bilibili 图标 -->
      <svg v-else-if="link.name === 'Bilibili'" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 640 640">
        <!-- Font Awesome Free v7.2.0 by @fontawesome -->
        <path fill="rgb(255, 59, 59)" d="M552.6 168.1C569.3 186.2 577 207.8 575.9 233.8L575.9 436.2C575.5 462.6 566.7 484.3 549.4 501.3C532.2 518.3 510.3 527.2 483.9 528L156 528C129.6 527.2 107.8 518.2 90.7 500.8C73.6 483.4 64.7 460.5 64 432.2L64 233.8C64.8 207.8 73.7 186.2 90.7 168.1C107.8 151.8 129.5 142.8 156 142L185.4 142L160 116.2C154.3 110.5 151.4 103.2 151.4 94.4C151.4 85.6 154.3 78.3 160 72.6C165.7 66.9 173 64 181.9 64C190.8 64 198 66.9 203.8 72.6L277.1 142L365.1 142L439.6 72.6C445.7 66.9 453.2 64 462 64C470.8 64 478.1 66.9 483.9 72.6C489.6 78.3 492.5 85.6 492.5 94.4C492.5 103.2 489.6 110.5 483.9 116.2L458.6 142L487.9 142C514.3 142.8 535.9 151.8 552.6 168.1zM513.8 237.8C513.4 228.2 510.1 220.4 503.1 214.3C497.9 208.2 489.1 204.9 480.4 204.5L160 204.5C150.4 204.9 142.6 208.2 136.4 214.3C130.3 220.4 127 228.2 126.6 237.8L126.6 432.2C126.6 441.4 129.9 449.2 136.4 455.7C142.9 462.2 150.8 465.5 160 465.5L480.4 465.5C489.6 465.5 497.4 462.2 503.7 455.7C510 449.2 513.4 441.4 513.8 432.2L513.8 237.8zM249.5 280.5C255.8 286.8 259.2 294.6 259.6 303.7L259.6 337C259.2 346.2 255.9 353.9 249.8 360.2C243.6 366.5 235.8 369.7 226.2 369.7C216.6 369.7 208.7 366.5 202.6 360.2C196.5 353.9 193.2 346.2 192.8 337L192.8 303.7C193.2 294.6 196.6 286.8 202.9 280.5C209.2 274.2 216.1 270.9 226.2 270.5C235.4 270.9 243.2 274.2 249.5 280.5zM441 280.5C447.3 286.8 450.7 294.6 451.1 303.7L451.1 337C450.7 346.2 447.4 353.9 441.3 360.2C435.2 366.5 427.3 369.7 417.7 369.7C408.1 369.7 400.3 366.5 394.1 360.2C387.1 353.9 384.7 346.2 384.4 337L384.4 303.7C384.7 294.6 388.1 286.8 394.4 280.5C400.7 274.2 408.5 270.9 417.7 270.5C426.9 270.9 434.7 274.2 441 280.5Z"/>
      </svg>
      
      <!-- QQ 图标 -->
      <svg v-else-if="link.name === 'QQ'" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 640 640">
        <!-- Font Awesome Free v7.2.0 by @fontawesome -->
        <path fill="rgb(116, 192, 252)" d="M530.1 484.4C518.6 485.8 485.2 431.7 485.2 431.7 485.2 463 469.1 503.9 434.2 533.5C451 538.7 489 552.7 480 567.9C472.7 580.2 354.5 575.8 320.4 571.9C286.3 575.7 168.1 580.2 160.8 567.9C151.8 552.7 189.7 538.7 206.6 533.5C171.7 504 155.5 463.1 155.5 431.7C155.5 431.7 122.2 485.8 110.6 484.4C105.2 483.8 98.2 454.8 119.9 384.7C130.2 351.7 141.9 324.2 160 278.9C156.9 162 205.2 63.9 320.3 63.9C434 63.9 483.5 160 480.6 278.9C498.7 324.1 510.5 351.8 520.7 384.7C542.5 454.8 535.4 483.8 530 484.4z"/>
      </svg>
      
      <!-- 微信图标 -->
      <svg v-else-if="link.name === 'WeChat'" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 512 512">
        <!-- 上方气泡 -->
        <ellipse cx="200" cy="180" rx="140" ry="130" fill="#98D8AA" stroke="#1A1A1A" stroke-width="6"/>
        <!-- 上方气泡眼睛 -->
        <circle cx="155" cy="170" r="20" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="4"/>
        <circle cx="245" cy="170" r="20" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="4"/>
        <circle cx="155" cy="170" r="8" fill="#1A1A1A"/>
        <circle cx="245" cy="170" r="8" fill="#1A1A1A"/>
        <!-- 上方气泡尾巴 -->
        <path d="M260 290 L290 320 L270 300" fill="none" stroke="#1A1A1A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- 下方气泡 -->
        <ellipse cx="360" cy="330" rx="130" ry="120" fill="#C9F0A8" stroke="#1A1A1A" stroke-width="6"/>
        <!-- 下方气泡眼睛 -->
        <circle cx="315" cy="320" r="18" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="4"/>
        <circle cx="400" cy="320" r="18" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="4"/>
        <circle cx="315" cy="320" r="7" fill="#1A1A1A"/>
        <circle cx="400" cy="320" r="7" fill="#1A1A1A"/>
        <!-- 下方气泡尾巴 -->
        <path d="M250 380 L220 410 L240 395" fill="none" stroke="#1A1A1A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  </div>

  <!-- 微信二维码弹窗 -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showWeChatModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click="closeWeChatModal"
      >
        <div
          class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full transform transition-all"
          @click.stop
        >
          <!-- 关闭按钮 -->
          <button
            @click="closeWeChatModal"
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- 标题 -->
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
            扫码添加微信好友
          </h3>

          <!-- 二维码图片 -->
          <div class="flex justify-center">
            <img
              src="/Wechat.jpg"
              alt="微信二维码"
              class="w-64 h-64 object-contain rounded-lg shadow-lg"
            />
          </div>

          <!-- 提示文字 -->
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
            使用微信扫码添加好友
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 弹窗动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>