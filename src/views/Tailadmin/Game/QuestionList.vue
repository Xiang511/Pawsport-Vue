<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import Modal from '@/components/Tailadmin/ui/Modal.vue'

const questions = ref([])
// 定義存取資料中的狀態
const isLoading = ref(false)
const selectedType = ref('全部')
// 定義儲存狀態
const isSubmitting = ref(false)
// 自動提取不重複的分類清單
const gameCategories = computed(() => {
  // 從 questions 陣列中取出所有的 gameName
  const names = questions.value.map((q) => q.gameName)

  // 使用 Set 來過濾重複項，並轉回陣列
  const uniqueNames = [...new Set(names)]

  // 回傳包含「全部」的清單
  return ['全部', ...uniqueNames]
})
// 篩選資料
const filteredQuestions = computed(() => {
  if (selectedType.value === '全部') {
    return questions.value
  }
  return questions.value.filter((q) => q.gameName === selectedType.value)
})
// 取資料
const fetchQuestions = async () => {
  console.log('嘗試發送請求...')
  isLoading.value = true
  try {
    // 替換後端 API 路徑
    const response = await axios.get('https://localhost:7048/api/Questions')

    console.log('成功收到回應！回應內容如下：', response.data)

    if (response.data && response.data.success) {
      console.log('偵測到包裝格式，提取 data 欄位')
      questions.value = response.data.data.questionContent
      console.log(questions.value)
    } else {
      console.log('偵測到直接陣列格式')
      questions.value = response.data
    }
  } catch (error) {
    console.error('X. 抓取失敗，錯誤細節:', error)
    if (error.response) {
      console.error('後端回傳了錯誤狀態碼:', error.response.status)
    } else if (error.request) {
      console.error('請求已發出，但沒收到回應 (可能是後端沒開或網址錯了)')
    }
    alert('無法取得資料，請檢查主控台紅字')
  } finally {
    isLoading.value = false
    console.log('請求流程結束')
  }
}
// 元件掛載時執行
onMounted(() => {
  console.log('0. 元件掛載完成，準備執行 fetchQuestions')
  fetchQuestions()
})

// 4. 新增題目的處理
const saveQuestion = async () => {
  // 簡單的表單驗證
  if (!newQuestion.value.gameName || !newQuestion.value.questions) {
    alert('請填寫必填欄位 (題目類型與內容)')
    return
  }

  isSubmitting.value = true
  try {
    console.log('準備送出的資料：', newQuestion.value)

    const response = await axios.post('https://localhost:7048/api/Questions', newQuestion.value)

    // 根據你的 API 回傳結構 (success, message, data)
    if (response.data.success) {
      alert('資料已成功存入資料庫！')
      closeModal() // 關閉視窗

      // 重置表單內容
      newQuestion.value = {
        GameName: '',
        Questions: '',
        AnswersDetail: '',
        Answers: 1,
        IsActive: true,
        Rewards: 0,
        Type: '問答',
      }

      // 重要：重新抓取列表，讓新資料出現在畫面上
      await fetchQuestions()
    } else {
      alert('儲存失敗：' + response.data.message)
    }
  } catch (error) {
    console.error('API 錯誤：', error)
    alert('連線伺服器失敗，請檢查後端是否正常運作')
  } finally {
    isSubmitting.value = false
  }
}

