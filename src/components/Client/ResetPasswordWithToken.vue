<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/api/axios'
import CommonGridShape from '@/components/Tailadmin/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/Tailadmin/layout/FullScreenLayout.vue'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

// 表單欄位
const token = ref('')
const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isTokenValid = ref(true)

// 從 URL 獲取 token
onMounted(() => {
  token.value = route.query.token || ''

  if (!token.value) {
    isTokenValid.value = false
    Swal.fire({
      icon: 'error',
      title: '無效的連結',
      text: '此重設密碼連結無效或已過期',
      confirmButtonText: '返回登入',
    }).then(() => {
      router.push('/login')
    })
  }
})

// 切換密碼可見性
const togglePasswordVisibility = (field) => {
  if (field === 'new') {
    showNewPassword.value = !showNewPassword.value
  } else if (field === 'confirm') {
    showConfirmPassword.value = !showConfirmPassword.value
  }
}

/**
 * 提交新密碼
 * POST /api/Auth/reset-password
 */
const handleSubmit = async () => {
  // 驗證電子郵件
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

  // 驗證新密碼
  if (!newPassword.value.trim()) {
    Swal.fire({
      icon: 'warning',
      title: '請輸入新密碼',
      text: '新密碼不能為空',
    })
    return
  }

  // 驗證密碼長度
  if (newPassword.value.length < 6) {
    Swal.fire({
      icon: 'warning',
      title: '密碼長度不足',
      text: '密碼至少需要 6 個字元',
    })
    return
  }

  // 驗證密碼確認
  if (newPassword.value !== confirmPassword.value) {
    Swal.fire({
      icon: 'warning',
      title: '密碼不一致',
      text: '兩次輸入的密碼不相同',
    })
    return
  }

  // 顯示載入提示
  Swal.fire({
    title: '重設中...',
    html: '正在重設您的密碼',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })

  try {
    const response = await request.post('/Auth/reset-password', {
      email: email.value.trim(),
      resetToken: token.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    })

    console.log('重設密碼回應:', response.data)

    // 檢查是否成功
    if (response.status === 200 && response.data?.success) {
      console.log('密碼重設成功')

      // 顯示成功訊息，強制等待 2 秒
      Swal.fire({
        icon: 'success',
        title: '密碼重設成功！',
        text: '正在跳轉到登入頁面...',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      })

      // 強制等待 2000 毫秒
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 關閉 Swal
      Swal.close()

      // 跳轉到登入頁面
      try {
        await router.replace('/login')
      } catch (navError) {
        // 如果路由跳轉失敗，使用硬跳轉
        console.warn('路由跳轉失敗，使用硬跳轉', navError)
        window.location.href = '/login'
      }
    } else {
      throw new Error(response.data?.message || '密碼重設失敗')
    }
  } catch (error) {
    console.error('密碼重設失敗:', error)
    console.error('錯誤詳情:', error.response?.data)

    // 取得後端返回的錯誤訊息
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.title ||
      error.message ||
      '重設密碼失敗，連結可能已過期'

    Swal.fire({
      icon: 'error',
      title: '重設失敗',
      text: errorMessage,
      footer: '如果連結已過期，請重新申請重設密碼',
    })
  }
}
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
            <div v-if="isTokenValid">
              <div class="mb-5 sm:mb-8">
                <h1
                  class="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
                  設定新密碼
                </h1>
                <span class="text-sm text-gray-400">請輸入您的新密碼</span>
              </div>
              <div>
                <form @submit.prevent="handleSubmit">
                  <div class="space-y-5">
                    <!-- Email -->
                    <div class="hidden">
                      <label
                        for="email"
                        class="mb-1.5 block text-sm font-medium text-gray-700 disabled:cursor-not-allowed dark:text-gray-400">
                        Email
                        <span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="email"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="輸入您的電子郵件地址"
                        class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-success-500 focus:ring-brand-900/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
                    </div>

                    <!-- 新密碼 -->
                    <div>
                      <label
                        for="newPassword"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        新密碼
                        <span class="text-error-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          v-model="newPassword"
                          :type="showNewPassword ? 'text' : 'password'"
                          id="newPassword"
                          placeholder="輸入新密碼（至少 6 個字元）"
                          class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-success-500 focus:ring-brand-success-900/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-11 pl-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
                        <span
                          @click="togglePasswordVisibility('new')"
                          class="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400">
                          <svg
                            v-if="!showNewPassword"
                            class="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                              fill="#98A2B3" />
                          </svg>
                          <svg
                            v-else
                            class="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                              fill="#98A2B3" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <!-- 確認密碼 -->
                    <div>
                      <label
                        for="confirmPassword"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        確認密碼
                        <span class="text-error-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          v-model="confirmPassword"
                          :type="showConfirmPassword ? 'text' : 'password'"
                          id="confirmPassword"
                          placeholder="再次輸入新密碼"
                          class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-success-500 focus:ring-brand-success-900/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-11 pl-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
                        <span
                          @click="togglePasswordVisibility('confirm')"
                          class="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400">
                          <svg
                            v-if="!showConfirmPassword"
                            class="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                              fill="#98A2B3" />
                          </svg>
                          <svg
                            v-else
                            class="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                              fill="#98A2B3" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <!-- 密碼要求提示 -->
                    <div class="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                      <p class="text-sm text-blue-800 dark:text-blue-200">
                        <strong>密碼要求：</strong>
                      </p>
                      <ul
                        class="mt-1 list-inside list-disc text-sm text-blue-700 dark:text-blue-300">
                        <li>至少 6 個字元</li>
                        <li>建議包含大小寫字母、數字和特殊符號</li>
                      </ul>
                    </div>

                    <!-- Button -->
                    <div>
                      <button
                        type="submit"
                        class="bg-brand-success-500 shadow-theme-xs hover:bg-brand-success-800 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition">
                        確認重設密碼
                      </button>
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
