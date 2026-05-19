<script setup>
import { RouterView } from 'vue-router'
import { useGameAudio } from '@/composables/useGameAudio'
const { initAudioLogic } = useGameAudio()
initAudioLogic()
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
