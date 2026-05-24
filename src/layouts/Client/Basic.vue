<script setup>
import { RouterView, useRoute } from 'vue-router'
import Nav from '@/components/Client/Nav.vue'
import Footer from '@/components/Client/Footer.vue'
const route = useRoute()
</script>

<template>
  <Nav />
  <RouterView :key="route.fullPath" />
  <Footer />
</template>

<style scoped></style>
