
import { clamp } from "../utils/math"
import { useVirtualScroll } from '../composables/virtual-scroll'

export default () => {
  const $virtualScroll = useVirtualScroll()
  let options = { active: true, marge: 100, onProgress: null }
  let stickys = []
  let progress = 0
  let onScrollCallback = null


  /**
   *
   * @param {Element} el
   * @param {Object} elOptions parameters
   */
  const mounted = (el, elOptions) => {
    stickys.push({
      el,
      elBounds: null,
      parent: el.parentNode,
      parentBounds: null,
      options: { ...options, ...elOptions.value }
    })


    $virtualScroll.on('scroll', onScroll)
  }

  const setBounds = () => {
    stickys.forEach(sticky => {
      sticky.elBounds = sticky.el.getBoundingClientRect()
      sticky.parentBounds = sticky.parent.getBoundingClientRect()
    })
  }

  const sendProgress = () => {
    stickys.forEach(sticky => {
      if (sticky.options.onProgress) sticky.options.onProgress(progress)
    })
  }

  const onScroll = () => {
    if (!options.active) return
    setBounds()

    stickys.forEach(sticky => {
      if ($virtualScroll.active.value) {
        const isInBounds = sticky.parentBounds.top <= sticky.options.marge && sticky.parentBounds.top + sticky.parentBounds.height - sticky.elBounds.height >= -sticky.options.marge
        if (isInBounds) {
          const max = sticky.parentBounds.height - sticky.elBounds.height
          const value = sticky.parentBounds.top * -1
          const y = clamp(value, 0, max).toFixed($virtualScroll.getPrecision())
          sticky.el.style.transform = `translateY(${y}px)`

          progress = (sticky.elBounds.top - sticky.parentBounds.top) / (sticky.parentBounds.height - sticky.elBounds.height)
          sendProgress()
        }
      } else {
        const isInBounds = sticky.parentBounds.top <= 0 && sticky.parentBounds.top + sticky.parentBounds.height - sticky.elBounds.height >= 0
        if (isInBounds) {
          sticky.el.style.position = 'fixed'
          sticky.el.style.top = ''
          sticky.el.style.width = ''
          sticky.el.style.transform = ''
          progress = (sticky.elBounds.top - sticky.parentBounds.top) / (sticky.parentBounds.height - sticky.elBounds.height)
          sendProgress()
        } else {
          sticky.el.style.position = ''
          sticky.el.style.top = ''
          sticky.el.style.width = ''

          if (sticky.parentBounds.top <= 0) {
            sticky.el.style.transform = `translateY(${sticky.parentBounds.height - sticky.elBounds.height}px)`
          }
        }
      }
    })

  }

  return {
    mounted,
    destroy () {
      $virtualScroll.off('scroll', onScrollCallback)
    }
  }
}

