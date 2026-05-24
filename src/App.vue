<script setup>
import { RouterView, useRoute } from 'vue-router'
import { useGameAudio } from '@/composables/useGameAudio'
const { initAudioLogic } = useGameAudio()
initAudioLogic()
const route = useRoute()
</script>

<template>
  <RouterView :key="route.fullPath" />
</template>

<style scoped></style>
