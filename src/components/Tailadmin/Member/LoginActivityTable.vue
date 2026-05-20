<script setup>
import { ref, onMounted, reactive, computed, nextTick } from 'vue'
import request from '@/api/axios'
import { CheckCircle, XCircle, X, MapPin } from 'lucide-vue-next'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

const loginActivities = reactive([])
const search = ref('')
const sortDirection = ref('desc') // 預設降序（最新的在前）
const currentPage = ref(1)
const perPage = ref(10)
const isLoading = ref(true)

// Modal 相關
const isModalOpen = ref(false)
const selectedActivity = ref(null)
const locationData = ref(null)
const mapCenter = ref([22.615, 120.2975]) // 預設高雄
const mapZoom = ref(13)
const mapKey = ref(0) // 用於強制重新渲染地圖

// 獲取成功的登入記錄
async function getSuccessfulLogins() {
  try {
    const response = await request.get('/Auth/logins/successful')
    console.log('========== 成功登入完整回應 ==========')
    console.log('response:', response)
    console.log('response.data:', response.data)
    console.log('response.data.data:', response.data?.data)
    console.log('=====================================')

    const { data } = response

    // API 返回格式：{ success, code, message, data: { data: [...], pagination: {...} } }
    const result = data?.data?.data || []

    if (!Array.isArray(result)) {
      console.warn('成功登入記錄不是陣列格式，實際類型:', typeof result, result)
      return []
    }

    console.log('成功登入記錄數量:', result.length)
    return result
  } catch (error) {
    console.error('獲取成功登入記錄失敗:', error)
    return []
  }
}

// 獲取失敗的登入記錄
async function getFailedLogins() {
  try {
    const response = await request.get('/Auth/logins/failed')
    console.log('========== 失敗登入完整回應 ==========')
    console.log('response:', response)
    console.log('response.data:', response.data)
    console.log('response.data.data:', response.data?.data)
    console.log('=====================================')

    const { data } = response

    // API 返回格式：{ success, code, message, data: { data: [...], pagination: {...} } }
    const result = data?.data?.data || []

    if (!Array.isArray(result)) {
      console.warn('失敗登入記錄不是陣列格式，實際類型:', typeof result, result)
      return []
    }

    console.log('失敗登入記錄數量:', result.length)
    return result
  } catch (error) {
    console.error('獲取失敗登入記錄失敗:', error)
    return []
  }
}

// 獲取所有登入活動
async function getAllLoginActivities() {
  isLoading.value = true
  try {
    const [successfulLogins, failedLogins] = await Promise.all([
      getSuccessfulLogins(),
      getFailedLogins(),
    ])

    console.log('成功登入陣列:', successfulLogins)
    console.log('失敗登入陣列:', failedLogins)

    // 標記成功的登入
    const successfulData = successfulLogins.map((item) => {
      console.log('處理成功登入項目:', item)
      return {
        ...item,
        status: 'success',
        timestamp: new Date(item.loginTime || item.timestamp || item.createdAt),
        userId: item.userId || item.userName || item.username || item.email || '未知使用者',
        name: item.userName || '',
        ipAddress: item.ipaddress || item.ipAddress || item.ip || '',
        userAgent: item.deviceInfo || item.userAgent || item.device || '',
        latitude: item.latitude || item.lat || null,
        longitude: item.longitude || item.lng || item.lon || null,
        city: item.city || '',
        country: item.country || item.country_name || '',
        region: item.region || '',
        reason: null,
      }
    })

    // 標記失敗的登入 - 從 deviceInfo 中提取失敗原因
    const failedData = failedLogins.map((item) => {
      console.log('處理失敗登入項目:', item)
      // deviceInfo 格式：'PostmanRuntime/7.51.1 | Reason: 帳號或密碼錯誤'
      const deviceInfo = item.deviceInfo || ''
      const [device, reasonPart] = deviceInfo.split(' | Reason: ')
      const reason = reasonPart || item.reason || item.failureReason || '未知原因'

      return {
        ...item,
        status: 'failed',
        timestamp: new Date(item.loginTime || item.attemptTime || item.timestamp || item.createdAt),
        userId: item.userId || item.userName || item.username || item.email || '未知使用者',
        name: item.userName || '',
        ipAddress: item.ipaddress || item.ipAddress || item.ip || '',
        userAgent: device || deviceInfo,
        latitude: item.latitude || item.lat || null,
        longitude: item.longitude || item.lng || item.lon || null,
        city: item.city || '',
        country: item.country || item.country_name || '',
        region: item.region || '',
        reason: reason,
      }
    })

    console.log('處理後的成功登入:', successfulData)
    console.log('處理後的失敗登入:', failedData)

    // 合併並按時間排序
    const allActivities = [...successfulData, ...failedData]
    console.log('合併後的活動數量:', allActivities.length)

    allActivities.sort((a, b) => {
      if (sortDirection.value === 'desc') {
        return b.timestamp - a.timestamp
      }
      return a.timestamp - b.timestamp
    })

    console.log('排序後的登入活動:', allActivities)

    // 清空並重新填充陣列
    loginActivities.splice(0, loginActivities.length, ...allActivities)
    console.log('最終 loginActivities 長度:', loginActivities.length)
  } catch (error) {
    console.error('獲取登入活動失敗:', error)
  } finally {
    isLoading.value = false
  }
}

