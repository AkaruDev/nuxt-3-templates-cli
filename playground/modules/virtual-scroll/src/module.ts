import { defineNuxtModule, addPlugin, addComponent,addImports, createResolver } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'virtual-scroll',
    configKey: 'virtualScroll'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () {// (options, nuxt)
    const resolver = createResolver(import.meta.url)

     // Add composable
     addImports({
      name: 'useVirtualScroll',
      as: 'useVirtualScroll',
      from: resolver.resolve('runtime/composables/virtual-scroll')
    })

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('runtime/plugin'))

    // Add components
    addComponent({
      name: 'VirtualScrollBar', // name of the component to be used in vue templates
      filePath: resolver.resolve('runtime/components/VirtualScrollBar.vue')
    })
  }
})
