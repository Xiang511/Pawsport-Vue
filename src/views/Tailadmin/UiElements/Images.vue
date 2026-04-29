<script setup>
import { ref } from 'vue'

import ComponentCard from '@/components/Tailadmin/common/ComponentCard.vue'
import PageBreadcrumb from '@/components/Tailadmin/common/PageBreadcrumb.vue'
import ResponsiveImage from '@/components/Tailadmin/ui/images/ResponsiveImage.vue'
import ThreeColumnImageGrid from '@/components/Tailadmin/ui/images/ThreeColumnImageGrid.vue'
import TwoColumnImageGrid from '@/components/Tailadmin/ui/images/TwoColumnImageGrid.vue'

const currentPageTitle = ref('Images')
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
  <div className="space-y-5 sm:space-y-6">
    <ComponentCard title="Responsive Image">
      <ResponsiveImage />
    </ComponentCard>
    <ComponentCard title="Image in 2 Grid">
      <TwoColumnImageGrid />
    </ComponentCard>
    <ComponentCard title="Image in 3 Grid">
      <ThreeColumnImageGrid />
    </ComponentCard>
  </div>
</template>

<style></style>