// 過濾和搜尋
const filteredData = computed(() => {
  if (!search.value) return loginActivities

  const searchTerm = search.value.toLowerCase()
  return loginActivities.filter((item) => {
    const username = (item.userName || '').toLowerCase()
    const email = (item.email || '').toLowerCase()
    const ip = (item.ipAddress || '').toLowerCase()

    return username.includes(searchTerm) || email.includes(searchTerm) || ip.includes(searchTerm)
  })
})

// 分頁邏輯
const totalEntries = computed(() => filteredData.value.length)
const totalPages = computed(() => Math.ceil(totalEntries.value / perPage.value))
const startEntry = computed(() => (currentPage.value - 1) * perPage.value + 1)
const endEntry = computed(() => Math.min(currentPage.value * perPage.value, totalEntries.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredData.value.slice(start, end)
})

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 格式化日期時間
function formatDateTime(date) {
  if (!date) return '無資料'
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

// 切換排序方向
function toggleSort() {
  sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc'
  getAllLoginActivities()
}

// 打開 Modal 顯示 IP 位置
async function showLocationModal(activity) {
  selectedActivity.value = activity
  isModalOpen.value = true

  console.log('===== 打開位置 Modal =====')
  console.log('活動資料:', activity)
  console.log('IP 地址:', activity.ipAddress)
  console.log('緯度:', activity.latitude)
  console.log('經度:', activity.longitude)

  // 檢查是否為本地 IP
  const ip = activity.ipAddress
  const isLocal =
    ip === '::1' ||
    ip === '127.0.0.1' ||
    ip?.startsWith('192.168') ||
    ip?.startsWith('10.') ||
    ip?.startsWith('172.')

  // 直接使用活動數據中的位置資訊
  locationData.value = {
    ip: activity.ipAddress || '未知',
    city: activity.city || (isLocal ? '本地環境' : '未知'),
    region: activity.region || (isLocal ? '本地網路' : '未知'),
    country_name: activity.country || (isLocal ? '本地' : '未知'),
    latitude: activity.latitude || 25.033,
    longitude: activity.longitude || 121.5654,
    org: activity.org || (isLocal ? 'Local Network' : '未知'),
    timezone: activity.timezone || 'Asia/Taipei',
    isLocal: isLocal,
  }

  console.log('使用的位置資料:', locationData.value)

  // 設定地圖中心點
  if (locationData.value.latitude && locationData.value.longitude) {
    const newCenter = [locationData.value.latitude, locationData.value.longitude]
    console.log('設定新的地圖中心點:', newCenter)

    mapCenter.value = newCenter
    mapZoom.value = isLocal ? 13 : 10

    // 強制重新渲染地圖
    mapKey.value++

    console.log('地圖中心點已更新為:', mapCenter.value)
    console.log('地圖縮放層級:', mapZoom.value)
  } else {
    console.warn('位置資料缺少經緯度，使用預設位置')
    mapCenter.value = [25.033, 121.5654]
    mapZoom.value = 13
    mapKey.value++
  }
}

// 關閉 Modal
function closeModal() {
  isModalOpen.value = false
  selectedActivity.value = null
  locationData.value = null
  // 重置地圖為預設位置
  mapCenter.value = [22.615, 120.2975]
  mapZoom.value = 13
}

onMounted(() => {
  getAllLoginActivities()
})
</script>

<template>
  <div class="flex items-center justify-between border-b border-none px-1">
    <div class="pb-4">
      <h3 class="py-2 text-left text-lg font-semibold text-gray-800 dark:text-white/90">
        登入活動記錄
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        顯示成功和失敗的登入嘗試，共 {{ totalEntries }} 筆記錄
      </p>
    </div>
    <div class="flex gap-3.5">
      <div class="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
        <div class="relative">
          <span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                fill="" />
            </svg>
          </span>

          <input
            v-model="search"
            type="text"
            placeholder="搜尋使用者、信箱或IP..."
            class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
        </div>
      </div>
    </div>
  </div>

  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="custom-scrollbar max-w-full overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="w-min px-4 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">狀態</p>
            </th>
            <th class="w-max px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">使用者 ID</p>
            </th>
            <th class="w-1/12 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">名稱</p>
            </th>
            <th class="w-max px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">IP 地址</p>
            </th>
            <th
              class="w-max cursor-pointer px-2 py-3 text-left hover:bg-gray-50 sm:px-4 dark:hover:bg-gray-800/50"
              @click="toggleSort">
              <p
                class="text-theme-xs flex items-center gap-1 font-medium text-gray-500 dark:text-gray-400">
                登入時間
                <span class="text-xs">{{ sortDirection === 'desc' ? '↓' : '↑' }}</span>
              </p>
            </th>
            <th class="w-max px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">裝置/瀏覽器</p>
            </th>
            <th class="w-1/6 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">失敗原因</p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Skeleton Loading Rows -->
          <template v-if="isLoading">
            <tr
              v-for="i in perPage"
              :key="'skeleton-' + i"
              class="animate-pulse border-t border-gray-100 dark:border-gray-800">
              <td class="w-min px-4 py-4 text-left sm:px-4">
                <div class="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="w-max px-2 py-4 text-left sm:px-4">
                <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="w-1/12 px-2 py-4 text-left sm:px-4">
                <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="w-max px-2 py-4 text-left sm:px-4">
                <div class="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="w-max px-2 py-4 text-left sm:px-4">
                <div class="h-4 w-36 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="w-max px-2 py-4 text-left sm:px-4">
                <div class="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="w-1/6 px-2 py-4 text-left sm:px-4">
                <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
            </tr>
          </template>

          <!-- Actual Data Rows -->
          <template v-else>
            <tr
              v-if="paginatedData.length === 0"
              class="border-t border-gray-100 dark:border-gray-800">
              <td colspan="7" class="px-4 py-8 text-center">
                <p class="text-sm text-gray-500 dark:text-gray-400">暫無登入記錄</p>
              </td>
            </tr>
            <tr
              v-else
              v-for="(activity, index) in paginatedData"
              :key="index"
              class="border-t border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
              <td class="w-min px-4 py-4 text-left sm:px-4">
                <div class="flex items-center justify-center">
                  <CheckCircle
                    v-if="activity.status === 'success'"
                    class="text-green-500 dark:text-green-400"
                    :size="20" />
                  <XCircle v-else class="text-red-500 dark:text-red-400" :size="20" />
                </div>
              </td>
              <td class="w-max px-2 py-4 text-left sm:px-4">
                <button
                  @click="showLocationModal(activity)"
                  class="text-theme-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                  {{ activity.userId }}
                </button>
              </td>
              <td class="w-max px-2 py-4 text-left sm:px-4">
                <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                  {{ activity.name || '-' }}
                </p>
              </td>
              <td class="w-max px-2 py-4 text-left sm:px-4">
                <p class="text-theme-sm font-mono text-gray-500 dark:text-gray-400">
                  {{ activity.ipAddress }}
                </p>
              </td>
              <td class="w-max px-2 py-4 text-left sm:px-4">
                <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                  {{ formatDateTime(activity.timestamp) }}
                </p>
              </td>
              <td class="w-max px-2 py-4 text-left sm:px-4">
                <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                  {{ activity.userAgent }}
                </p>
              </td>
              <td class="w-max px-2 py-4 text-left sm:px-4">
                <p
                  v-if="activity.status === 'failed'"
                  class="text-theme-sm text-red-600 dark:text-red-400">
                  {{ activity.reason }}
                </p>
                <p v-else class="text-theme-sm text-gray-400 dark:text-gray-500">-</p>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="!isLoading && totalEntries > 0"
      class="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
      <div class="flex items-center gap-2">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          顯示 {{ startEntry }} 到 {{ endEntry }} 筆，共 {{ totalEntries }} 筆記錄
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
          上一頁
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              currentPage === page
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
            ]">
            {{ page }}
          </button>
        </div>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
          下一頁
        </button>
      </div>
    </div>
  </div>

  <!-- IP Location Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="closeModal">
        <div class="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-4 dark:border-gray-700">
            <div class="invisible flex items-center gap-3">
              <MapPin class="text-blue-600 dark:text-blue-400" :size="50" />
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white">登入位置資訊</h2>
            </div>
            <button
              @click="closeModal"
              class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
              <X :size="20" />
            </button>
          </div>

          <!-- Content -->
          <div v-if="locationData && selectedActivity" class="space-y-6">
            <!-- Info Cards -->
            <!-- <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p class="mb-1 text-xs text-blue-600 dark:text-blue-400">使用者 ID</p>
                <p class="font-semibold text-gray-800 dark:text-white">
                  {{ selectedActivity.userId }}
                </p>
              </div>
              <div class="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <p class="mb-1 text-xs text-green-600 dark:text-green-400">IP 地址</p>
                <p class="font-mono font-semibold text-gray-800 dark:text-white">
                  {{ locationData.ip }}
                </p>
              </div>
              <div class="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                <p class="mb-1 text-xs text-purple-600 dark:text-purple-400">城市</p>
                <p class="font-semibold text-gray-800 dark:text-white">
                  {{ locationData.city || '未知' }}
                </p>
              </div>
              <div class="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
                <p class="mb-1 text-xs text-orange-600 dark:text-orange-400">國家</p>
                <p class="font-semibold text-gray-800 dark:text-white">
                  {{ locationData.country_name || '未知' }}
                </p>
              </div>
            </div> -->

            <!-- Additional Info -->
            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 class="mb-3 font-semibold text-gray-800 dark:text-white">詳細資訊</h3>
              <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">地區：</span>
                  <span class="text-sm font-medium text-gray-800 dark:text-white">
                    {{ locationData.region || '未知' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">時區：</span>
                  <span class="text-sm font-medium text-gray-800 dark:text-white">
                    {{ locationData.timezone || '未知' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">ISP：</span>
                  <span class="text-sm font-medium text-gray-800 dark:text-white">
                    {{ locationData.org || '未知' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">座標：</span>
                  <span class="font-mono text-sm font-medium text-gray-800 dark:text-white">
                    {{ locationData.latitude?.toFixed(4) }},
                    {{ locationData.longitude?.toFixed(4) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">登入時間：</span>
                  <span class="text-sm font-medium text-gray-800 dark:text-white">
                    {{ formatDateTime(selectedActivity.timestamp) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">狀態：</span>
                  <span
                    :class="[
                      'text-sm font-medium',
                      selectedActivity.status === 'success'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400',
                    ]">
                    {{ selectedActivity.status === 'success' ? '成功' : '失敗' }}
                  </span>
                </div>
              </div>
              <div
                v-if="locationData.isLocal"
                class="mt-3 rounded bg-yellow-50 p-3 dark:bg-yellow-900/20">
                <p class="text-sm text-yellow-800 dark:text-yellow-200">
                  偵測到本地IP地址 採用預設位置顯示
                </p>
              </div>
            </div>

            <!-- Map -->
            <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="map">
                <l-map
                  :key="mapKey"
                  ref="map"
                  :zoom="mapZoom"
                  :center="mapCenter"
                  :use-global-leaflet="false">
                  <l-tile-layer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    layer-type="base"
                    name="OpenStreetMap"></l-tile-layer>
                  <l-marker :lat-lng="mapCenter">
                    <l-popup>
                      <div class="text-center">
                        <p class="font-semibold">{{ locationData.city }}</p>
                        <p class="text-sm text-gray-600">{{ locationData.country_name }}</p>
                        <p class="text-xs text-gray-500">{{ locationData.ip }}</p>
                      </div>
                    </l-popup>
                  </l-marker>
                </l-map>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
.map {
  height: 300px;
  width: 100%;
}
</style>
