module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: ["@nuxt/eslint-config"],
  rules: { 'vue/multi-word-component-names': 0, 'vue/no-v-html': 'off' },
}
