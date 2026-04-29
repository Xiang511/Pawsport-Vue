<script setup>
import { useSidebar } from '@/composables/Tailadmin/useSidebar'

import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import Backdrop from './Backdrop.vue'

const { isExpanded, isHovered } = useSidebar()
</script>

<template>
  <div class="min-h-screen xl:flex">
    <app-sidebar />
    <Backdrop />
    <div
      class="flex-1 transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']">
      <app-header />
      <div class="mx-auto max-w-screen-2xl p-4 md:p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
