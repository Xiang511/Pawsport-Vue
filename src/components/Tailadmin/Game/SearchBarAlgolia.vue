<script setup>
import { ref, watch, computed } from 'vue'
import { useAlgoliaSearch } from '@/composables/useAlgoliaSearch'

const emit = defineEmits(['search', 'select'])

// 使用 Algolia 搜尋
const { query, hits, isLoading, error, nbHits, clearResults } = useAlgoliaSearch()

// 控制下拉選單顯示
const showDropdown = ref(false)
const searchInput = ref(null)

// 當輸入框獲得焦點時顯示下拉選單
const handleFocus = () => {
  if (query.value && hits.value.length > 0) {
    showDropdown.value = true
  }
}

// 當輸入框失焦時隱藏下拉選單（延遲以允許點擊結果）
const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

// 當有搜尋結果時自動顯示下拉選單
watch(hits, (newHits) => {
  showDropdown.value = newHits.length > 0
})

// 選擇搜尋結果
const selectResult = (hit) => {
  query.value = hit.name || hit.title || ''
  showDropdown.value = false
  emit('select', hit)
  emit('search', hit)
}

// Enter 鍵搜尋
const handleEnter = () => {
  showDropdown.value = false
  emit('search', { query: query.value, hits: hits.value })
}

// 清空搜尋
const handleClear = () => {
  clearResults()
  emit('search', { query: '', hits: [] })
}

// 高亮搜尋關鍵字
const highlightMatch = (text, searchQuery) => {
  if (!text || !searchQuery) return text

  const regex = new RegExp(`(${searchQuery})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')
}
</script>

<template>
  <div class="relative hidden lg:block">
    <div class="relative">
      <!-- 搜尋圖示 -->
      <div class="absolute top-1/2 left-4 -translate-y-1/2">
        <svg
          v-if="!isLoading"
          class="fill-gray-500 dark:fill-gray-400"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" />
        </svg>

        <!-- 載入中動畫 -->
        <svg
          v-else
          class="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- 輸入框 -->
      <input
        ref="searchInput"
        type="text"
        placeholder="請輸入關鍵字"
        v-model="query"
        @keyup.enter="handleEnter"
        @focus="handleFocus"
        @blur="handleBlur"
        class="dark:bg-dark-900 focus:border-theme-info-300 focus:ring-brand-500/10 dark:focus:border-theme-info-800 h-11 w-full rounded-full border border-gray-200 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[430px] dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30" />

      <!-- 清除按鈕 -->
      <button
        v-if="query"
        @click="handleClear"
        class="absolute top-1/2 right-4 -translate-y-1/2 text-xl leading-none text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        &times;
      </button>
    </div>

    <!-- 搜尋結果下拉選單 -->
    <div
      v-if="showDropdown"
      class="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg xl:w-[430px] dark:border-gray-800 dark:bg-gray-900">
      <!-- 錯誤訊息 -->
      <div v-if="error" class="p-4 text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </div>

      <!-- 無結果 -->
      <div
        v-else-if="!isLoading && hits.length === 0 && query"
        class="p-4 text-sm text-gray-500 dark:text-gray-400">
        找不到符合「{{ query }}」的結果
      </div>

      <!-- 搜尋結果列表 -->
      <div v-else-if="hits.length > 0">
        <!-- 結果數量提示 -->
        <div
          class="border-b border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          找到 {{ nbHits }} 個結果
        </div>

        <!-- 結果項目 -->
        <button
          v-for="hit in hits"
          :key="hit.objectID"
          @click="selectResult(hit)"
          class="w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
          <div class="flex items-center gap-3">
            <!-- 頭像（如果有） -->
            <div
              v-if="hit.avatar"
              class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <img :src="hit.avatar" :alt="hit.name" class="h-full w-full object-cover" />
            </div>

            <!-- 預設頭像 -->
            <div
              v-else
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-bold text-white">
              {{ (hit.name || hit.title || '?')[0].toUpperCase() }}
            </div>

            <!-- 資訊 -->
            <div class="min-w-0 flex-1">
              <div
                class="truncate text-sm font-medium text-gray-900 dark:text-white"
                v-html="highlightMatch(hit.name || hit.title || 'Unknown', query)"></div>
              <div
                v-if="hit.id || hit.email"
                class="truncate text-xs text-gray-500 dark:text-gray-400"
                v-html="highlightMatch(hit.id || hit.email || '', query)"></div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 滾動條樣式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.7);
}
</style>
