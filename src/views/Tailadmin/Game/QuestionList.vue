<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import Modal from '@/components/Tailadmin/ui/Modal.vue'

const questions = ref([])
const isLoading = ref(false)
const selectedType = ref('全部')
const isSubmitting = ref(false)
const isModalOpen = ref(false)

// 編輯
const isEditMode = ref(false)
const editingId = ref(null)

//  1. 定義初始狀態函數，方便重複使用
const getInitialQuestionState = () => ({
  GameName: '',
  Questions: '',
  AnswersDetail: '',
  Answers: 1, // 預設為 1 (是)
  IsActive: true, // 預設為啟用
  Rewards: 10, // 預設為 10 點
  Type: '問答', // 預設為問答
})

// 初始化資料
const newQuestion = ref(getInitialQuestionState())

// 自動提取不重複的分類清單
const gameCategories = computed(() => {
  const names = questions.value.map((q) => q.gameName)
  const uniqueNames = [...new Set(names)]
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
  isLoading.value = true
  try {
    const response = await axios.get('https://localhost:7048/api/Questions')
    if (response.data && response.data.success) {
      questions.value = response.data.data.questionContent
    } else {
      questions.value = response.data
    }
  } catch (error) {
    console.error('抓取失敗:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchQuestions()
})

// 監聽題目形式變化，切換時重置答案
watch(
  () => newQuestion.value.Type,
  () => {
    newQuestion.value.Answers = 1
  },
)

//  2. 修改後的 Modal 關閉函數：關閉即清空
const closeModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  editingId.value = null
  newQuestion.value = getInitialQuestionState()
}

const openModal = (item = null) => {
  if (item && item.gameId) {
    // 進入編輯模式
    isEditMode.value = true
    editingId.value = item.id || item.gameId

    // 將現有資料帶入表單 (注意屬性大小寫要對齊你的 DTO)
    newQuestion.value = {
      GameName: item.gameName || '',
      Questions: item.questions || '',
      AnswersDetail: item.answersDetail || '',
      Answers: Number(item.answers), // 強制轉數字以匹配 select
      IsActive: item.isActive,
      Rewards: Number(item.rewards), // 強制轉數字
      Type: item.type || '問答',
    }
  } else {
    // 進入新增模式
    isEditMode.value = false
    editingId.value = null
    newQuestion.value = getInitialQuestionState()
  }
  isModalOpen.value = true
}

// 儲存題目的處理
const saveQuestion = async () => {
  // 注意：這裡檢查要用大寫 GameName，因為你的 ref 定義是大寫
  if (!newQuestion.value.GameName || !newQuestion.value.Questions) {
    alert('請填寫必填欄位 (題目類型與內容)')
    console.log('驗證失敗，目前的資料：', newQuestion.value) // 除錯
    return
  }

  isSubmitting.value = true

  try {
    let response

    // 準備要發送的資料
    const payload = {
      GameId: isEditMode.value ? editingId.value : 0,
      GameName: newQuestion.value.GameName,
      Questions: newQuestion.value.Questions,
      AnswersDetail: newQuestion.value.AnswersDetail,
      Answers: newQuestion.value.Answers,
      IsActive: newQuestion.value.IsActive,
      Rewards: newQuestion.value.Rewards,
      Type: newQuestion.value.Type,
    }
    console.log('準備發送的資料:', payload)

    if (isEditMode.value) {
      // 編輯模式：使用 PUT 請求
      response = await axios.put(
        `https://localhost:7048/api/Questions/${editingId.value}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    } else {
      // 新增模式：使用 POST 請求
      console.log(`新增模式 - 發送 POST 請求到: https://localhost:7048/api/Questions`)
      response = await axios.post('https://localhost:7048/api/Questions', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    console.log('API 回應:', response.data)

    if (response.data && response.data.success) {
      const successMessage = isEditMode.value ? '資料已成功修改！' : '資料已成功存入資料庫！'
      alert(successMessage)
      closeModal() // 自動執行清空邏輯
      await fetchQuestions()
    } else {
      const errorMessage = response.data?.message || '未知錯誤'
      alert('儲存失敗：' + errorMessage)
      console.error('儲存失敗詳情:', response.data)
    }
  } catch (error) {
    console.error('完整錯誤訊息:', error)

    // 詳細的錯誤診斷
    if (error.response) {
      // 伺服器有回應，但狀態碼表示錯誤
      console.error('HTTP 狀態碼:', error.response.status)
      console.error('伺服器回應:', error.response.data)
      alert(
        `伺服器錯誤 (${error.response.status})：${error.response.data?.message || '請檢查伺服器日誌'}`,
      )
    } else if (error.request) {
      // 請求已發送但沒有收到回應
      console.error('未收到伺服器回應:', error.request)
      alert('無法連線到伺服器，請檢查：\n1. 後端服務是否正在運行\n2. URL 是否正確\n3. 防火牆設置')
    } else {
      // 其他錯誤
      console.error('錯誤訊息:', error.message)
      alert('發生錯誤：' + error.message)
    }
  } finally {
    isSubmitting.value = false
  }
}
// 刪除題目
const deleteQuestion = async (id) => {
  if (!confirm('確定要刪除此題目嗎？')) {
    return
  }

  try {
    console.log(`刪除題目 ID: ${id}`)
    const response = await axios.delete(`https://localhost:7048/api/Questions/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('刪除回應:', response.data)

    if (response.data && response.data.success) {
      alert('題目已成功刪除！')
      await fetchQuestions()
    } else {
      alert('刪除失敗：' + (response.data?.message || '未知錯誤'))
    }
  } catch (error) {
    console.error('刪除失敗:', error)
    if (error.response) {
      alert(
        `刪除失敗 (${error.response.status})：${error.response.data?.message || '請檢查伺服器日誌'}`,
      )
    } else if (error.request) {
      alert('無法連線到伺服器')
    } else {
      alert('刪除失敗：' + error.message)
    }
  }
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
                    : 'text-warning-950 bg-brand-error-500'
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
                  @click="openModal(item)"
                  class="bg-brand-warning-800 text-theme-sm hover:bg-brand-warning-900 shadow-theme-sm text-warning-950 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold transition-all active:scale-95">
                  編輯
                </button>
                <button
                  @click="deleteQuestion(item.gameId)"
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
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-500">
            {{ isEditMode ? '編輯題目' : '新增題目' }}
          </h3>
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
            <select
              v-model="newQuestion.GameName"
              class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none dark:bg-gray-900 dark:text-gray-500">
              <option value="" disabled>請選擇既有類型</option>
              <!-- 使用 v-for 跑原本篩選用的 gameCategories，但排除「全部」 -->
              <option
                v-for="cat in gameCategories.filter((c) => c !== '全部')"
                :key="cat"
                :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <!-- 題目內容 -->
          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-700 dark:text-gray-500">
              題目內容
              <span class="text-error-500">*</span>
            </label>
            <textarea
              v-model="newQuestion.Questions"
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
                <!-- <option value="多選">多選</option> -->
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
              v-model="newQuestion.AnswersDetail"
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
              <select
                v-model.number="newQuestion.Rewards"
                class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none dark:bg-gray-900 dark:text-gray-500">
                <option :value="10">10 點</option>
                <option :value="20">20 點</option>
                <option :value="30">30 點</option>
              </select>
            </div>

            <!-- 啟用狀態 (改回 Select 方式) -->
            <div>
              <label class="text-theme-sm mb-1 block font-medium text-gray-700 dark:text-gray-500">
                啟用狀態
                <span class="text-error-500">*</span>
              </label>
              <select
                v-model="newQuestion.IsActive"
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
            {{ isSubmitting ? '處理中...' : isEditMode ? '確認修改' : '確認新增' }}
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
