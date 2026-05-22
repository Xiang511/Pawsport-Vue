<script setup>
import { ref } from 'vue'

import PageBreadcrumb from '@/components/Tailadmin/common/PageBreadcrumb.vue'
import LoginActivityTable from '@/components/Tailadmin/Member/LoginActivityTable.vue'

const currentPageTitle = ref('登入活動')
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
  <div
    class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-6 xl:py-7 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="mx-auto w-full">
      <LoginActivityTable />
    </div>
  </div>
</template>
<style></style>
