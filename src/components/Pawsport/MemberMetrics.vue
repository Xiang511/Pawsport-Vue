<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const memberCount = ref(0)
const memberMonthSignUp = ref(0)
const verifyPercentage = ref(0)
const subscribedMemberCount = ref(0)
const isLoading = ref(true)

async function GetMemberSummary() {
  isLoading.value = true
  try {
    const { data } = await axios.get('https://localhost:7048/api/Users/Summary')
    memberCount.value = data.data.memberCount
    memberMonthSignUp.value = data.data.memberMonthSignUp
    verifyPercentage.value = data.data.verifyPercentage + '%'
    subscribedMemberCount.value = data.data.subscribedMemberCount
    // console.log(data)
    // console.log(data.data.memberCount)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(GetMemberSummary)
</script>

<template>
  <!-- Overview -->
  <div
    class="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="font-semibold text-gray-800 dark:text-white/90">Overview</h2>
      </div>
    </div>
    <div
      class="grid grid-cols-1 rounded-xl border border-gray-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0 dark:divide-gray-800 dark:border-gray-800">
      <!-- Skeleton Loading -->
      <template v-if="isLoading">
        <div class="border-b border-gray-200 p-5 sm:border-r lg:border-b-0">
          <div class="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-9 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div class="border-b border-gray-200 p-5 lg:border-b-0">
          <div class="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-9 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div class="border-b border-gray-200 p-5 sm:border-r sm:border-b-0">
          <div class="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-9 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div class="border-gray-200 p-5">
          <div class="mb-2 h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-9 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </template>

      <!-- Actual Data -->
      <template v-else>
        <div class="border-b border-gray-200 p-5 sm:border-r lg:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">會員總數</p>
          <h3 class="font-weight-bold text-3xl text-gray-800 dark:text-white/90">
            {{ memberCount }}
          </h3>
        </div>
        <div class="border-b border-gray-200 p-5 lg:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">當月註冊人數</p>
          <h3 class="font-weight-bold text-3xl text-gray-800 dark:text-white/90">
            {{ memberMonthSignUp }}
          </h3>
        </div>
        <div class="border-b border-gray-200 p-5 sm:border-r sm:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">帳號認證比例</p>
          <h3 class="font-weight-bold text-3xl text-gray-800 dark:text-white/90">
            {{ verifyPercentage }}
          </h3>
        </div>
        <div class="border-gray-200 p-5">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">電子報訂閱人數</p>
          <h3 class="font-weight-bold text-3xl text-gray-800 dark:text-white/90">
            {{ subscribedMemberCount }}
          </h3>
        </div>
      </template>
    </div>
  </div>
</template>
