<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Edit, Trash2, X } from 'lucide-vue-next'

const faqData = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

const loadFaqData = async (page = 1) => {
  try {
    const response = await fetch(`https://localhost:7048/api/Support/Faq?page=${page}&pageSize=10`)

    if (response.ok) {
      const result = await response.json()
      console.log('後端回傳的完整資料：', result)
      faqData.value = result.data.items
      currentPage.value = result.data.currentPage
      totalPages.value = result.data.totalPages
    } else {
      console.error('伺服器發生錯誤')
    }
  } catch (error) {
    console.error('無法連線到API:', error)
  }
}

// 換頁功能：點擊按鈕時呼叫這個方法
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
    loadFaqData(newPage) // 重新向後端要新一頁的資料
  }
}

// onMounted：當這個Vue網頁一載入完成時，請幫我執行裡面的程式
onMounted(() => {
  loadFaqData(1) // 網頁載入時，預設讀取第1頁
})

const getStatusText = (status) => {
  return status ? status : '未知'
}

const getStatusStyle = (status) => {
  if (status === '已發佈') {
    return 'bg-brand-success-600 text-white'
  } else if (status === '已下架') {
    return 'bg-brand-error-600 text-white'
  } else if (status === '待發佈') {
    return 'bg-brand-warning-400 text-yellow-900'
  } else {
    return 'bg-gray-400 text-white'
  }
}

// 新增
const showCreateModal = ref(false) // 控制視窗開啟/關閉
const isSubmitting = ref(false) // 防止連點

// 綁定表單的資料模型
const newFaq = reactive({
  questionType: '',
  question: '',
  answer: '',
  note: '', // 備註
})

const openCreateModal = () => {
  newFaq.questionType = ''
  newFaq.question = ''
  newFaq.answer = ''
  newFaq.note = ''
  showCreateModal.value = true
}

// 新增資料
const submitCreate = async () => {
  // 防呆驗證
  if (!newFaq.questionType || !newFaq.question || !newFaq.answer) {
    alert('請填寫必填欄位 (*)')
    return
  }

  isSubmitting.value = true
  try {
    const response = await fetch('https://localhost:7048/api/Support/Faq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        questionType: newFaq.questionType,
        question: newFaq.question,
        answer: newFaq.answer,
        note: newFaq.note,
      }),
    })

    if (response.ok) {
      // 成功後關閉視窗，並重新讀取第一頁資料
      showCreateModal.value = false
      loadFaqData(1)
      alert('新增成功！')
    } else {
      alert('新增失敗，請檢查資料格式')
    }
  } catch (error) {
    console.error('API 錯誤:', error)
    alert('無法連線到伺服器')
  } finally {
    isSubmitting.value = false
  }
}

// 修改
const showEditModal = ref(false)
const isEditing = ref(false)

// 綁定修改中的資料模型
const currentEditFaq = reactive({
  faqId: 0,
  questionType: '',
  question: '',
  answer: '',
  note: '',
  status: '',
})

const openEditModal = (item) => {
  currentEditFaq.faqid = item.faqid
  currentEditFaq.questionType = item.questionType
  currentEditFaq.question = item.question
  currentEditFaq.answer = item.answer || '' // 如果沒資料就塞空字串
  currentEditFaq.note = item.note || ''
  currentEditFaq.status = item.status || '待發佈'

  showEditModal.value = true
}

