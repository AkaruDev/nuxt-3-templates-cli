export default (nuxtApp) => {
  return {
    created (el, options) {
      const { $virtualScroll } = nuxtApp
      $virtualScroll.start(el)

      if (typeof options?.value?.ratio === 'number') $virtualScroll.setRatio(options.ratio.value)
      if (typeof options?.value?.precision === 'number') $virtualScroll.setPrecision(options.precision.value)
    }
  }
}
