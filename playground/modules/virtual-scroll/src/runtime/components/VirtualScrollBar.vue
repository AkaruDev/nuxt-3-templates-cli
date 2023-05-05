<template>
  <div
    ref="el"
    class="VirtualScrollScrollBar-component"
    :class="{
      '--is-scrolling': isScrolling,
      '--is-dragging': mouseDown
    }"
  >
    <div
      ref="thumb"
      class="VirtualScrollScrollBar-thumb"
      @mousedown="onScrollbarDragStart"
    />
  </div>
</template>

<script setup>
import { useVirtualScroll } from '../composables/virtual-scroll'

const el = ref(null)
const thumb = ref(null)
const mouseDown = ref(false)

const $virtualScroll = useVirtualScroll()

const isScrolling = computed(() => {
  if (!$virtualScroll) return false
  return Math.abs($virtualScroll.target - $virtualScroll.current) > 10
})

onMounted(() => {
  $virtualScroll.on('scroll', onScroll)

  window.addEventListener('mouseup', onScrollBarRelease)
  window.addEventListener('mousemove', onScrollbarDrag)
})

onBeforeMount(() => {
  $virtualScroll.off('scroll', onScroll)
  window.removeEventListener('mouseup', onScrollBarRelease)
  window.removeEventListener('mousemove', onScrollbarDrag)
  document.body.style.cursor = ""
})


const onScroll = ({ current }) => {
  if (!el?.value) return
  const elHeight = el.value.clientHeight || 0
  const thumbHeight = thumb.value.clientHeight || 0
  const t = current / $virtualScroll.bounds.value * (elHeight - thumbHeight - 4)
  thumb.value.style.transform = `translate3d(0px, ${t.toFixed(2)}px, 0px)`
}

const onScrollbarDragStart = () => {
  mouseDown.value = true
  document.body.style.cursor = "grabbing"
}

const onScrollBarRelease = () => {
  mouseDown.value = false
  document.body.style.cursor = ""
}

const onScrollbarDrag = (e) => {
  e.preventDefault()
  if (!mouseDown.value) return

  const y = e.clientY / el.value.clientHeight * $virtualScroll.bounds.value
  $virtualScroll.scrollTo(y)
}

</script>

<style>
.VirtualScrollScrollBar-component {
  position: fixed;
  top: 0;
  right: 0;
  width: 11px;
  height: 100vh;
  z-index: 1000;
  transform-origin: center right;
  transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.3s cubic-bezier(0.65, 0, 0.35, 1);
  opacity: 0.5;
}

.VirtualScrollScrollBar-component:hover,
.VirtualScrollScrollBar-component.--is-dragging,
.VirtualScrollScrollBar-component.--is-scrolling {
  opacity: 0.8;
  transform: scaleX(1.4);
}

.VirtualScrollScrollBar-component.--is-scrolling .VirtualScrollScrollBar-thumb,
.VirtualScrollScrollBar-component:hover .VirtualScrollScrollBar-thumb {
  opacity: 1;
}

.VirtualScrollScrollBar-component.--is-scrolling .VirtualScrollScrollBar-thumb,
.VirtualScrollScrollBar-component.--is-dragging .VirtualScrollScrollBar-thumb {
  cursor: grabbing;
  opacity: 1;
}

.VirtualScrollScrollBar-thumb {
  position: absolute;
  top: 0;
  left: 0;
  width: 7px;
  height: 80px;
  background-color: #C1C1C1;
  border-radius: 14px;
  opacity: 0.5;
  margin: 2px;
  cursor: grab;
  will-change: transform;

  transform: translate3d(0px, 0px, 0px);
  transition: opacity 0.3s cubic-bezier(0.65, 0, 0.35, 1);
}
</style>
