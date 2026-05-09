<script setup>
import { ref } from 'vue'

import PageBreadcrumb from '@/components/Tailadmin/common/PageBreadcrumb.vue'
import MemberMetrics from '@/components/Pawsport/MemberMetrics.vue'
import MemberInfoTable from '@/components/Pawsport/MemberInfoTable.vue'

const currentPageTitle = ref('基本資料')
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
  <MemberMetrics />
  <div
    class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-6 xl:py-7 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="mx-auto w-full text-center">
      <MemberInfoTable />
    </div>
  </div>
</template>

<style></style>
