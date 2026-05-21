<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Mail, Plus, Edit, Trash2, X } from 'lucide-vue-next'

const newsletterData = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)

const loadNewsletterData = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await fetch(`https://localhost:7048/api/ENewsletter?page=${page}`)
    if (response.ok) {
      const result = await response.json()
      newsletterData.value = result.data.items || []
      totalPages.value = result.data.totalPages || 1
      currentPage.value = page
    }
  } catch (error) {
    console.error('取得電子報資料失敗:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadNewsletterData(1)
})

// 時間格式轉換
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

const getStatusStyle = (status) => {
  switch (status) {
    case '已發送':
      return 'bg-brand-success-600 text-white'
    case '預約發送':
      return 'bg-brand-warning-400 text-yellow-900'
    case '草稿':
      return 'bg-brand-info-700 text-white'
    case '已下架':
      return 'bg-brand-error-600 text-white'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getCategoryStyle = (category) => {
  switch (category) {
    case '活動公告':
      return 'bg-purple-200 text-purple-800 border border-purple-500'
    case '認養資訊':
      return 'bg-rose-200 text-rose-800 border border-rose-500'
    case '飼養知識':
      return 'bg-teal-200 text-teal-800 border border-teal-500'
    case '遊戲挑戰':
      return 'bg-amber-200 text-amber-800 border border-amber-500'
    default:
      return 'bg-gray-200 text-gray-800 border border-gray-500'
  }
}

// 新增
const showCreateModal = ref(false)
const isSubmitting = ref(false)

const newNewsletter = reactive({
  title: '',
  summary: '',
  content: '',
  category: '活動公告',
  status: '待發佈',
  note: '',
})

const openCreateModal = () => {
  newNewsletter.title = ''
  newNewsletter.summary = ''
  newNewsletter.content = ''
  newNewsletter.category = '活動公告'
  newNewsletter.status = '待發佈'
  newNewsletter.note = ''
  showCreateModal.value = true
}

const submitCreate = async () => {
  if (
    !newNewsletter.title ||
    !newNewsletter.summary ||
    !newNewsletter.content ||
    !newNewsletter.category ||
    !newNewsletter.status
  ) {
    alert('請填寫必填欄位 (*)')
    return
  }
  isSubmitting.value = true
  try {
    const response = await fetch('https://localhost:7048/api/ENewsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNewsletter),
    })
    if (response.ok) {
      showCreateModal.value = false
      loadNewsletterData(1)
      alert('電子報新增成功！')
    } else {
      alert('新增失敗，請檢查資料格式')
    }
  } catch (error) {
    console.error('API 錯誤:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 修改
const showEditModal = ref(false)
const isEditing = ref(false)

const currentEditNewsletter = reactive({
  newsletterId: null,
  publishDate: '',
  title: '',
  summary: '',
  content: '',
  category: '活動公告',
  status: '待發佈',
  userId: 1,
  note: '',
})

const openEditModal = (item) => {
  currentEditNewsletter.newsletterId = item.newsLetterId || item.newsletterId
  currentEditNewsletter.publishDate = item.publishDate
  currentEditNewsletter.title = item.title
  currentEditNewsletter.summary = item.summary || ''
  currentEditNewsletter.content = item.content
  currentEditNewsletter.category = item.category || '活動公告'
  currentEditNewsletter.status = item.status || '待發佈'
  currentEditNewsletter.note = item.note || ''
  showEditModal.value = true
  newNewsletter.userId = 1
}

const submitEdit = async () => {
  if (
    !currentEditNewsletter.title ||
    !currentEditNewsletter.summary ||
    !currentEditNewsletter.content ||
    !currentEditNewsletter.category ||
    !currentEditNewsletter.status
  ) {
    alert('請填寫必填欄位 (*)')
    return
  }
  isEditing.value = true
  try {
    const response = await fetch(
      `https://localhost:7048/api/ENewsletter/${currentEditNewsletter.newsletterId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsLetterId: currentEditNewsletter.newsletterId,
          publishDate: currentEditNewsletter.publishDate,
          title: currentEditNewsletter.title,
          summary: currentEditNewsletter.summary,
          content: currentEditNewsletter.content,
          category: currentEditNewsletter.category,
          status: currentEditNewsletter.status,
          note: currentEditNewsletter.note,
          userId: 1,
        }),
      },
    )
    if (response.ok) {
      showEditModal.value = false
      loadNewsletterData(currentPage.value)
      alert('電子報修改成功！')
    } else {
      alert('修改失敗，請檢查資料格式')
    }
  } catch (error) {
    console.error('API 錯誤:', error)
  } finally {
    isEditing.value = false
  }
}

// 刪除
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const deleteTargetId = ref(null)

const openDeleteModal = (id) => {
  deleteTargetId.value = id
  showDeleteModal.value = true
}

const submitDelete = async () => {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    const response = await fetch(`https://localhost:7048/api/ENewsletter/${deleteTargetId.value}`, {
      method: 'PATCH',
    })
    if (response.ok) {
      showDeleteModal.value = false
      loadNewsletterData(currentPage.value)
      alert('刪除成功！')
    } else {
      alert('刪除失敗')
    }
  } catch (error) {
    console.error('API 錯誤:', error)
  } finally {
    isDeleting.value = false
    deleteTargetId.value = null
  }
}

// 換頁
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
    loadNewsletterData(newPage)
  }
}
</script>

<template>
  <div class="relative p-6">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-800">
        <Mail class="text-brand-info-500 h-6 w-6" />
        電子報管理
      </h2>
      <button
        @click="openCreateModal"
        class="bg-brand-success-500 text-theme-sm hover:bg-brand-success-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95"
        title="新增電子報">
        <Plus class="h-5 w-5" />
      </button>
    </div>

    <div class="rounded-sm border border-gray-200 bg-white shadow-sm">
      <div class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-300 text-center">
              <th class="w-20 px-3 py-4 font-bold text-gray-700">NO.</th>
              <th class="px-4 py-4 font-bold text-gray-700">建立日期</th>
              <th class="px-4 py-4 font-bold text-gray-700">類別</th>
              <th class="px-4 py-4 font-bold text-gray-700">電子報標題</th>
              <th class="px-4 py-4 font-bold text-gray-700">內容</th>
              <th class="px-4 py-4 text-center font-bold text-gray-700">狀態</th>
              <th class="w-32 px-4 py-4 text-center font-bold text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 text-center">
            <tr v-if="isLoading">
              <td colspan="7" class="py-8 text-center text-gray-500">資料載入中...</td>
            </tr>
            <tr v-else-if="newsletterData.length === 0">
              <td colspan="7" class="py-8 text-center text-gray-500">目前沒有電子報資料</td>
            </tr>

            <tr
              v-for="(item, index) in newsletterData"
              :key="item.newsLetterId || item.newsletterId"
              class="text-center text-base transition-colors hover:bg-gray-200">
              <td class="px-3 py-4 text-center font-medium text-gray-700">
                {{ (currentPage - 1) * 10 + index + 1 }}
              </td>

              <td class="px-6 py-4 text-center text-gray-700">
                {{ formatDate(item.publishDate) }}
              </td>

              <td class="px-6 py-4 text-center">
                <span
                  :class="getCategoryStyle(item.category)"
                  class="rounded px-2.5 py-1 text-sm font-medium shadow-sm">
                  {{ item.category || '-' }}
                </span>
              </td>

              <td
                class="max-w-45 truncate px-6 py-4 text-center font-medium text-gray-800"
                :title="item.title">
                {{ item.title }}
              </td>

              <td
                class="max-w-62.5 truncate px-6 py-4 text-center text-sm text-gray-500"
                :title="item.content">
                {{ item.content || '-' }}
              </td>

              <td class="px-6 py-4 text-center">
                <span
                  :class="getStatusStyle(item.status)"
                  class="rounded-full px-3 py-1 text-sm font-medium">
                  {{ item.status || '待發佈' }}
                </span>
              </td>

              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="openEditModal(item)"
                    class="bg-brand-info-500 hover:bg-brand-info-600 inline-flex items-center justify-center rounded-lg p-2 text-white transition-all active:scale-95"
                    title="編輯">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button
                    @click="openDeleteModal(item.newsLetterId || item.newsletterId)"
                    class="bg-brand-error-500 hover:bg-brand-error-600 inline-flex items-center justify-center rounded-lg p-2 text-white transition-all active:scale-95"
                    title="刪除">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
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

  <!-- 新增 -->
  <div
    v-if="showCreateModal"
    class="bg-opacity-50 fixed inset-0 z-9999 flex items-center justify-center bg-black px-4">
    <div class="mx-auto max-h-[90vh] w-full max-w-2xl rounded-lg bg-white shadow-lg">
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h3 class="text-xl font-bold text-gray-800">新增電子報</h3>
          <p class="mt-1 text-sm text-gray-500"><span class="text-red-500">* 必填 *</span></p>
        </div>
        <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
          <X class="h-6 w-6" />
        </button>
      </div>
      <div class="space-y-4 p-6">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            標題
            <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            v-model="newNewsletter.title"
            placeholder="例如：12月寵物領養快訊"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            摘要
            <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            v-model="newNewsletter.summary"
            placeholder="請輸入顯示在列表的簡短摘要"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            內容
            <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="newNewsletter.content"
            rows="5"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"></textarea>
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              類別
              <span class="text-red-500">*</span>
            </label>
            <select
              v-model="newNewsletter.category"
              class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none">
              <option value="活動公告">活動公告</option>
              <option value="認養資訊">認養資訊</option>
              <option value="飼養知識">飼養知識</option>
              <option value="遊戲挑戰">遊戲挑戰</option>
              <option value="其它類別">其它類別</option>
            </select>
          </div>

          <div class="flex-1">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              狀態
              <span class="text-red-500">*</span>
            </label>
            <select
              v-model="newNewsletter.status"
              class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none">
              <option value="草稿">草稿</option>
              <option value="預約發送">預約發送</option>
              <option value="已發送">已發送</option>
              <option value="已下架">已下架</option>
            </select>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">內部備註</label>
          <input
            type="text"
            v-model="newNewsletter.note"
            placeholder="僅限後台查看的備註說明..."
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none" />
        </div>

        <div class="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <button
            @click="showCreateModal = false"
            class="bg-brand-error-500 hover:bg-brand-error-600 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-all active:scale-95">
            取消新增並返回
          </button>
          <button
            @click="submitCreate"
            :disabled="isSubmitting"
            class="bg-brand-info-500 hover:bg-brand-info-600 flex items-center gap-2 rounded-md px-8 py-2.5 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-50">
            <span v-if="isSubmitting">處理中...</span>
            <span v-else>確認新增</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 修改 -->
  <div
    v-if="showEditModal"
    class="bg-opacity-50 fixed inset-0 z-9999 flex items-center justify-center bg-black px-4">
    <div
      class="mx-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-lg">
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h3 class="text-xl font-bold text-gray-800">修改電子報</h3>
          <p class="mt-1 text-sm text-gray-500"><span class="text-red-500">* 必填 *</span></p>
        </div>
        <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
          <X class="h-6 w-6" />
        </button>
      </div>

      <div class="space-y-4 p-6">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            標題
            <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            v-model="currentEditNewsletter.title"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            摘要
            <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            v-model="currentEditNewsletter.summary"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            內容
            <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="currentEditNewsletter.content"
            rows="5"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"></textarea>
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <label class="mb-2 block text-sm font-medium text-gray-700">類別</label>
            <select
              v-model="currentEditNewsletter.category"
              class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none">
              <option value="活動公告">活動公告</option>
              <option value="認養資訊">認養資訊</option>
              <option value="飼養知識">飼養知識</option>
              <option value="遊戲挑戰">遊戲挑戰</option>
              <option value="其它類別">其它類別</option>
            </select>
          </div>

          <div class="flex-1">
            <label class="mb-2 block text-sm font-medium text-gray-700">狀態</label>
            <select
              v-model="currentEditNewsletter.status"
              class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none">
              <option value="草稿">草稿</option>
              <option value="預約發送">預約發送</option>
              <option value="已發送">已發送</option>
              <option value="已下架">已下架</option>
            </select>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">內部備註 (非必填)</label>
          <input
            type="text"
            v-model="currentEditNewsletter.note"
            class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none" />
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
          class="bg-brand-info-500 hover:bg-brand-info-600 flex items-center gap-2 rounded-md px-8 py-2.5 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-50">
          <span v-if="isEditing">處理中...</span>
          <span v-else>確認修改</span>
        </button>
      </div>
    </div>
  </div>

  <!-- 刪除確認 -->
  <div
    v-if="showDeleteModal"
    class="bg-opacity-50 fixed inset-0 z-9999 flex items-center justify-center bg-black px-4">
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
          class="bg-brand-error-500 hover:bg-brand-error-600 w-full rounded-md px-4 py-2 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-50">
          <span v-if="isDeleting">處理中...</span>
          <span v-else>確定刪除</span>
        </button>
      </div>
    </div>
  </div>
</template>
