<script setup>
import { ref, nextTick } from 'vue'
import request from '@/api/axios'
import CommonGridShape from '@/components/Tailadmin/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/Tailadmin/layout/FullScreenLayout.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { googleTokenLogin } from 'vue3-google-login'
import Swal from 'sweetalert2'

// 表單欄位
const email = ref('')
const password = ref('')
const verificationCode = ref('')
const showPassword = ref(false)
const keepLoggedIn = ref(false)

// 驗證流程狀態
const isPasswordVerified = ref(false) // 密碼是否已驗證通過
const isWaitingForCode = ref(false) // 是否等待輸入驗證碼
const firstStepResponse = ref(null) // 保存第一步的響應數據

// Store 和載入狀態
const authStore = useAuthStore()
const isGoogleLoading = ref(false)

// 切換密碼可見性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

/**
 * 步驟一：發送驗證碼（同時驗證密碼）
 * POST /api/Auth/login/request-code
 */
const requestVerificationCode = async () => {
  // 驗證必填欄位
  if (!email.value.trim()) {
    Swal.fire({
      icon: 'warning',
      title: '請輸入電子郵件',
      text: '電子郵件不能為空',
    })
    return
  }

  if (!password.value.trim()) {
    Swal.fire({
      icon: 'warning',
      title: '請輸入密碼',
      text: '密碼不能為空',
    })
    return
  }

  // 顯示載入提示
  Swal.fire({
    title: '驗證中...',
    html: '正在驗證密碼並發送驗證碼',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })

  try {
    const response = await request.post('/Auth/login/request-code', {
      email: email.value.trim(),
      password: password.value.trim(),
    })

    console.log('驗證碼發送回應:', response.data)
    console.log('回應完整結構:', JSON.stringify(response.data, null, 2))

    // 檢查密碼驗證是否成功
    if (response.status === 200 && response.data?.success) {
      // 保存第一步的響應數據，可能包含 sessionId 或其他需要的信息
      firstStepResponse.value = response.data
      isPasswordVerified.value = true
      isWaitingForCode.value = true

      Swal.fire({
        icon: 'success',
        title: '驗證碼已發送！',
        html: '請查看您的電子郵件信箱<br/>並輸入收到的驗證碼',
        confirmButtonText: '確定',
      })
    } else {
      throw new Error(response.data?.message || '密碼驗證失敗')
    }
  } catch (error) {
    console.error('發送驗證碼失敗:', error)
    console.error('錯誤詳情:', error.response?.data)

    // 重置狀態
    isPasswordVerified.value = false
    isWaitingForCode.value = false
    firstStepResponse.value = null

    Swal.fire({
      icon: 'error',
      title: '驗證失敗',
      text: error.response?.data?.message || error.message || '請檢查帳號密碼是否正確',
    })
  }
}

/**
 * 步驟二：驗證驗證碼並完成登入
 * POST /api/Auth/login/verify-code
 */
