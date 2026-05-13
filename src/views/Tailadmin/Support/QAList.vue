<script setup>
import { ref, onMounted } from 'vue'
import { MessageSquareText, Eye, X } from 'lucide-vue-next'

const qaData = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)

const loadQaData = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await fetch(`https://localhost:7048/api/Support/Qa?page=${page}`)
    if (response.ok) {
      const data = await response.json()
      qaData.value = data.items || []
      totalPages.value = data.totalPages || 1
      currentPage.value = page
    }
  } catch (error) {
    console.error('取得QA資料失敗:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadQaData(1)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    loadQaData(page)
  }
}

const showReplyModal = ref(false)
const isSubmitting = ref(false)

// 待確認名稱
const currentQa = ref({
  qaId: 0,
  userName: '',
  userEmail: '',
  question: '',
  createAt: '',
  replyContent: '',
  status: '',
})

const openReplyModal = (item) => {
  // 💡 這裡的 item 屬性名稱要依照你 C# DTO 的全小寫名稱來改
  currentQa.value = {
    qaId: item.qaid,
    userName: item.username || '匿名',
    userEmail: item.useremail || '無提供',
    question: item.question,
    createAt: item.createat,
    replyContent: item.replycontent || '',
    status: item.status || '未處理',
  }
  showReplyModal.value = true
}

const submitReply = async () => {
  if (!currentQa.value.replyContent) {
    alert('請填寫回覆內容')
    return
  }

  isSubmitting.value = true
  try {
    const response = await fetch(`https://localhost:7048/api/Support/Qa/${currentQa.value.qaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        replyContent: currentQa.value.replyContent,
        status: '已回覆', // 送出回覆後，狀態會自動變成已回覆
      }),
    })

    if (response.ok) {
      showReplyModal.value = false
      loadQaData(currentPage.value) // 重整畫面
      alert('回覆送出成功！')
    } else {
      alert('回覆失敗，請稍後再試')
    }
  } catch (error) {
    console.error('API錯誤:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-800">
        <MessageSquareText class="text-brand-info-500 h-6 w-6" />
        意見回覆記錄 (QA)
      </h2>
    </div>

    <!-- 表格區塊 -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-6 py-4 font-semibold">時間</th>
            <th class="px-6 py-4 font-semibold">發問者</th>
            <th class="px-6 py-4 font-semibold">問題內容</th>
            <th class="px-6 py-4 text-center font-semibold">狀態</th>
            <th class="px-6 py-4 text-center font-semibold">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="isLoading">
            <td colspan="5" class="py-8 text-center text-gray-500">資料載入中...</td>
          </tr>
          <tr v-else-if="qaData.length === 0">
            <td colspan="5" class="py-8 text-center text-gray-500">目前沒有任何意見記錄</td>
          </tr>
          <tr v-for="item in qaData" :key="item.qaid" class="transition-colors hover:bg-gray-50">
            <td class="px-6 py-4">{{ item.createat }}</td>
            <td class="px-6 py-4">
              <div>{{ item.username }}</div>
              <div class="text-xs text-gray-400">{{ item.useremail }}</div>
            </td>
            <!-- 使用 truncate 讓過長的問題變成 ... -->
            <td class="max-w-xs truncate px-6 py-4" :title="item.question">{{ item.question }}</td>
            <td class="px-6 py-4 text-center">
              <span
                :class="
                  item.status === '已回覆'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                "
                class="rounded-full px-2 py-1 text-xs font-medium">
                {{ item.status || '未處理' }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <button
                @click="openReplyModal(item)"
                class="bg-brand-info-500 hover:bg-brand-info-600 inline-flex items-center justify-center gap-1 rounded-lg px-4 py-2 text-sm text-white transition-all active:scale-95"
                title="查看詳細與回覆">
                <Eye class="h-4 w-4" />
                查看/回覆
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分頁器 (省略，可直接複製你 FaqList 的分頁器) -->

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
    class="bg-opacity-50 fixed inset-0 z-[9999] flex items-center justify-center bg-black px-4">
    <div class="mx-auto flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-lg">
      <div class="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
        <h3 class="text-xl font-bold text-gray-800">回覆意見</h3>
        <button @click="showReplyModal = false" class="text-gray-400 hover:text-gray-600">
          <X class="h-6 w-6" />
        </button>
      </div>

      <div class="space-y-6 overflow-y-auto p-6">
        <!-- 上半部(唯讀) -->
        <div class="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div class="mb-2 flex items-center justify-between">
            <span class="font-bold text-gray-700">
              來自：{{ currentQa.userName }} ({{ currentQa.userEmail }})
            </span>
            <span class="text-xs text-gray-500">{{ currentQa.createAt }}</span>
          </div>
          <div class="whitespace-pre-wrap text-gray-600">{{ currentQa.question }}</div>
        </div>

        <!-- 下半部(回覆) -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            客服回覆內容
            <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="currentQa.replyContent"
            rows="6"
            placeholder="請輸入給使用者的回覆..."
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-1 focus:outline-none"></textarea>
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
          class="bg-brand-info-500 hover:bg-brand-info-600 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-50">
          {{ isSubmitting ? '傳送中...' : '確認回覆' }}
        </button>
      </div>
    </div>
  </div>
</template>
