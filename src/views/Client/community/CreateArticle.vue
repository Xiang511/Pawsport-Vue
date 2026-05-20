<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ArticleEditor from '@/components/Client/ArticleEditor.vue'
import { useRouter } from 'vue-router' // 處理跳轉

// 初始化路由物件
const router = useRouter()
const API_BASE_URL = 'https://localhost:7048/api'
const categoriesData = ref({})
const isLoading = ref(false)
// 用來記錄目前這篇文章在資料庫的 ID （預設 null 代表是全新文章）
const articleId = ref(null)

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
    // 先用 transformCategories 洗過
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

    let finalId = articleId.value

    if (articleId.value === null) {
      // 情況 A：從來沒存過草稿，直接發佈 (POST)
      console.log('【發佈】全新貼文 POST Payload:', payload)
      const response = await axios.post(`${API_BASE_URL}/Article`, payload)

      // 取得新生成的文章 ID (請根據你後端實際回傳格式調整，例如 response.data.id 或 response.data.data.id)
      finalId = response.data.id || response.data.data?.id
    } else {
      // 情況 B：之前有存過草稿，現在決定正式發佈 (PUT)
      payload.id = articleId.value // 有些後端會要求 body 內也要帶 id
      console.log(`【發佈】現有草稿轉正式發佈 PUT /Article/${articleId.value} Payload:`, payload)
      await axios.put(`${API_BASE_URL}/Article/${articleId.value}`, payload)
    }

    alert('文章發布成功！')

    // 利用 router 跳轉到文章詳細頁
    if (finalId) {
      router.push(`/article-detail/${finalId}`)
    } else {
      router.push('/article-list') // 萬一拿不到 ID 的安全備案頁面
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
