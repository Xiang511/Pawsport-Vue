<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// 用戶資料
const user = computed(() => authStore.userInfo || {})

// 編輯模式
const isEditing = ref(false)
const editForm = ref({
  name: '',
  email: '',
  phone: '',
  bio: '',
})

// 統計數據
const stats = ref({
  posts: 12,
  pets: 3,
  followers: 45,
  following: 28,
})

// 選單項目
const menuItems = ref([
  { id: 'profile', icon: '👤', label: '個人資料', active: true },
  { id: 'pets', icon: '🐾', label: '我的寵物', active: false },
  { id: 'posts', icon: '📝', label: '我的貼文', active: false },
  { id: 'favorites', icon: '❤️', label: '收藏清單', active: false },
  { id: 'settings', icon: '⚙️', label: '帳號設定', active: false },
])

const activeTab = ref('profile')

// 切換選單
const switchTab = (tabId) => {
  activeTab.value = tabId
  menuItems.value.forEach((item) => {
    item.active = item.id === tabId
  })
}

// 開始編輯
const startEdit = () => {
  isEditing.value = true
  editForm.value = {
    name: user.value.name || '',
    email: user.value.email || user.value.userEmail || '',
    phone: user.value.phone || '',
    bio: user.value.bio || '',
  }
}

// 取消編輯
const cancelEdit = () => {
  isEditing.value = false
}

// 保存資料
const saveProfile = async () => {
  try {
    // TODO: 調用 API 更新用戶資料
    console.log('保存資料:', editForm.value)
    // 模擬更新成功
    alert('資料更新成功！')
    isEditing.value = false
  } catch (error) {
    console.error('更新失敗:', error)
    alert('更新失敗，請稍後再試')
  }
}

// 登出
const logout = () => {
  if (confirm('確定要登出嗎？')) {
    authStore.clearLoginInfo()
    router.push('/')
  }
}

