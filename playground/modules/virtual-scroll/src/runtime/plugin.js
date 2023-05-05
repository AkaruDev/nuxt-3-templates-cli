import { defineNuxtPlugin } from '#app'
import { useVirtualScroll } from './composables/virtual-scroll'
import container from './directives/container'
import section from './directives/section'
import sticky from './directives/sticky'


export default defineNuxtPlugin(nuxtApp => {

  // const createVirtualScroll = createApp(App)

  // now available on `nuxtApp.$injected`
  const virtualScroll = useVirtualScroll()
  nuxtApp.provide('virtualScroll', virtualScroll)

  nuxtApp.vueApp.directive('scroll-container', container(nuxtApp))
  nuxtApp.vueApp.directive('scroll-section', section(nuxtApp))
  nuxtApp.vueApp.directive('scroll-sticky', sticky(nuxtApp))
})