// Modal 開/關
const isModalOpen = ref(false)
const newQuestion = ref({
  GameName: '',
  Questions: '',
  AnswersDetail: '',
  Answers: 1,
  IsActive: true,
  Rewards: 0,
  Type: '問答',
})
// 監聽題目形式變化，切換時重置答案為 1，避免殘留舊資料
watch(
  () => newQuestion.value.Type,
  (newType) => {
    newQuestion.value.Answers = 1
  },
)
const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <!-- 頁面頂部：標題 + 新增按鈕 + 篩選功能 -->
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-500">題庫管理</h2>

      <div class="flex items-center gap-2">
        <span class="text-theme-sm font-medium whitespace-nowrap text-gray-500">
          按照題目類型篩選：
        </span>
        <select
          v-model="selectedType"
          class="text-theme-sm focus:border-brand-info-500 focus:shadow-focus-ring rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-gray-700 transition-all outline-none">
          <option v-for="cat in gameCategories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>
    <button
      @click="openModal"
      class="bg-brand-info-500 text-theme-sm hover:bg-brand-info-600 shadow-theme-sm text-info-950 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold transition-all active:scale-95">
      新增題目
    </button>
  </div>

  <!-- 表格 -->
  <div
    class="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="max-w-full overflow-x-auto">
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr class="border-b border-gray-100 text-center dark:border-gray-800">
            <th
              class="text-theme-sm px-4 py-4 font-semibold tracking-wider text-gray-500 uppercase">
              編號
            </th>
            <th
              class="text-theme-sm px-4 py-4 font-semibold tracking-wider text-gray-500 uppercase">
              題目類型
            </th>
            <th
              class="text-theme-sm px-4 py-4 font-semibold tracking-wider text-gray-500 uppercase">
              題目內容
            </th>
            <th
              class="text-theme-sm px-4 py-4 font-semibold tracking-wider text-gray-500 uppercase">
              詳細解答
            </th>
            <th
              class="text-theme-sm px-4 py-4 font-semibold tracking-wider text-gray-500 uppercase">
              答案
            </th>
            <th
              class="text-theme-sm px-4 py-4 font-semibold tracking-wider text-gray-500 uppercase">
              狀態
            </th>
            <th
              class="text-theme-sm px-4 py-4 font-semibold tracking-wider text-gray-500 uppercase">
              獎勵
            </th>
            <th
              class="text-theme-sm px-4 py-4 font-semibold tracking-wider text-gray-500 uppercase">
              形式
            </th>
            <th
              class="text-theme-sm px-4 py-4 font-semibold tracking-wider text-gray-500 uppercase">
              動作
            </th>
          </tr>
        </thead>
        <tbody v-if="isLoading">
          <tr><td colspan="9" class="py-10 text-center text-gray-500">資料載入中...</td></tr>
        </tbody>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr
            v-for="(item, index) in filteredQuestions"
            :key="item.gameId"
            class="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
            <td class="text-theme-sm px-4 py-4 text-center text-gray-800 dark:text-white/90">
              {{ index + 1 }}
            </td>
            <td class="text-theme-sm px-4 py-4 text-center text-gray-500">{{ item.gameName }}</td>
            <td class="text-theme-sm max-w-xs px-4 py-4 text-left text-gray-500">
              {{ item.questions }}
            </td>
            <td class="text-theme-sm max-w-xs px-4 py-4 text-left text-gray-500">
              {{ item.answersDetail }}
            </td>
            <td class="px-4 py-4 text-center">
              <!-- 情況 A: 如果是問答題，顯示 是/否 -->
              <template v-if="item.type === '問答'">
                <span
                  :class="item.answers == 1 ? 'text-brand-info-600' : 'text-brand-error-400'"
                  class="font-medium">
                  {{ item.answers == 1 ? '是 (Y)' : '否 (N)' }}
                </span>
              </template>

              <!-- 情況 B: 如果是多選題，直接顯示選項數字 (例如 1, 2, 3, 4) -->
              <template v-else-if="item.type === '多選'">
                <span class="text-brand-info-600 font-medium">選項： {{ item.answers }}</span>
              </template>

              <!-- 其他情況 (保險起見) -->
              <template v-else>
                <span class="text-gray-500">{{ item.answers }}</span>
              </template>
            </td>
            <td class="px-4 py-4 text-center">
              <span
                :class="
                  item.isActive
                    ? 'text-brand-success-900 bg-brand-success-50'
                    : 'text-error-600 bg-error-50'
                "
                class="text-theme-sm rounded-full px-3 py-1 font-medium">
                {{ item.isActive ? '啟用' : '停用' }}
              </span>
            </td>
            <td class="text-theme-sm text-brand-info-600 px-4 py-4 text-center font-medium">
              {{ item.rewards }}
            </td>
            <td class="text-theme-sm text-brand-info-600 px-4 py-4 text-center font-medium">
              {{ item.type }}
            </td>
            <td class="px-4 py-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  class="bg-brand-warning-800 text-theme-sm hover:bg-brand-warning-900 shadow-theme-sm text-warning-950 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold transition-all active:scale-95">
                  編輯
                </button>
                <button
                  class="bg-brand-error-500 text-theme-sm hover:bg-brand-error-600 shadow-theme-sm text-warning-950 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold transition-all active:scale-95">
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal 新增題目-->
  <Modal v-if="isModalOpen" :fullScreenBackdrop="false" @close="closeModal">
    <template #body>
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" @click="closeModal"></div>
      <div
        class="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-500">新增題目</h3>
          <button @click="closeModal" class="text-gray-400 transition-colors hover:text-gray-600">
            <span class="text-2xl">&times;</span>
          </button>
        </div>

        <!-- Body (表單內容) -->
        <div class="custom-scrollbar max-h-[70vh] space-y-4 overflow-y-auto p-6">
          <!-- 題目類型 -->
          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-700 dark:text-gray-500">
              題目類型
              <span class="text-error-500">*</span>
            </label>
            <input
              v-model="newQuestion.gameName"
              type="text"
              placeholder="輸入題目類型"
              class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none dark:text-gray-500" />
          </div>

          <!-- 題目內容 -->
          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-700 dark:text-gray-500">
              題目內容
              <span class="text-error-500">*</span>
            </label>
            <textarea
              v-model="newQuestion.questions"
              rows="3"
              placeholder="輸入題目內容"
              class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none dark:text-gray-500"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- 題目形式 (唯讀範例) -->
            <div>
              <label class="text-theme-sm mb-1 block font-medium text-gray-700 dark:text-gray-500">
                題目形式
                <span class="text-error-500">*</span>
              </label>
              <select
                v-model="newQuestion.Type"
                class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none dark:bg-gray-900 dark:text-gray-500">
                <option value="問答">問答</option>
                <option value="多選">多選</option>
              </select>
            </div>
            <!-- 正確答案 (根據形式動態顯示) -->
            <div>
              <label class="text-theme-sm mb-1 block font-medium text-gray-700 dark:text-gray-500">
                正確答案
                <span class="text-error-500">*</span>
              </label>

              <!-- A 區塊：問答 -->
              <select
                v-if="newQuestion.Type === '問答'"
                v-model.number="newQuestion.Answers"
                class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 transition-all outline-none dark:text-gray-500">
                <option :value="1">是 (Yes)</option>
                <option :value="0">否 (No)</option>
              </select>

              <!-- B 區塊：多選 (如果 Type 不是問答，就顯示這個) -->
              <select
                v-else
                v-model.number="newQuestion.Answers"
                class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 transition-all outline-none dark:text-gray-500">
                <option :value="1">1</option>
                <option :value="2">2</option>
                <option :value="3">3</option>
                <option :value="4">4</option>
              </select>
            </div>
          </div>

          <!-- 詳細解答 -->
          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-700 dark:text-gray-500">
              詳細解答
              <span class="text-error-500">*</span>
            </label>
            <textarea
              v-model="newQuestion.answersDetail"
              rows="3"
              placeholder="輸入詳細解答"
              class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none dark:text-gray-500"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- 解題獎勵 -->
            <div>
              <label class="text-theme-sm mb-1 block font-medium text-gray-700 dark:text-gray-500">
                解題獎勵 (點數)
                <span class="text-error-500">*</span>
              </label>
              <input
                v-model.number="newQuestion.rewards"
                type="number"
                placeholder="輸入獎勵點數"
                class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 transition-all outline-none dark:text-gray-500" />
            </div>

            <!-- 啟用狀態 (改回 Select 方式) -->
            <div>
              <label class="text-theme-sm mb-1 block font-medium text-gray-700 dark:text-gray-500">
                啟用狀態
                <span class="text-error-500">*</span>
              </label>
              <select
                v-model="newQuestion.isActive"
                class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 transition-all outline-none dark:text-gray-500">
                <option :value="true">啟用</option>
                <option :value="false">停用</option>
              </select>
            </div>
          </div>
        </div>
        <!-- Footer -->
        <div
          class="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          <button
            @click="saveQuestion"
            :disabled="isSubmitting"
            class="bg-brand-info-500 text-info-950 flex items-center gap-2 rounded-lg px-5 py-2 font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
            <!-- 如果正在傳輸，顯示一個簡單的小轉圈或文字 -->
            <span v-if="isSubmitting" class="animate-spin text-lg">⏳</span>
            {{ isSubmitting ? '處理中...' : '確認新增' }}
          </button>
          <button
            @click="closeModal"
            class="text-theme-sm rounded-lg border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-700 hover:bg-gray-50 active:scale-95">
            取消
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>
