<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goLogin = () => {
  router.push('/login')
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
          <div class="absolute inset-0 rounded-full bg-yellow-400 opacity-25"></div>
          <div
            class="relative flex h-32 w-32 items-center justify-center rounded-full bg-yellow-100">
            <svg
              class="h-20 w-20 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <h1 class="mb-2 text-6xl font-bold text-yellow-500">401</h1>
      <h2 class="mb-4 text-2xl font-semibold text-gray-700">請先登入</h2>
      <p class="mb-8 text-gray-500">您尚未登入，請登入後再繼續操作。</p>

      <div class="flex justify-center gap-4">
        <button
          @click="goLogin"
          class="rounded-lg bg-yellow-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-yellow-600">
          前往登入
        </button>
        <button
          @click="goHome"
          class="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          返回首頁
        </button>
      </div>
    </div>
  </div>
</template>
