<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { MessageSquareText, Eye, X } from 'lucide-vue-next'
import Chart from 'chart.js/auto'
import axios from 'axios'

const qaData = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)
const isDashboardLoading = ref(false)

const loadQaData = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await fetch(`https://localhost:7048/api/Support/Qa?page=${page}`)
    if (response.ok) {
      const result = await response.json()
      qaData.value = result.data.items || []
      totalPages.value = result.data.totalPages || 1
      currentPage.value = Number(result.data.currentPage || page)
    }
  } catch (error) {
    console.error('取得QA資料失敗:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadQaData(1)
  fetchDashboardData()
})

const getStatusStyle = (status) => {
  if (status === '追蹤中') return 'bg-brand-success-600 text-white'
  if (status === '已結案') return 'bg-gray-400 text-white'
  return 'bg-brand-error-600 text-white'
}

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
    loadQaData(newPage)
  }
}

const showReplyModal = ref(false)
const isSubmitting = ref(false)

const currentQa = ref({
  qaId: 0,
  userId: '',
  questionType: '',
  questionDate: '',
  chiefComplaint: '',
  chatContent: '',
  csname: '',
  replyContent: '',
  note: '',
})

const openReplyModal = (item) => {
  currentQa.value = {
    qaId: item.qaid,
    userId: item.userId || '-',
    questionType: item.questionType || '-',
    questionDate: item.questionDate,
    chiefComplaint: item.chiefComplaint || '-',
    chatContent: item.chatContent || '（無詳細內容）',
    csname: item.csname || '',
    replyContent: item.replyContent || '',
    note: item.note || '',
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
        csname: currentQa.value.csname,
        replyContent: currentQa.value.replyContent,
        note: currentQa.value.note,
      }),
    })
    if (response.ok) {
      showReplyModal.value = false
      loadQaData(currentPage.value)
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

const formatDate = (dateStr) => {
  if (!dateStr || dateStr.startsWith('0001')) return '-'
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

let typeChartInstance = null
let statusChartInstance = null

const fetchDashboardData = async () => {
  isDashboardLoading.value = true
  try {
    const res = await axios.get('https://localhost:7048/api/Support/Dashboard')
    const dashboardData = res.data.data

    isDashboardLoading.value = false
    await nextTick()

    renderTypeChart(dashboardData.questionTypeStats)
    renderStatusChart(dashboardData.statusStats)
  } catch (error) {
    console.error('取得圖表數據失敗:', error)
    isDashboardLoading.value = false
  }
}

const renderTypeChart = (statsObj) => {
  const ctx = document.getElementById('questionTypeChart')
  if (!ctx) return
  if (typeChartInstance) typeChartInstance.destroy()

  typeChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(statsObj),
      datasets: [
        {
          data: Object.values(statsObj),
          backgroundColor: ['#fca5a5', '#fcd34d', '#93c5fd', '#c4b5fd', '#fdba74', '#86efac'],
          borderWidth: 1,
          hoverOffset: 15,
          borderRadius: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: "'Noto Sans TC', sans-serif" } } },
      },
    },
  })
}

const renderStatusChart = (statsObj) => {
  const ctx = document.getElementById('statusChart')
  if (!ctx) return
  if (statusChartInstance) statusChartInstance.destroy()

  const statusColorMap = { 未處理: '#fca5a5', 追蹤中: '#065f46', 已結案: '#9ca3af' }
  const incomingLabels = Object.keys(statsObj)

  statusChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: incomingLabels,
      datasets: [
        {
          data: Object.values(statsObj),
          backgroundColor: incomingLabels.map((label) => statusColorMap[label] || '#e5e7eb'),
          borderWidth: 1,
          hoverOffset: 15,
          borderRadius: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 15, padding: 15, font: { family: "'Noto Sans TC', sans-serif" } },
        },
        tooltip: { padding: 10, cornerRadius: 10 },
      },
      cutout: '50%',
    },
  })
}
</script>

