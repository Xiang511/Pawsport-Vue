<script setup>
import { ref, reactive, onMounted } from 'vue'
import { MessageCircle, Send, X, Bot } from 'lucide-vue-next'

const lineMessages = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)

// --- 讀取 API (假資料或準備好的 C# API) ---
const loadLineMessages = async (page = 1) => {
  isLoading.value = true
  try {
    // 之後替換成C#的LINE訊息記錄API
    // const response = await fetch(`https://localhost:7048/api/Support/LineBot?page=${page}`)

    // 暫時用假資料模擬
    setTimeout(() => {
      lineMessages.value = [
        {
          messageId: 1,
          userName: '王小明',
          userId: 'U1234567890',
          message: '請問領養狗狗需要帶什麼證件？',
          createAt: '2026-05-13 10:00',
          status: '未回覆',
        },
        {
          messageId: 2,
          userName: '陳大貓',
          userId: 'U0987654321',
          message: '我的健康護照APP一直閃退...',
          createAt: '2026-05-12 15:30',
          status: '已回覆',
        },
      ]
      totalPages.value = 1
      currentPage.value = page
      isLoading.value = false
    }, 500)
  } catch (error) {
    console.error('取得 LINE 訊息失敗:', error)
    isLoading.value = false
  }
}

onMounted(() => {
  loadLineMessages(1)
})

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
    // 這裡未來要改成呼叫C#的發送LINE訊息API
    // const response = await fetch(`https://localhost:7048/api/Support/LineBot/Reply`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId: currentReply.userId, replyMessage: currentReply.replyText })
    // })

    // 暫時模擬成功
    setTimeout(() => {
      alert(`已成功發送 LINE 訊息給 ${currentReply.userName}！`)
      showReplyModal.value = false
      loadLineMessages(currentPage.value)
      isSubmitting.value = false
    }, 800)
  } catch (error) {
    console.error('API 錯誤:', error)
    isSubmitting.value = false
  }
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

    <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-6 py-4 font-semibold">收到時間</th>
            <th class="px-6 py-4 font-semibold">LINE 暱稱</th>
            <th class="px-6 py-4 font-semibold">訊息內容</th>
            <th class="px-6 py-4 text-center font-semibold">狀態</th>
            <th class="w-32 px-6 py-4 text-center font-semibold">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="isLoading">
            <td colspan="5" class="py-8 text-center text-gray-500">資料載入中...</td>
          </tr>
          <tr
            v-for="item in lineMessages"
            :key="item.messageId"
            class="transition-colors hover:bg-gray-50">
            <td class="px-6 py-4">{{ item.createAt }}</td>
            <td class="px-6 py-4 font-medium text-gray-800">{{ item.userName }}</td>
            <td class="max-w-xs truncate px-6 py-4" :title="item.message">{{ item.message }}</td>
            <td class="px-6 py-4 text-center">
              <span
                :class="
                  item.status === '已回覆'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
                class="rounded-full px-2 py-1 text-xs font-medium">
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

    <div
      v-if="showReplyModal"
      class="bg-opacity-50 fixed inset-0 z-[9999] flex items-center justify-center bg-black px-4">
      <div
        class="mx-auto flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-lg">
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
              class="absolute top-4 -left-2 h-4 w-4 rotate-[-45deg] border-t border-l border-gray-100 bg-gray-50"></div>
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
            class="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 active:scale-95">
            取消
          </button>
          <button
            @click="submitReply"
            :disabled="isSubmitting"
            class="flex items-center gap-2 rounded-md bg-[#06C755] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#05b04a] active:scale-95 disabled:opacity-50">
            <span v-if="isSubmitting">傳送中...</span>
            <span v-else class="flex items-center gap-1">
              <Send class="h-4 w-4" />
              立即發送
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
