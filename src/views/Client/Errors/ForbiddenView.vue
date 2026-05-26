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
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md text-center">
      <div class="mb-8 flex justify-center">
        <div class="relative">
          <div class="absolute inset-0 rounded-full bg-red-400 opacity-25"></div>
          <div class="relative flex h-32 w-32 items-center justify-center rounded-full bg-red-100">
            <svg
              class="h-20 w-20 text-red-600"
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

      <h1 class="mb-2 text-6xl font-bold text-red-500">403</h1>
      <h2 class="mb-4 text-2xl font-semibold text-gray-700">權限不足</h2>
      <p class="mb-8 text-gray-500">您沒有權限訪問此頁面，請聯絡管理員或返回首頁。</p>

      <div class="flex justify-center gap-4">
        <button
          @click="goBack"
          class="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          返回上頁
        </button>
        <button
          @click="goHome"
          class="rounded-lg bg-red-500 px-6 py-3 text-sm font-medium text-white hover:bg-red-600 transition-colors">
          返回首頁
        </button>
      </div>
    </div>
  </div>
</template>
