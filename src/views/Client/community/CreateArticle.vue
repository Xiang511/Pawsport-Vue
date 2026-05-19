<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ArticleEditor from '@/components/Client/ArticleEditor.vue'

const API_BASE_URL = 'https://localhost:7048/api'
const categoriesData = ref({})
const isLoading = ref(false)

//把資料轉換成需要的格式
const transformCategories = (apiData) => {
  // 先找出所有「大分類」
  const result = {}
  // 在 result 物件裡建立空籃子
  apiData.forEach((item) => {
    // 判斷方式：如果 parentId 是 null，或者沒有 parentCategoryName，它就是大分類
    if (
      item.parentId === null ||
      !item.parentCategoryName ||
      item.parentCategoryName.trim() === ''
    ) {
      // 用大分類名稱當作 Key，建立一個空陣列準備裝子分類
      if (!result[item.categoryName]) {
        result[item.categoryName] = []
      }
    }
  })

  // 把「小分類」塞進對應的大分類籃子裡
  apiData.forEach((item) => {
    const parentName = item.parentCategoryName

    // 如果它有父分類名稱，代表它是小分類
    if (parentName && parentName.trim() !== '') {
      // 確保大分類的籃子存在（防呆）
      if (!result[parentName]) {
        result[parentName] = []
      }

      // 把小分類的 ID 和名稱打包成物件，丟進大分類的陣列裡
      result[parentName].push({
        id: item.categoryId, //  對齊後端回傳的 categoryId
        name: item.categoryName, // 小分類名稱
      })
    }
  })

  return result
}

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/Category`)
    console.log('C# 後端回傳的原始 response.data 是：', response.data)
    // 關鍵點：不要直接塞 response.data，先用 transformCategories 洗過！
    categoriesData.value = transformCategories(response.data.data)

    console.log('前端格式的分類資料：', categoriesData.value)
  } catch (error) {
    console.error('取得分類失敗：', error)
    alert('無法載入分類選單')
  } finally {
    isLoading.value = false
  }
})

// 2. 處理發佈：API 發送寫在這裡！
const handlePublish = async (postData) => {
  try {
    const payload = {
      ...postData,
      status: 1, // 1 代表直接發佈上架
    }

    console.log('前端準備送出的發佈 Payload:', payload)

    // 💡 呼叫 C# 後端的 Post API
    const response = await axios.post(`${API_BASE_URL}/Article`, payload)

    if (response.status === 200 || response.status === 201) {
      alert('🎉 文章發布成功！')
      // router.push('/forum') // 成功後導頁
    }
  } catch (error) {
    console.error('發布文章失敗：', error)
    alert(`發布失敗：${error.response?.data?.message || '網路連線異常'}`)
  }
}

// 3. 處理草稿
const handleSaveDraft = async (postData) => {
  try {
    const payload = {
      ...postData,
      status: 0, // 0 代表儲存為草稿
    }

    console.log('前端準備送出的草稿 Payload:', payload)

    const response = await axios.post(`${API_BASE_URL}/Article`, payload)

    if (response.status === 200) {
      alert('💾 草稿儲存成功！')
    }
  } catch (error) {
    console.error('儲存草稿失敗：', error)
    alert('儲存草稿失敗')
  }
}
</script>

<template>
  <!-- 頁面最外層：只寫背景顏色 -->
  <div class="min-h-screen bg-[#f9f6f4] pt-6">
    <!-- 內容區：最大1280px -->
    <div class="container mx-auto w-full max-w-6xl px-4">
      <!-- 左右分邊容器，flex -->

      <div class="container mx-auto p-4">
        <div v-if="isLoading" class="py-10 text-center text-gray-500">
          <span>正在載入分類資料...</span>
        </div>
        <!-- 編輯器元件 -->
        <ArticleEditor
          :categories="categoriesData"
          @publish="handlePublish"
          @save-draft="handleSaveDraft" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
