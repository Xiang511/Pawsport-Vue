<script setup lang="ts">
import { useSidebar } from '@/composables/Tailadmin/useSidebar'

const { toggleMobileSidebar, isMobileOpen } = useSidebar()
</script>

<template>
  <div
    v-if="isMobileOpen"
    class="fixed inset-0 z-9999 bg-gray-900/50 lg:hidden"
    @click="toggleMobileSidebar"></div>
</template>
