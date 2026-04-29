<script setup>
import { ref } from 'vue'

import BarChartOne from '@/components/Tailadmin/charts/BarChart/BarChartOne.vue'
import ComponentCard from '@/components/Tailadmin/common/ComponentCard.vue'
import PageBreadcrumb from '@/components/Tailadmin/common/PageBreadcrumb.vue'

const currentPageTitle = ref('Bar Chart')
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard title="Bar Chart 1"><BarChartOne /></ComponentCard>
  </div>
</template>
