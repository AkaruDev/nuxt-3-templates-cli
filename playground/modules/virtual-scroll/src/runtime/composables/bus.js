
import { useEventBus } from '@vueuse/core'

export const useBus = () => {
  const bus = useEventBus('virtual-scroll')

  const callbacks = {}
  const onEmit = (event, payload) => {
    callbacks?.[event]?.forEach(callback => callback?.(payload))
  }
  bus.on(onEmit)

  /**
   * Add event callback from diffusion list
   * @param {String} event
   * @param {Function} callback
   */
  const on = (event, callback) => {
    callbacks[event] = callbacks[event] || []
    if (!callbacks[event].includes(callback)) {
      callbacks[event].push(callback)
    }
  }

  /**
   * Remove event callback from diffusion list
   * @param {String} event
   * @param {Function} callback
   */
  const off = (event, callback) => {
    if (callbacks?.[event]?.includes(callback)) {
      callbacks[event] = callbacks[event].filter(entry => entry !== callback)
    }
  }

  return { bus, on, off }
}
