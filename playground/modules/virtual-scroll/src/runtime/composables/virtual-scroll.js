import { ref } from 'vue'
import { useRafFn, useResizeObserver } from '@vueuse/core'
import VirtualScroll from 'virtual-scroll'
import { clamp, lerp } from '../utils/math'
import { useBus } from './bus'

export const useVirtualScroll = (() => {

  // Variables
  /**
   * @type {Element}
   */
  let container = null
  let target = 0
  let current = 0
  /**
   * @type {RefImpl<Number>}
   */
  let bounds = ref(0)
  let virtualScroll = null
  let ratio = 0.1
  let precision = 0

  /**
   * @type {RefImpl<Boolean>}
   */
  const active = ref(true)
  /**
   * @type {RefImpl<Boolean>}
   */
  const isLocked = ref(false)
  let resizeObserver = null

  // Set bus
  const { bus, on, off } = useBus()

  /**
   * Start/se the virtual scroll
   * @param {Element} el
   */
  const start = (el) => {
    container = el
    // Check if pointer is a mouse
    active.value = window.matchMedia("(pointer:fine)").matches
    if (active.value) {
      setBounds()

      virtualScroll = new VirtualScroll({
        mouseMultiplier: navigator.platform.includes('Win') ? 1 : 0.4,
        touchMultiplier: 2,
        firefoxMultiplier: 50,
        useKeyboard: false,
        passive: true
      })

      virtualScroll.on(virtualScrollCallback)

      Object.assign(document.body.style, {
        position: 'fixed',
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      })

      // Resize
      resizeObserver = useResizeObserver(container, onResize)
      onResize()

      // Key events
      window.addEventListener('keydown', onKeyDown, {
        capture: false,
        passive: true
      })
    }

    useRafFn(onTick)
  }

  /**
   * Get the float precision for the scroll value
   * @returns
   */
  const getPrecision = () => {
    return precision
  }
  /**
   * Set the precision for the scroll value
   * @param {Integer} value
   */
  const setPrecision = (value) => {
    precision = 1 / Math.pow(10, value)
  }

  /**
   * Set ratio for scroll lerp
   * @param {Number} value
   */
  const setRatio = (value) => {
    ratio = value
  }

  const onTick = () => {
    if (active.value) {
      current = lerp(current, target, ratio, precision)
    } else {
      current = window.scrollY
      target = window.scrollY
    }

    // eslint-disable-next-line no-unused-vars
    const values = {
      current: current.toFixed(precision),
      target
    }

    bus.emit('scroll', values)
  }

  const virtualScrollCallback = (e) => {
    if (e.originalEvent.target.closest('.no-vs-scroll')) return

    if (isLocked.value) return


    scrollOf(e.deltaY * -1)
  }

  const scrollOf = (value = 0, force = false) => {
    if (isLocked.value && !force) return

    target = clamp(target + value, 0, bounds.value)
  }

  /**
   *
   * @param {Number} yValue
   * @param {Boolean} force bypass isLock
   * @returns
   */
  const scrollTo = (yValue, force = false) => {
    if (isLocked.value && !force) return

    if (!active.value) {
      window.scrollTo(0, yValue, {
        behavior: 'smooth'
      })
    } else {
      scrollOf(yValue - target)
    }
  }

  const onResize = () => {
    setBounds()
  }

  const setBounds = () => {
    if (!active.value || !container) return

    bounds.value = container.clientHeight - window.innerHeight

    scrollOf(0, true)
  }

  /**
   * Go to scroll y value
   * @param {Number} yValue
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const goTo = (yValue, force = false) => {
    if (isLocked.value && !force) return

    if (!active.value) {
      window.scrollTo(0, yValue)
    } else {
      target = yValue
      current = yValue
    }
  }

  /**
   * Scroll of one viewport/window height
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const scrollOfOneViewport = (force = false) => {
    if (isLocked.value && !force) return

    scrollTo(target + window.innerHeight)
  }

  /**
   * Scroll to top
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const scrollToTop = (force = false) => {
    if (isLocked.value && !force) return

    scrollTo(0, force)
  }

  /**
   *  Go to top
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const goToTop = (force = false) => {
    if (isLocked.value && !force) return

    goTo(0, force)
  }

  /**
   * Scroll to bottom
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const scrollToBottom = (force = false) => {
    if (isLocked.value && !force) return

    scrollTo(bounds.value, force)
  }


  /**
   * Go to bottom
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const goToBottom = (force = false) => {
    if (isLocked.value && !force) return

    goTo(bounds.value, force)
  }

  /**
   * Scroll to element top
   * @param {Element} element
   * @param {Number} offset
   * @param {Boolean} force bypass isLocked
   * @returns
   */
  const scrollToElement = (element = null, offset = 0, force = false) => {
    if (isLocked.value && !force) return
    if (!element || !element.getboundsClientRect) return

    scrollTo(current + element.getboundsClientRect().top + offset, force)
  }

  const destroy = () => {
    virtualScroll?.destroy()
    resizeObserver?.disconnect()
    window.removeEventListener('keydown', this.onKeyDown)
  }

  /**
   * Lock current scroll position
   */
  const lock = () => {
    isLocked.value = true

    if (!active.value) {
      document.body.style.overflow = 'hidden'
    }
  }

  /**
   * Unlock current scroll position
   */
  const unlock = () => {
    isLocked.value = false

    if (!active.value) {
      document.body.style.overflow = 'auto'
    }
  }

  // Keys events
  const keyCodes = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    TAB: 9,
    PAGEUP: 33,
    PAGEDOWN: 34,
    HOME: 36,
    END: 35
  }

  const onKeyDown = (e) => {
    if (isLocked.value) return

    const hasFocusOnInput = document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement

    switch (e.keyCode) {
      case keyCodes.TAB:
        window.setTimeout(() => {
          scrollToElement(document.activeElement, -window.innerHeight / 2, true)
        }, 0)
        break
      case keyCodes.UP:
        if (hasFocusOnInput) return
        scrollOf(-240, true)
        break
      case keyCodes.DOWN:
        if (hasFocusOnInput) return
        scrollOf(240, true)
        break
      case keyCodes.PAGEUP:
        scrollOf(-window.innerHeight, true)
        break
      case keyCodes.PAGEDOWN:
        scrollOf(window.innerHeight, true)
        break
      case keyCodes.HOME:
        scrollToTop(true)
        break
      case keyCodes.END:
        scrollToBottom(true)
        break
      case keyCodes.SPACE:
        if (hasFocusOnInput) return
        if (e.shiftKey) {
          scrollOf(-window.innerHeight, true)
        } else {
          scrollOf(window.innerHeight, true)
        }
        break
    }
  }

  const instance = {
    on,
    off,
    container,
    active,
    target,
    bounds,
    current,
    scrollTo,
    scrollOfOneViewport,
    goToTop,
    goToBottom,
    setPrecision,
    getPrecision,
    setRatio,
    isLocked,
    lock,
    unlock,
    destroy,
    start
  }

  return () => instance
})()