// 修改資料
const submitEdit = async () => {
  if (!currentEditFaq.questionType || !currentEditFaq.question || !currentEditFaq.answer) {
    alert('請填寫必填欄位 (*)')
    return
  }

  isEditing.value = true
  try {
    // 指定要改哪一筆
    const response = await fetch(`https://localhost:7048/api/Support/Faq/${currentEditFaq.faqId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionType: currentEditFaq.questionType,
        question: currentEditFaq.question,
        answer: currentEditFaq.answer,
        note: currentEditFaq.note,
        status: currentEditFaq.status,
      }),
    })

    if (response.ok) {
      showEditModal.value = false
      // 重新讀取當前這一頁的資料，而不是跳回第1頁
      loadFaqData(currentPage.value)
      alert('修改成功！')
    } else {
      alert('修改失敗，請檢查資料格式')
    }
  } catch (error) {
    console.error('API 錯誤:', error)
    alert('無法連線到伺服器')
  } finally {
    isEditing.value = false
  }
}

// 刪除
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const deleteTargetId = ref(null) // 用來記要刪哪一筆

// 點擊刪除時，打開確認視窗，並記下ID
const openDeleteModal = (id) => {
  deleteTargetId.value = id
  showDeleteModal.value = true
}

// 確定刪除
const submitDelete = async () => {
  if (!deleteTargetId.value) return

  isDeleting.value = true
  try {
    const response = await fetch(`https://localhost:7048/api/Support/Faq/${deleteTargetId.value}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      showDeleteModal.value = false
      // 刪除後，重新讀取當前頁面的資料
      loadFaqData(currentPage.value)
      alert('刪除成功！')
    } else {
      alert('刪除失敗，請檢查 API 設定')
    }
  } catch (error) {
    console.error('API 錯誤:', error)
    alert('無法連線到伺服器')
  } finally {
    isDeleting.value = false
    deleteTargetId.value = null
  }
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-black">常見問題管理</h2>
      <button
        @click="openCreateModal"
        class="bg-brand-success-500 text-theme-sm hover:bg-brand-success-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95"
        title="新增常見問題">
        <Plus class="h-5 w-5" />
      </button>
    </div>

    <div class="rounded-sm border border-gray-200 bg-white shadow-sm">
      <div class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-300 text-center">
              <th class="px-4 py-4 font-medium text-gray-700">NO.</th>
              <th class="px-4 py-4 font-medium text-gray-700">類型</th>
              <th class="max-w-64 px-4 py-4 font-medium text-gray-700">問題</th>
              <th class="px-4 py-4 font-medium text-gray-700">建立日期</th>
              <th class="px-4 py-4 text-center font-medium text-gray-700">狀態</th>
              <th class="px-4 py-4 text-center font-medium text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in faqData"
              :key="item.faqid"
              class="border-b border-gray-100 transition hover:bg-gray-200">
              <td class="px-4 py-3">{{ (currentPage - 1) * 10 + index + 1 }}</td>
              <td class="px-4 py-3">{{ item.questionType }}</td>
              <td class="max-w-64 truncate px-4 py-3" :title="item.question">
                {{ item.question }}
              </td>
              <td class="px-4 py-3">{{ item.createAt }}</td>

              <td class="px-4 py-3 text-center">
                <span
                  class="inline-block rounded-full px-3 py-1 text-sm font-medium"
                  :class="getStatusStyle(item.status)">
                  {{ getStatusText(item.status) }}
                </span>
              </td>

              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-3">
                  <button
                    @click="openEditModal(item)"
                    class="bg-brand-info-500 text-theme-xl hover:bg-brand-info-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95"
                    title="編輯">
                    <Edit class="h-5 w-5" />
                  </button>
                  <button
                    @click="openDeleteModal(item.faqid)"
                    class="bg-brand-error-500 text-theme-xl hover:bg-brand-error-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95"
                    title="刪除">
                    <Trash2 class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
        <span class="text-sm text-gray-700">
          目前顯示第
          <span class="font-medium">{{ currentPage }}</span>
          頁，共
          <span class="font-medium">{{ totalPages }}</span>
          頁
        </span>
        <div class="flex gap-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="hover:border-brand-info-500 hover:bg-brand-info-500 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700">
            上一頁
          </button>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="hover:border-brand-info-500 hover:bg-brand-info-500 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700">
            下一頁
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 新增 -->
  <div
    v-if="showCreateModal"
    class="bg-opacity-50 bg-brand-success-950 fixed inset-0 z-[9999] flex items-center justify-center px-4">
    <div class="mx-auto w-full max-w-2xl rounded-lg bg-white shadow-lg">
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h3 class="text-xl font-bold text-gray-800">新增項目</h3>
          <p class="mt-2 text-sm text-gray-500">
            ※請輸入常見問題項目
            <span class="text-red-500">* 必填 *</span>
          </p>
        </div>
        <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
          <X class="h-6 w-6" />
        </button>
      </div>

      <div class="space-y-4 p-6">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            類型
            <span class="text-red-500">*</span>
          </label>
          <select
            v-model="newFaq.questionType"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none">
            <option value="" disabled>-- 請選擇問題類型 --</option>
            <option value="帳號問題">帳號問題</option>
            <option value="領養諮詢">領養諮詢</option>
            <option value="互動遊戲">互動遊戲</option>
            <option value="健康護照">健康護照</option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            問題
            <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            v-model="newFaq.question"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            回答
            <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="newFaq.answer"
            rows="4"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"></textarea>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">備註</label>
          <textarea
            v-model="newFaq.note"
            rows="2"
            placeholder="若沒有，請寫「無」"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"></textarea>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <button
          @click="showCreateModal = false"
          class="bg-brand-error-500 hover:bg-brand-error-600 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-all active:scale-95">
          取消並返回
        </button>

        <button
          @click="submitCreate"
          :disabled="isSubmitting"
          class="bg-brand-info-500 hover:bg-brand-info-600 flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-50">
          <span v-if="isSubmitting">處理中...</span>
          <span v-else>確認新增</span>
        </button>
      </div>
    </div>
  </div>

  <!-- 修改 -->
  <div
    v-if="showEditModal"
    class="bg-opacity-50 fixed inset-0 z-[9999] mt-7 flex items-center justify-center bg-gray-900 px-4">
    <div class="mx-auto w-full max-w-2xl rounded-lg bg-white shadow-lg">
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h3 class="text-xl font-bold text-gray-800">修改項目</h3>
          <p class="mt-2 text-sm text-gray-500">
            ※請修改常見問題內容
            <span class="text-red-500">* 必填 *</span>
          </p>
        </div>
        <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
          <X class="h-6 w-6" />
        </button>
      </div>

      <div class="space-y-4 p-6">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            類型
            <span class="text-red-500">*</span>
          </label>
          <select
            v-model="currentEditFaq.questionType"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none">
            <option value="帳號問題">帳號問題</option>
            <option value="領養諮詢">領養諮詢</option>
            <option value="互動遊戲">互動遊戲</option>
            <option value="健康護照">健康護照</option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            問題
            <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            v-model="currentEditFaq.question"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            回答
            <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="currentEditFaq.answer"
            rows="4"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"></textarea>
        </div>

        <div class="h-2"></div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">備註</label>
          <textarea
            v-model="currentEditFaq.note"
            rows="2"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"></textarea>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            發佈狀態
            <span class="text-red-500">*</span>
          </label>
          <select
            v-model="currentEditFaq.status"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none">
            <option value="待發佈">待發佈</option>
            <option value="已發佈">已發佈</option>
            <option value="已下架">已下架</option>
          </select>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <button
          @click="showEditModal = false"
          class="bg-brand-error-500 hover:bg-brand-error-600 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-all active:scale-95">
          取消修改並返回
        </button>

        <button
          @click="submitEdit"
          :disabled="isEditing"
          class="bg-brand-info-500 hover:bg-brand-info-600 flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-50">
          <span v-if="isEditing">處理中...</span>
          <span v-else>確認修改</span>
        </button>
      </div>
    </div>
  </div>

  <!-- 刪除 -->
  <div
    v-if="showDeleteModal"
    class="bg-opacity-50 fixed inset-0 z-[9999] flex items-center justify-center bg-black px-4">
    <div class="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
      <div class="p-6 text-center">
        <div
          class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <Trash2 class="text-brand-error-500 h-8 w-8" />
        </div>

        <h3 class="mb-2 text-xl font-bold text-gray-800">確定要刪除嗎？</h3>
        <p class="text-sm text-gray-500">此動作執行後將無法復原，請確認是否繼續。</p>
      </div>

      <div class="flex items-center justify-center gap-4 bg-gray-50 px-6 py-4">
        <button
          @click="showDeleteModal = false"
          class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95">
          取消
        </button>

        <button
          @click="submitDelete"
          :disabled="isDeleting"
          class="bg-brand-error-500 hover:bg-brand-error-600 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-50">
          <span v-if="isDeleting">處理中...</span>
          <span v-else>確定刪除</span>
        </button>
      </div>
    </div>
  </div>
</template>
