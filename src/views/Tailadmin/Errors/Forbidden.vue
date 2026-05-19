<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
    <div class="w-full max-w-md text-center">
      <!-- 圖示 -->
      <div class="mb-8 flex justify-center">
        <div class="relative">
          <div class="absolute inset-0 rounded-full bg-red-400 opacity-25"></div>
          <div
            class="relative flex h-32 w-32 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              class="h-20 w-20 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 錯誤代碼 -->
      <!-- <h1 class="mb-4 text-9xl font-bold text-red-600 dark:text-red-400">403</h1> -->

      <!-- 錯誤訊息 -->
      <h2 class="mb-2 text-5xl font-semibold text-red-600 dark:text-red-400">權限不足</h2>

      <!-- 額外說明 -->
    </div>
  </div>
</template>

<style scoped></style>
