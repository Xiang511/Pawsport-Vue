<script setup>
import { ref } from 'vue'

import PageBreadcrumb from '@/components/Tailadmin/common/PageBreadcrumb.vue'
import AddressCard from '@/components/Tailadmin/profile/AddressCard.vue'
import PersonalInfoCard from '@/components/Tailadmin/profile/PersonalInfoCard.vue'
import ProfileCard from '@/components/Tailadmin/profile/ProfileCard.vue'

const currentPageTitle = ref('User Profile')
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />

  <div
    class="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
    <h3 class="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">Profile</h3>
    <profile-card />
    <personal-info-card />
    <address-card />
  </div>
</template>
