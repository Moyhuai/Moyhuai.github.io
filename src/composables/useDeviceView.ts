import { ref, computed, onMounted } from 'vue'
import type { DeviceView } from '../types'

/**
 * 设备视图管理 Composable
 * @returns deviceView - 当前视图模式
 * @returns setDeviceView - 设置视图模式函数
 * @returns containerClass - 容器宽度类名
 */
export function useDeviceView() {
  const deviceView = ref<DeviceView>('auto')

  // 计算容器样式类
  const containerClass = computed(() => {
    if (deviceView.value === 'mobile') {
      return 'max-w-md'
    } else if (deviceView.value === 'desktop') {
      return 'max-w-6xl'
    }
    return 'max-w-3xl'
  })

  // 初始化设备视图状态
  onMounted(() => {
    // 从 localStorage 恢复设备视图设置
    const savedDeviceView = localStorage.getItem('deviceView')
    if (savedDeviceView && ['auto', 'mobile', 'desktop'].includes(savedDeviceView)) {
      deviceView.value = savedDeviceView as DeviceView
    }
  })

  // 设置设备视图
  const setDeviceView = (view: DeviceView) => {
    deviceView.value = view
    localStorage.setItem('deviceView', view)
  }

  return {
    deviceView,
    setDeviceView,
    containerClass
  }
}