const verifyCodeAndLogin = async () => {
  // 驗證驗證碼是否已輸入
  if (!verificationCode.value.trim()) {
    Swal.fire({
      icon: 'warning',
      title: '請輸入驗證碼',
      text: '驗證碼不能為空',
    })
    return
  }

  // 顯示載入提示
  Swal.fire({
    title: '驗證中...',
    html: '正在驗證驗證碼',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })

  try {
    // 準備第二步的請求參數
    const requestData = {
      email: email.value.trim(),
      verificationCode: verificationCode.value.trim(),
    }

    // 如果第一步響應中有 sessionId 或其他需要的字段，添加到請求中
    if (firstStepResponse.value?.data?.sessionId) {
      requestData.sessionId = firstStepResponse.value.data.sessionId
    }

    console.log('📤 發送驗證碼驗證請求，參數:', requestData)

    const response = await request.post('/Auth/login/verify-code', requestData)

    console.log('驗證碼驗證回應:', response.data)

    // 檢查驗證是否成功
    if (response.status === 200 && response.data?.data?.user) {
      // 設定登入資訊
      authStore.setLoginInfo(response.data.data.user)

      // 等待 store 更新完成
      await nextTick()

      console.log('登入成功，準備跳轉到 /dashboard/ecommerce')

      // 顯示成功訊息，強制等待 2 秒
      Swal.fire({
        icon: 'success',
        title: '登入成功！',
        text: '正在跳轉...',
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

      // 使用 replace 並處理可能的錯誤
      try {
        await router.replace('/dashboard')
      } catch (navError) {
        // 如果路由跳轉失敗，使用硬跳轉
        console.warn('路由跳轉失敗，使用硬跳轉', navError)
        window.location.href = '/dashboard/ecommerce'
      }
    } else {
      throw new Error(response.data?.message || '驗證碼驗證失敗')
    }
  } catch (error) {
    console.error('驗證碼驗證失敗:', error)
    console.error('錯誤詳情:', error.response?.data)
    console.error('請求參數:', { email: email.value, verificationCode: verificationCode.value })

    // 取得後端返回的錯誤訊息
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.title ||
      error.message ||
      '驗證碼錯誤或已過期'

    Swal.fire({
      icon: 'error',
      title: '驗證失敗',
      text: errorMessage,
      footer: '請確認驗證碼是否正確，或重新獲取驗證碼',
    })
  }
}

/**
 * 主表單提交處理
 * 根據當前狀態決定執行哪個步驟
 */
const handleSubmit = async () => {
  if (!isPasswordVerified.value) {
    // 步驟一：發送驗證碼
    await requestVerificationCode()
  } else {
    // 步驟二：驗證驗證碼並登入
    await verifyCodeAndLogin()
  }
}

/**
 * 重新獲取驗證碼
 */
const resendVerificationCode = async () => {
  verificationCode.value = '' // 清空驗證碼輸入
  await requestVerificationCode()
}

/**
 * Google 登入處理
 */
const handleGoogleLogin = async () => {
  console.log('🔵 [Google Login] 開始執行...')
  isGoogleLoading.value = true

  try {
    // 顯示加載提示
    Swal.fire({
      title: 'Google 登入中...',
      html: '請稍候',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

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

    console.log('🟢 [Google Login] 後端回應:', backendResponse.data)

    // 檢查多種可能的成功狀態
    const isSuccess = backendResponse.data?.success || backendResponse.status === 200
    const userData = backendResponse.data?.data?.user

    if (isSuccess && userData) {
      // 設定登入資訊
      authStore.setLoginInfo(userData)

      // 等待 store 更新完成
      await nextTick()

      console.log('✅ Google 登入成功，準備跳轉')

      // 顯示成功訊息，強制等待2秒
      Swal.fire({
        icon: 'success',
        title: 'Google 登入成功！',
        text: '正在跳轉...',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      })

      // 強制等待2000毫秒
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 關閉 Swal
      Swal.close()

      // 使用 replace 並處理可能的錯誤
      try {
        await router.replace('/dashboard/ecommerce')
      } catch (navError) {
        // 如果路由跳轉失敗，使用硬跳轉
        console.warn('路由跳轉失敗，使用硬跳轉', navError)
        window.location.href = '/dashboard/ecommerce'
      }
    } else {
      throw new Error(backendResponse.data?.message || '後端驗證失敗：未返回用戶資料')
    }
  } catch (error) {
    console.error('🔴 [Google Login] 失敗:', error)
    Swal.close()

    if (error.type === 'popup_closed' || error.message === 'popup_closed_by_user') {
      console.log('ℹ️ [User] 使用者關閉了登入視窗')
    } else if (error.response) {
      Swal.fire({
        icon: 'error',
        title: 'Google 登入失敗',
        text: error.response.data?.message || '後端驗證錯誤',
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Google 登入失敗',
        text: error.message || '請稍後再試',
      })
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
                        :disabled="isPasswordVerified"
                        class="focus:border-brand-success-500 focus:ring-brand-900/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
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
                          :disabled="isPasswordVerified"
                          class="focus:border-brand-success-500 focus:ring-brand-success-900/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-11 pl-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
                        <span
                          v-if="!isPasswordVerified"
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

                    <!-- 驗證碼輸入框（密碼驗證通過後顯示） -->
                    <div v-if="isPasswordVerified && isWaitingForCode" class="space-y-3">
                      <div>
                        <label
                          for="verificationCode"
                          class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          驗證碼
                          <span class="text-error-500">*</span>
                        </label>
                        <input
                          v-model="verificationCode"
                          type="text"
                          id="verificationCode"
                          placeholder="請輸入 6 位數驗證碼"
                          maxlength="6"
                          class="focus:border-brand-success-500 focus:ring-brand-900/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
                      </div>
                      <!-- 重新獲取驗證碼按鈕 -->
                      <button
                        type="button"
                        @click="resendVerificationCode"
                        class="text-brand-success-500 hover:text-brand-success-800 dark:text-brand-400 text-sm transition-colors">
                        重新獲取驗證碼
                      </button>
                    </div>

                    <!-- Checkbox -->
                    <div v-if="!isPasswordVerified" class="flex items-center justify-between">
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
                    <div>
                      <button
                        type="submit"
                        class="bg-brand-success-500 shadow-theme-xs hover:bg-brand-success-800 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition">
                        {{ isPasswordVerified ? '驗證並登入' : '發送驗證碼' }}
                      </button>
                    </div>
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
