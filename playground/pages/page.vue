<template>
    <main>
        <h1>Page</h1>
        <nuxt-link to="/">Go to home</nuxt-link>
    </main>
</template>

<script setup>
const { busTransition } = useTransition()
definePageMeta(useTransition())
</script>