// 上傳頭像
const uploadAvatar = () => {
  alert('頭像上傳功能開發中...')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto max-w-6xl px-4">
      <!-- 頁面標題 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">個人中心</h1>
        <p class="mt-2 text-gray-600">管理您的個人資料和設定</p>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <!-- 側邊欄 -->
        <div class="lg:col-span-1">
          <div class="sticky top-4 rounded-xl bg-white p-6 shadow-sm">
            <!-- 用戶資訊卡片 -->
            <div class="mb-6 text-center">
              <div class="relative inline-block">
                <img
                  :src="user.avatar || 'https://via.placeholder.com/120'"
                  alt="頭像"
                  class="h-24 w-24 rounded-full border-4 border-gray-100 object-cover" />
                <button
                  @click="uploadAvatar"
                  class="absolute right-0 bottom-0 rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <h3 class="mt-4 font-semibold text-gray-800">
                {{ user.name || user.userName || '用戶' }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ user.email || user.userEmail || 'user@example.com' }}
              </p>
            </div>

            <!-- 統計數據 -->
            <div class="mb-6 grid grid-cols-2 gap-3 border-b pb-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ stats.posts }}</div>
                <div class="text-xs text-gray-500">貼文</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ stats.pets }}</div>
                <div class="text-xs text-gray-500">寵物</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">{{ stats.followers }}</div>
                <div class="text-xs text-gray-500">粉絲</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-orange-600">{{ stats.following }}</div>
                <div class="text-xs text-gray-500">追蹤</div>
              </div>
            </div>

            <!-- 選單列表 -->
            <nav class="space-y-2">
              <button
                v-for="item in menuItems"
                :key="item.id"
                @click="switchTab(item.id)"
                :class="[
                  'flex w-full items-center space-x-3 rounded-lg px-4 py-3 transition',
                  item.active
                    ? 'bg-blue-50 font-medium text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50',
                ]">
                <span class="text-xl">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </button>
            </nav>

            <!-- 登出按鈕 -->
            <button
              @click="logout"
              class="mt-6 flex w-full items-center justify-center space-x-2 rounded-lg bg-red-50 px-4 py-3 text-red-600 transition hover:bg-red-100">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>登出</span>
            </button>
          </div>
        </div>

        <!-- 主要內容區 -->
        <div class="lg:col-span-3">
          <!-- 個人資料 -->
          <div v-if="activeTab === 'profile'" class="rounded-xl bg-white p-6 shadow-sm">
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-800">個人資料</h2>
              <button
                v-if="!isEditing"
                @click="startEdit"
                class="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                編輯資料
              </button>
            </div>

            <!-- 顯示模式 -->
            <div v-if="!isEditing" class="space-y-4">
              <div class="flex items-start">
                <div class="w-32 font-medium text-gray-500">姓名</div>
                <div class="flex-1 text-gray-800">{{ user.name || user.userName || '未設定' }}</div>
              </div>
              <div class="flex items-start">
                <div class="w-32 font-medium text-gray-500">電子郵件</div>
                <div class="flex-1 text-gray-800">
                  {{ user.email || user.userEmail || '未設定' }}
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-32 font-medium text-gray-500">電話</div>
                <div class="flex-1 text-gray-800">{{ user.phone || '未設定' }}</div>
              </div>
              <div class="flex items-start">
                <div class="w-32 font-medium text-gray-500">個人簡介</div>
                <div class="flex-1 text-gray-800">
                  {{ user.bio || '這個人很神秘，還沒有寫簡介...' }}
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-32 font-medium text-gray-500">註冊時間</div>
                <div class="flex-1 text-gray-800">{{ user.createdAt || '2024-01-01' }}</div>
              </div>
            </div>

            <!-- 編輯模式 -->
            <div v-else class="space-y-5">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">姓名</label>
                <input
                  v-model="editForm.name"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="請輸入姓名" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">電子郵件</label>
                <input
                  v-model="editForm.email"
                  type="email"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="請輸入電子郵件" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">電話</label>
                <input
                  v-model="editForm.phone"
                  type="tel"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="請輸入電話號碼" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">個人簡介</label>
                <textarea
                  v-model="editForm.bio"
                  rows="4"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="介紹一下自己吧..."></textarea>
              </div>

              <!-- 按鈕組 -->
              <div class="flex space-x-3 pt-4">
                <button
                  @click="saveProfile"
                  class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                  保存變更
                </button>
                <button
                  @click="cancelEdit"
                  class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50">
                  取消
                </button>
              </div>
            </div>
          </div>

          <!-- 我的寵物 -->
          <div v-if="activeTab === 'pets'" class="rounded-xl bg-white p-6 shadow-sm">
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-800">我的寵物</h2>
              <button
                class="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700">
                ➕ 新增寵物
              </button>
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="rounded-lg border border-gray-200 p-4 transition hover:shadow-md">
                <div class="flex items-center space-x-4">
                  <img
                    src="https://via.placeholder.com/80"
                    alt="寵物"
                    class="h-20 w-20 rounded-lg object-cover" />
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-800">小白</h3>
                    <p class="text-sm text-gray-500">品種：柴犬 • 年齡：2歲</p>
                    <p class="mt-1 text-xs text-gray-400">健康狀況：良好</p>
                  </div>
                </div>
              </div>
              <div class="rounded-lg border border-gray-200 p-4 transition hover:shadow-md">
                <div class="flex items-center space-x-4">
                  <img
                    src="https://via.placeholder.com/80"
                    alt="寵物"
                    class="h-20 w-20 rounded-lg object-cover" />
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-800">咪咪</h3>
                    <p class="text-sm text-gray-500">品種：英短 • 年齡：1歲</p>
                    <p class="mt-1 text-xs text-gray-400">健康狀況：良好</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 我的貼文 -->
          <div v-if="activeTab === 'posts'" class="rounded-xl bg-white p-6 shadow-sm">
            <h2 class="mb-6 text-xl font-semibold text-gray-800">我的貼文</h2>
            <div class="space-y-4">
              <div class="rounded-lg border border-gray-200 p-4 transition hover:shadow-md">
                <h3 class="mb-2 font-semibold text-gray-800">分享我家狗狗的日常 🐕</h3>
                <p class="mb-3 text-sm text-gray-600">今天帶小白去公園玩，牠超開心的！</p>
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <span>2024-05-15</span>
                  <div class="flex space-x-4">
                    <span>❤️ 45</span>
                    <span>💬 12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 收藏清單 -->
          <div v-if="activeTab === 'favorites'" class="rounded-xl bg-white p-6 shadow-sm">
            <h2 class="mb-6 text-xl font-semibold text-gray-800">收藏清單</h2>
            <p class="py-8 text-center text-gray-500">還沒有收藏任何內容</p>
          </div>

          <!-- 帳號設定 -->
          <div v-if="activeTab === 'settings'" class="rounded-xl bg-white p-6 shadow-sm">
            <h2 class="mb-6 text-xl font-semibold text-gray-800">帳號設定</h2>
            <div class="space-y-6">
              <div class="border-b pb-6">
                <h3 class="mb-3 font-medium text-gray-800">隱私設定</h3>
                <div class="space-y-3">
                  <label class="flex cursor-pointer items-center justify-between">
                    <span class="text-gray-700">公開個人資料</span>
                    <input type="checkbox" checked class="h-5 w-5 rounded text-blue-600" />
                  </label>
                  <label class="flex cursor-pointer items-center justify-between">
                    <span class="text-gray-700">顯示在線狀態</span>
                    <input type="checkbox" checked class="h-5 w-5 rounded text-blue-600" />
                  </label>
                </div>
              </div>
              <div class="border-b pb-6">
                <h3 class="mb-3 font-medium text-gray-800">通知設定</h3>
                <div class="space-y-3">
                  <label class="flex cursor-pointer items-center justify-between">
                    <span class="text-gray-700">接收郵件通知</span>
                    <input type="checkbox" checked class="h-5 w-5 rounded text-blue-600" />
                  </label>
                  <label class="flex cursor-pointer items-center justify-between">
                    <span class="text-gray-700">接收推送通知</span>
                    <input type="checkbox" class="h-5 w-5 rounded text-blue-600" />
                  </label>
                </div>
              </div>
              <div>
                <h3 class="mb-3 font-medium text-gray-800">危險操作</h3>
                <button
                  class="w-full rounded-lg bg-red-50 px-4 py-2 text-red-600 transition hover:bg-red-100">
                  刪除帳號
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定義樣式 */
</style>
