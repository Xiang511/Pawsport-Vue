<script setup>
import { RouterView } from 'vue-router'

import AdminLayout from '@/components/Tailadmin/layout/AdminLayout.vue'
import SidebarProvider from '@/components/Tailadmin/layout/SidebarProvider.vue'
import ThemeProvider from '@/components/Tailadmin/layout/ThemeProvider.vue'
</script>

<template>
  <ThemeProvider>
    <SidebarProvider>
      <AdminLayout>
        <RouterView />
      </AdminLayout>
    </SidebarProvider>
  </ThemeProvider>
</template>

<style scoped></style>
