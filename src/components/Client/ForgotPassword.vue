<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import request from '@/api/axios'
import CommonGridShape from '@/components/Tailadmin/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/Tailadmin/layout/FullScreenLayout.vue'
import router from '@/router'
import Swal from 'sweetalert2'

const route = useRoute()

// 表單欄位
const email = ref('')
const isSubmitted = ref(false) // 是否已提交

/**
 * 發送重設密碼郵件
 * POST /api/Auth/forgot-password
 */
const handleSubmit = async () => {
  // 驗證必填欄位
  if (!email.value.trim()) {
    Swal.fire({
      icon: 'warning',
      title: '請輸入電子郵件',
      text: '電子郵件不能為空',
    })
    return
  }

  // 驗證郵箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value.trim())) {
    Swal.fire({
      icon: 'warning',
      title: '郵箱格式錯誤',
      text: '請輸入有效的電子郵件地址',
    })
    return
  }

  // 顯示載入提示
  Swal.fire({
    title: '發送中...',
    html: '正在發送重設密碼郵件',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })

  try {
    const response = await request.post('/Auth/forgot-password', {
      email: email.value.trim(),
    })

    console.log('重設密碼郵件發送回應:', response.data)
    console.log('回應完整結構:', JSON.stringify(response.data, null, 2))

    // 檢查是否成功
    if (response.status === 200 && response.data?.success) {
      isSubmitted.value = true

      // 顯示成功訊息
      Swal.fire({
        icon: 'success',
        title: '郵件已發送！',
        html:
          '我們已將重設密碼的連結發送到您的信箱<br/>' +
          '<span class="text-sm text-gray-500">' +
          email.value +
          '</span><br/><br/>' +
          '請查看您的電子郵件並點擊連結以重設密碼',
        confirmButtonText: '確定',
        confirmButtonColor: '#10b981',
      })
    } else {
      throw new Error(response.data?.message || '發送郵件失敗')
    }
  } catch (error) {
    console.error('發送郵件失敗:', error)
    console.error('錯誤詳情:', error.response?.data)

    const errorMessage =
      error.response?.data?.message || error.message || '找不到此電子郵件對應的帳號'

    Swal.fire({
      icon: 'error',
      title: '發送失敗',
      text: errorMessage,
    })
  }
}
// 檢查是否有 token 參數，如果有則跳轉到設定新密碼頁面
onMounted(() => {
  const token = route.query.token
  if (token) {
    console.log('檢測到 token，跳轉到設定新密碼頁面')
    router.replace(`/reset-password/confirm?token=${token}`)
  }
})
</script>

<template>
  <FullScreenLayout>
    <div class="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <div
        class="relative flex h-screen w-full flex-col justify-center lg:flex-row dark:bg-gray-900">
        <div class="flex w-full flex-1 flex-col lg:w-1/2">
          <div class="mx-auto w-full max-w-md pt-10">
            <router-link
              to="/login"
              class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg
                class="stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none">
                <path
                  d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              返回登入
            </router-link>
          </div>
          <div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1
                  class="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
                  忘記密碼
                </h1>
                <span class="text-sm text-gray-400">
                  請輸入您的電子郵件地址，我們將發送重設密碼的連結到您的信箱
                </span>
              </div>
              <div>
                <form @submit.prevent="handleSubmit">
                  <div class="space-y-5">
                    <!-- Email -->
                    <div>
                      <label
                        for="email"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Email
                        <span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="email"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="輸入您的電子郵件地址"
                        :disabled="isSubmitted"
                        class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-success-500 focus:ring-brand-900/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
                    </div>

                    <!-- Button -->
                    <div>
                      <button
                        type="submit"
                        :disabled="isSubmitted"
                        class="bg-brand-success-500 shadow-theme-xs hover:bg-brand-success-800 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60">
                        發送重設密碼連結
                      </button>
                    </div>

                    <!-- 提交後的提示 -->
                    <div v-if="isSubmitted" class="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                      <div class="flex items-start">
                        <svg
                          class="mt-0.5 h-5 w-5 text-green-500 dark:text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clip-rule="evenodd" />
                        </svg>
                        <div class="ml-3">
                          <p class="text-sm font-medium text-green-800 dark:text-green-200">
                            郵件已發送！
                          </p>
                          <p class="mt-1 text-sm text-green-700 dark:text-green-300">
                            請查看您的電子郵件信箱並點擊連結以重設密碼
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                <div class="mt-5 text-center">
                  <span class="text-sm text-gray-500 dark:text-gray-400">記得密碼了嗎？</span>
                  <router-link
                    to="/login"
                    class="text-brand-success-500 hover:text-brand-success-800 dark:text-brand-400 ml-1 text-sm font-medium">
                    返回登入
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="relative hidden h-full w-full items-center bg-[#FCF4E5] lg:grid lg:w-1/2 dark:bg-white/5">
          <div class="z-1 flex items-center justify-center">
            <common-grid-shape />
            <div class="flex max-w-xs flex-col items-center">
              <img width="231" height="48" src="/images/dashboard/loginpage.png" alt="Logo" />

              <p class="text-brand-success-950 text-center text-9xl font-bold dark:text-white/60">
                Petmily
                <br />
                <span class="mt-4.5 block text-4xl">寵物媒合平台</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>
