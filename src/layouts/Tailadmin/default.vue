<script setup>
import { RouterView, useRoute } from 'vue-router'

import AdminLayout from '@/components/Tailadmin/layout/AdminLayout.vue'
import SidebarProvider from '@/components/Tailadmin/layout/SidebarProvider.vue'
import ThemeProvider from '@/components/Tailadmin/layout/ThemeProvider.vue'

const route = useRoute()
</script>

<template>
  <ThemeProvider>
    <SidebarProvider>
      <AdminLayout>
        <RouterView :key="route.fullPath" />
      </AdminLayout>
    </SidebarProvider>
  </ThemeProvider>
</template>

<style scoped></style>
