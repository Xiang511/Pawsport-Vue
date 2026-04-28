<script setup>
import LineChartOne from "@/components/Tailadmin/charts/LineChart/LineChartOne.vue";
import ComponentCard from "@/components/Tailadmin/common/ComponentCard.vue";
import PageBreadcrumb from "@/components/Tailadmin/common/PageBreadcrumb.vue";
import { ref } from "vue";
const currentPageTitle = ref("Line Chart");
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Line Chart 1">
        <LineChartOne />
      </ComponentCard>
    </div>
</template>
