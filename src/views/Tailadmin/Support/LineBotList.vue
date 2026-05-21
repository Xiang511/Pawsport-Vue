<script setup>
import { ref, reactive, onMounted } from 'vue'
import { MessageCircle, Send, X, Bot } from 'lucide-vue-next'

const lineMessages = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)

// 讀取API
const loadLineMessages = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await fetch(`https://localhost:7048/api/LineBot?page=${page}`)
    if (response.ok) {
      const result = await response.json()

      lineMessages.value =
        result.data.items.map((item) => ({
          messageId: item.id,
          userName: `會員 ${item.userId}`,
          userId: item.userId,
          message: item.chatContent,
          createAt: formatDate(item.chatDate),
          status: item.status || '未回覆',
        })) || []

      totalPages.value = result.data.totalPages || 1
      currentPage.value = page
    }
  } catch (error) {
    console.error('取得 LINE 訊息失敗:', error)
  } finally {
    isLoading.value = false
  }
}

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
    loadLineMessages(newPage)
  }
}

onMounted(() => {
  loadLineMessages(1)
})

const getStatusStyle = (status) => {
  switch (status) {
    case '已回覆':
      return 'bg-brand-success-600 text-white'
    case '未回覆':
      return 'bg-brand-error-600 text-white'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const showReplyModal = ref(false)
const isSubmitting = ref(false)

const currentReply = reactive({
  messageId: 0,
  userName: '',
  userId: '', // LINE的UserID，未來串API回傳訊息時用
  userMessage: '',
  replyText: '',
})

const openReplyModal = (item) => {
  currentReply.messageId = item.messageId
  currentReply.userName = item.userName
  currentReply.userId = item.userId
  currentReply.userMessage = item.message
  currentReply.replyText = ''
  showReplyModal.value = true
}

const submitReply = async () => {
  if (!currentReply.replyText) {
    alert('請填寫回覆內容')
    return
  }

  isSubmitting.value = true
  try {
    // 呼叫C#的Reply API，網址帶上當前訊息的ID
    const response = await fetch(
      `https://localhost:7048/api/LineBot/${currentReply.messageId}/reply`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText: currentReply.replyText }),
      },
    )

    if (response.ok) {
      const result = await response.json()
      alert(`已成功發送 LINE 訊息給 ${currentReply.userName}！`)
      showReplyModal.value = false
      loadLineMessages()
    } else {
      alert('回覆發送失敗，請檢查後端狀態')
    }
  } catch (error) {
    console.error('API 錯誤:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 格式化日期時間的輔助函式
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
</script>

<template>
  <div class="relative p-6">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-800">
        <Bot class="h-6 w-6 text-[#06C755]" />
        LINE BOT 客服管理
      </h2>
    </div>

    <div class="rounded-sm border border-gray-200 bg-white shadow-sm">
      <div class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-300 text-center">
              <th class="w-20 px-3 py-4 font-bold text-gray-700">NO.</th>
              <th class="px-4 py-4 font-bold text-gray-700">收到時間</th>
              <th class="px-4 py-4 font-bold text-gray-700">LINE 暱稱</th>
              <th class="max-w-64 px-4 py-4 font-bold text-gray-700">訊息內容</th>
              <th class="px-4 py-4 text-center font-bold text-gray-700">狀態</th>
              <th class="w-32 px-4 py-4 text-center font-bold text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="5" class="py-8 text-center text-gray-500">資料載入中...</td>
            </tr>
            <tr
              v-for="(item, index) in lineMessages"
              :key="item.messageId"
              class="text-center transition-colors hover:bg-gray-200">
              <td class="px-3 py-4 text-center font-medium text-gray-700">
                {{ (currentPage - 1) * 10 + index + 1 }}
              </td>
              <td class="px-6 py-4">{{ item.createAt }}</td>
              <td class="px-6 py-4 font-medium text-gray-800">{{ item.userName }}</td>
              <td class="max-w-xs truncate px-6 py-4" :title="item.message">{{ item.message }}</td>
              <td class="px-6 py-4 text-center">
                <span
                  :class="getStatusStyle(item.status)"
                  class="rounded-full px-2 py-1 text-sm font-medium">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <button
                  @click="openReplyModal(item)"
                  class="inline-flex items-center justify-center gap-1 rounded-lg bg-[#06C755] px-4 py-2 text-sm text-white transition-all hover:bg-[#05b04a] active:scale-95"
                  title="回覆">
                  <MessageCircle class="h-4 w-4" />
                  回覆
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

  <div
    v-if="showReplyModal"
    class="bg-opacity-50 fixed inset-0 z-9999 flex items-center justify-center bg-black px-4">
    <div class="mx-auto flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-lg">
      <div class="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
        <h3 class="flex items-center gap-2 text-xl font-bold text-gray-800">
          <MessageCircle class="h-5 w-5 text-[#06C755]" />
          回覆 LINE 訊息
        </h3>
        <button @click="showReplyModal = false" class="text-gray-400 hover:text-gray-600">
          <X class="h-6 w-6" />
        </button>
      </div>

      <div class="space-y-6 overflow-y-auto p-6">
        <!-- 上半部 -->
        <div class="relative rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div
            class="absolute top-4 -left-2 h-4 w-4 rotate-45 border-t border-l border-gray-100 bg-gray-50"></div>
          <div class="mb-2 flex items-center justify-between">
            <span class="font-bold text-gray-700">{{ currentReply.userName }}</span>
          </div>
          <div class="text-gray-700">{{ currentReply.userMessage }}</div>
        </div>

        <!-- 下半部 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            客服回覆 (將直接發送到對方的 LINE)
          </label>
          <textarea
            v-model="currentReply.replyText"
            rows="5"
            placeholder="請輸入回覆訊息..."
            class="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] focus:outline-none"></textarea>
        </div>
      </div>

      <div
        class="flex shrink-0 items-center justify-between rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-4">
        <button
          @click="showReplyModal = false"
          class="bg-brand-error-500 hover:bg-brand-error-600 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-all active:scale-95">
          取消回覆
        </button>
        <button
          @click="submitReply"
          :disabled="isSubmitting"
          class="flex items-center gap-2 rounded-md bg-[#06C755] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#05b04a] active:scale-95 disabled:opacity-50">
          <span v-if="isSubmitting">傳送中...</span>
          <span v-else class="flex items-center gap-1">立即發送</span>
        </button>
      </div>
    </div>
  </div>
</template>