<template>
  <div class="container mx-auto mt-6">
    <div class="mb-8 rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
      <h3 class="mb-8 flex items-center gap-2 text-xl font-bold text-gray-800">客服數據中心</h3>

      <div v-if="isDashboardLoading" class="py-20 text-center text-gray-500">
        <div
          class="border-brand-info-500 mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
        <div class="text-brand-info-600 font-bold tracking-widest">正在彙整最新數據報表... 🐾</div>
      </div>

      <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div class="flex flex-col items-center">
          <h5 class="mb-6 text-lg font-medium text-gray-600">近一個月問題類型</h5>
          <div class="relative flex h-72 w-72 justify-center">
            <canvas id="questionTypeChart"></canvas>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <h5 class="mb-6 text-lg font-medium text-gray-600">近一個月處理狀態追蹤</h5>
          <div class="relative flex h-72 w-72 justify-center">
            <canvas id="statusChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-800">
        <MessageSquareText class="text-brand-info-500 h-6 w-6" />
        Q&A意見回覆記錄
      </h2>
    </div>

    <div class="rounded-sm border border-gray-200 bg-white shadow-sm">
      <div class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-300 text-center">
              <th class="px-3 py-4 font-bold text-gray-700">NO.</th>
              <th class="px-3 py-4 font-bold text-gray-700">會員ID</th>
              <th class="px-3 py-4 font-bold text-gray-700">問題類型</th>
              <th class="px-3 py-4 font-bold text-gray-700">主訴</th>
              <th class="px-3 py-4 font-bold text-gray-700">處理客服</th>
              <th class="px-3 py-4 font-bold text-gray-700">發問時間</th>
              <th class="px-3 py-4 font-bold text-gray-700">回覆時間</th>
              <th class="px-3 py-4 font-bold text-gray-700">滿意度</th>
              <th class="px-3 py-4 font-bold text-gray-700">內部備註</th>
              <th class="px-3 py-4 font-bold text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="10" class="py-8 text-center text-gray-500">資料載入中...</td>
            </tr>
            <tr v-else-if="qaData.length === 0">
              <td colspan="10" class="py-8 text-center text-gray-500">目前沒有任何意見記錄</td>
            </tr>
            <tr
              v-for="(item, index) in qaData"
              :key="item.qaid"
              class="text-base transition-colors hover:bg-gray-200">
              <td class="px-3 py-4 text-center font-medium">
                {{ (currentPage - 1) * 10 + index + 1 }}
              </td>
              <td class="px-3 py-4 text-center">{{ item.userId || '-' }}</td>
              <td class="px-3 py-4 text-center">{{ item.questionType || '-' }}</td>
              <td
                class="max-w-37.5 truncate px-3 py-4 text-center"
                :title="item.subject || item.chiefComplaint">
                {{ item.subject || item.chiefComplaint || '-' }}
              </td>
              <td class="px-3 py-4 text-center">{{ item.csname || '-' }}</td>
              <td class="px-3 py-4 text-center text-base">{{ formatDate(item.questionDate) }}</td>
              <td class="px-3 py-4 text-center text-base">{{ formatDate(item.replyDate) }}</td>
              <td class="px-3 py-4 text-center text-base">{{ item.score || '-' }}</td>
              <td class="px-3 py-4 text-center">
                <span
                  :class="getStatusStyle(item.note)"
                  class="rounded-full px-2 py-1 text-sm font-medium">
                  {{ item.note || '未處理' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <button
                  @click="openReplyModal(item)"
                  class="bg-brand-info-500 hover:bg-brand-info-600 inline-flex items-center justify-center gap-1 rounded-lg px-4 py-2 text-base text-white transition-all active:scale-95">
                  <Eye class="h-4 w-4" />
                  查看/回覆
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
          class="hover:border-brand-info-500 hover:bg-brand-info-500 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:text-white disabled:opacity-50">
          上一頁
        </button>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="hover:border-brand-info-500 hover:bg-brand-info-500 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:text-white disabled:opacity-50">
          下一頁
        </button>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="showReplyModal"
      class="bg-opacity-50 fixed inset-0 z-99999 overflow-y-auto bg-black px-4 backdrop-blur-sm">
      <div class="min-h-screen w-full py-12">
        <div class="mx-auto w-full max-w-4xl rounded-lg bg-white shadow-xl">
          <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 class="text-xl font-bold text-gray-800">客服人員回覆</h3>
            <button
              @click="showReplyModal = false"
              class="text-gray-400 transition-colors hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-6 p-6 text-sm">
            <div class="rounded-md border border-gray-200">
              <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 font-bold text-gray-700">
                會員發問內容 (會員ID：{{ currentQa.userId }})
              </div>
              <div class="space-y-4 p-6">
                <div class="flex items-start">
                  <div class="w-32 shrink-0 font-medium text-gray-500">• 問題類型</div>
                  <div class="text-gray-800">{{ currentQa.questionType }}</div>
                </div>
                <div class="flex items-start">
                  <div class="w-32 shrink-0 font-medium text-gray-500">• 發問時間</div>
                  <div class="text-gray-800">{{ formatDate(currentQa.questionDate) }}</div>
                </div>
                <div class="flex items-start">
                  <div class="w-32 shrink-0 font-medium text-gray-500">• 主訴</div>
                  <div class="text-gray-800">{{ currentQa.chiefComplaint }}</div>
                </div>
                <div class="flex items-start">
                  <div class="w-32 shrink-0 font-medium text-gray-500">• 詳細內容</div>
                  <div
                    class="min-h-25 flex-1 rounded-md bg-gray-100 p-4 whitespace-pre-wrap text-gray-700">
                    {{ currentQa.chatContent }}
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-md border border-gray-200">
              <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 font-bold text-[#20c997]">
                客服回覆區
              </div>
              <div class="space-y-5 p-6">
                <div class="flex items-center">
                  <div class="w-32 shrink-0 font-medium text-gray-500">• 處理客服</div>
                  <input
                    v-model="currentQa.csname"
                    type="text"
                    class="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-[#20c997] focus:ring-1 focus:ring-[#20c997] focus:outline-none" />
                </div>
                <div class="flex items-start">
                  <div class="w-32 shrink-0 pt-2 font-medium text-gray-500">• 回覆內容</div>
                  <textarea
                    v-model="currentQa.replyContent"
                    rows="5"
                    class="flex-1 rounded-md border border-gray-300 px-4 py-3 focus:border-[#20c997] focus:ring-1 focus:ring-[#20c997] focus:outline-none"></textarea>
                </div>
                <div class="flex items-center">
                  <div class="w-32 shrink-0 font-medium text-gray-500">
                    • 內部備註
                    <br />
                    <span class="text-xs font-normal">(填入回覆狀態)</span>
                  </div>
                  <input
                    v-model="currentQa.note"
                    type="text"
                    placeholder="例如：追蹤中、已結案"
                    class="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-[#20c997] focus:ring-1 focus:ring-[#20c997] focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              @click="showReplyModal = false"
              class="bg-brand-error-500 hover:bg-brand-error-600 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-all active:scale-95">
              取消回覆並返回
            </button>
            <button
              @click="submitReply"
              :disabled="isSubmitting"
              class="bg-brand-info-500 hover:bg-brand-info-600 flex items-center gap-2 rounded-md px-8 py-2.5 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-50">
              {{ isSubmitting ? '處理中...' : '確認回覆' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
