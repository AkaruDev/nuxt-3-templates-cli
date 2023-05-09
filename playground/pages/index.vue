<template>
    <main>
        <h1>Nuxt 3 templates CLI</h1>
        <div>Playground</div>
        <nuxt-link to="/page">Go to page</nuxt-link>
    </main>
</template>

<script setup>
const { busTransition } = useTransition()
definePageMeta(useTransition())
</script>

<style lang="scss" scoped></style>