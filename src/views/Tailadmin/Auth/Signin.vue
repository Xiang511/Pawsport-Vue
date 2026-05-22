<script setup>
import { ref } from 'vue'
import request from '@/api/axios'
import CommonGridShape from '@/components/Tailadmin/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/Tailadmin/layout/FullScreenLayout.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { googleTokenLogin } from 'vue3-google-login'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const keepLoggedIn = ref(false)
const authStore = useAuthStore()
const isGoogleLoading = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  try {
    const response = await request.post('/Auth/login', {
      userEmail: email.value.trim(),
      password: password.value.trim(),
    })

    if (response.status === 200) {
      authStore.setLoginInfo(response.data.data.user)
      console.log('【登入成功】使用者資訊已儲存到 Pinia store：', authStore.userInfo)
      router.replace('/dashboard')
    }
  } catch (error) {
    console.error('登入失敗:', error)
    alert('登入失敗，請檢查帳號密碼')
  }
}

/**
 * Google 登入處理
 */
const handleGoogleLogin = async () => {
  console.log('🔵 [Google Login] 開始執行...')
  isGoogleLoading.value = true

  try {
    // 呼叫 googleTokenLogin 會取得 access_token
    const response = await googleTokenLogin()
    console.log('🟢 [Google Login] 收到 Google 回應', response)

    // 如果後端其實是要 access_token，請跟後端對齊欄位名稱
    // 這裡相容舊邏輯，優先抓取任何可能的 token 欄位
    const token =
      response.credential || response.id_token || response.idToken || response.access_token

    if (!token) {
      throw new Error('無法在回應中找到任何 Token 憑證')
    }

    // 發送給後端驗證（注意：確認後端要的是 idToken 還是 accessToken）
    const backendResponse = await request.post('/Auth/google-login', {
      idToken: token,
    })

    if (backendResponse.data.success) {
      authStore.setLoginInfo(backendResponse.data.data.user)

      if (backendResponse.data.data.token) {
        localStorage.setItem('token', backendResponse.data.data.token)
      }

      router.replace('/dashboard')
    } else {
      throw new Error(backendResponse.data.message || '登入失敗')
    }
  } catch (error) {
    console.error('🔴 [Google Login] 失敗:', error)
    if (error.type === 'popup_closed' || error.message === 'popup_closed_by_user') {
      console.log('ℹ️ [User] 使用者關閉了登入視窗')
    } else if (error.response) {
      alert(`Google 登入失敗: ${error.response.data?.message || '後端驗證錯誤'}`)
    } else {
      alert(`Google 登入失敗: ${error.message || '請稍後再試'}`)
    }
  } finally {
    isGoogleLoading.value = false
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
              to="/"
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
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              返回首頁
            </router-link>
          </div>
          <div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1
                  class="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
                  Login
                </h1>
                <span class="text-sm text-gray-400">請輸入您的帳號密碼以繼續使用</span>
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
                        class="focus:border-brand-success-500 focus:ring-brand-900/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
                    </div>
                    <!-- Password -->
                    <div>
                      <label
                        for="password"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Password
                        <span class="text-error-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          v-model="password"
                          :type="showPassword ? 'text' : 'password'"
                          id="password"
                          placeholder="輸入您的密碼"
                          class="focus:border-brand-success-500 focus:ring-brand-success-900/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-11 pl-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
                        <span
                          @click="togglePasswordVisibility"
                          class="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400">
                          <svg
                            v-if="!showPassword"
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
                    <!-- Checkbox -->
                    <div class="flex items-center justify-between">
                      <label
                        for="keepLoggedIn"
                        class="flex cursor-pointer items-center text-sm font-normal text-gray-700 select-none dark:text-gray-400">
                        <div class="relative">
                          <input
                            v-model="keepLoggedIn"
                            type="checkbox"
                            id="keepLoggedIn"
                            class="sr-only" />
                          <div
                            :class="
                              keepLoggedIn
                                ? 'border-brand-success-500 text-brand-success-900 bg-brand-success-500'
                                : 'border-gray-300 bg-transparent dark:border-gray-700'
                            "
                            class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]">
                            <span :class="keepLoggedIn ? '' : 'opacity-0'">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                  stroke="white"
                                  stroke-width="1.94437"
                                  stroke-linecap="round"
                                  stroke-linejoin="round" />
                              </svg>
                            </span>
                          </div>
                        </div>
                        保持登入
                      </label>
                      <router-link
                        to="/reset-password"
                        class="text-brand-success-500 hover:text-brand-success-800 dark:text-brand-400 text-sm">
                        忘記密碼 ?
                      </router-link>
                    </div>
                    <!-- Button -->
                    <button
                      type="submit"
                      class="bg-brand-success-500 shadow-theme-xs hover:bg-brand-success-800 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition">
                      登入
                    </button>
                  </div>
                </form>
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
