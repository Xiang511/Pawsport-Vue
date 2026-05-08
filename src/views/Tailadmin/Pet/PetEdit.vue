<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import PageBreadcrumb from '@/components/Pawsport/PageBreadcrumb.vue'

const router = useRouter()
const route = useRoute() // 用來取得網址參數
const petId = route.params.id // 取得路由中的 id

const currentPageTitle = ref('資料修改')

// 麵包屑：首頁 > 寵物資料一覽表 > 資料修改
const breadcrumbItems = ref([
  { name: '首頁', route: '/dashboard' },
  { name: '寵物資料一覽表', route: '/dashboard/pet' },
  { name: '資料修改', route: '' },
])

// 1. 定義表單資料結構 (包含 PetId)
const form = ref({
  petId: null,
  speciesId: null,
  name: '',
  gender: '',
  size: '',
  coatColor: '',
  photo: '',
  currentStatus: '',
  behavioralTraits: '',
  isHighMaintenance: false,
  note: '',
  createdAt: '',
  isDesex: false,
  updatedAt: new Date().toISOString().split('T')[0],
})

const loading = ref(false)
const fetching = ref(true) // 初始載入狀態

// 2. 取得原始資料 (反填)
const fetchPetData = async () => {
  try {
    const response = await axios.get(`https://localhost:7048/api/Pet/${petId}`)
    const result = response.data

    if (result.success === true) {
      // 將 API 回傳的資料填入 form
      // 注意：如果是日期欄位，需要做 .split('T')[0] 處理才能正確顯示在 <input type="date">
      const data = result.data
      form.value = {
        ...data,
        createdAt: data.createdAt ? data.createdAt.split('T')[0] : '',
        updatedAt: new Date().toISOString().split('T')[0], // 編輯時更新「最後更新時間」
      }
    } else {
      alert('找不到該寵物資料')
      goBack()
    }
  } catch (error) {
    console.error('取得資料失敗:', error)
    alert('讀取資料失敗')
  } finally {
    fetching.value = false
  }
}

// 3. 提交修改方法 (PUT)
const handleSubmit = async () => {
  loading.value = true
  try {
    // 根據你的 Controller，PUT 路徑通常是 /api/Pet/{id}
    const response = await axios.put(`https://localhost:7048/api/Pet/${petId}`, form.value)

    // 注意：後端 Edit 如果回傳的是 NoContent()，status 會是 204
    if (response.status === 204 || response.data?.success === true) {
      alert('修改成功！')
      router.push({ name: 'admin-petlist' })
    } else {
      alert('修改失敗：' + (response.data?.message || '未知錯誤'))
    }
  } catch (error) {
    console.error('更新失敗:', error)
    alert('系統錯誤，請檢查主控台')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'admin-petlist' })
}

onMounted(() => {
  fetchPetData()
})
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" :items="breadcrumbItems" />

  <div v-if="fetching" class="flex h-40 items-center justify-center">
    <p class="text-lg">資料載入中...</p>
  </div>

  <div
    v-else
    class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="border-b border-gray-200 px-7 py-4 dark:border-gray-800">
      <h3 class="font-medium text-gray-800 dark:text-white/90">修改寵物資訊 (ID: {{ petId }})</h3>
    </div>

    <div class="p-7">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              寵物名稱
            </label>
            <input
              v-model="form.name"
              type="text"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700"
              required />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              物種編號 (SpeciesId)
            </label>
            <input
              v-model.number="form.speciesId"
              type="number"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              性別
            </label>
            <input
              v-model="form.gender"
              type="text"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              體型
            </label>
            <input
              v-model="form.size"
              type="text"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              花色
            </label>
            <input
              v-model="form.coatColor"
              type="text"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              目前狀態
            </label>
            <input
              v-model="form.currentStatus"
              type="text"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>

          <div class="flex items-center gap-6 pt-4 md:col-span-2">
            <div class="flex items-center gap-2">
              <input
                v-model="form.isHighMaintenance"
                type="checkbox"
                id="highMain"
                class="h-5 w-5" />
              <label for="highMain" class="text-sm font-medium text-gray-800 dark:text-white/90">
                需要高度照護
              </label>
            </div>

            <div class="flex items-center gap-2">
              <input v-model="form.isDesex" type="checkbox" id="isDesex" class="h-5 w-5" />
              <label for="isDesex" class="text-sm font-medium text-gray-800 dark:text-white/90">
                已結紮
              </label>
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              備註
            </label>
            <textarea
              v-model="form.note"
              rows="4"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700"></textarea>
          </div>
        </div>

        <div class="mt-8 flex gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="bg-primary hover:bg-opacity-90 text-primary flex justify-center rounded border border-gray-300 px-10 py-3 font-medium disabled:bg-gray-400 dark:text-white">
            {{ loading ? '儲存中...' : '儲存修改' }}
          </button>
          <button
            @click="goBack"
            type="button"
            class="text-primary flex justify-center rounded border border-gray-300 px-10 py-3 font-medium hover:bg-gray-50 dark:text-white">
            取消修改
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
