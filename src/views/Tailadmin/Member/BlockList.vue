<script setup>
import { ref } from 'vue'

import PageBreadcrumb from '@/components/Tailadmin/common/PageBreadcrumb.vue'
import MemberBlocklistTable from '@/components/Pawsport/MemberBlocklistTable.vue'

const currentPageTitle = ref('違規名單')
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
  <div
    class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-6 xl:py-7 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="mx-auto w-full text-center">
      <MemberBlocklistTable />
    </div>
  </div>
</template>

<style></style>
