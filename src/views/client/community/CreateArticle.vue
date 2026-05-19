<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ArticleEditor from '@/components/Client/ArticleEditor.vue'

const API_BASE_URL = 'https://localhost:7048/api'
const categoriesData = ref({})
const isLoading = ref(false)

// // 假資料
// // === 分類連動的資料結構 ===
// const categoriesData = {
//   寵物專區: ['貓', '狗', '鳥類', '鼠兔', '其他水族爬蟲'],
//   美食天地: ['台灣小吃', '日韓料理', '歐美西餐', '甜點下午茶', '咖啡蔬食'],
//   科技生活: ['手機3C', '電腦組裝', '軟體開發', 'AI應用', '智慧家居'],
//   旅遊札記: ['國內旅遊', '日本自助', '歐洲行程', '住宿推薦', '必買伴手禮'],
// }

//把資料轉換成需要的格式
const transformCategories = (apiData) => {
  const result = {}

  apiData.forEach((item) => {
    const parent = item.parentCategoryName
    const child = item.categoryName

    if (!parent || parent.trim() === '') {
      // 情況 A：如果沒有父分類，代表它自己就是大分類（例如：站務公告）
      // 我們給它一個預設的虛擬大分類，或者直接以它為 Key 放入空陣列
      if (!result[child]) {
        result[child] = [] // 它既是大分類，底下目前沒有小分類
      }
    } else {
      // 情況 B：有父分類（例如：parent="寵物專區", child="貓"）
      // 如果這個大分類還沒被建立，先初始化一個空陣列
      if (!result[parent]) {
        result[parent] = []
      }
      // 把小分類塞進去
      result[parent].push(child)
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
    await axios.post(`${API_BASE_URL}/articles`, postData)
    alert('🎉 文章發布成功！')
  } catch (error) {
    alert('發布失敗')
  }
}

// 3. 處理草稿
const handleSaveDraft = async (postData) => {
  try {
    await axios.post(`${API_BASE_URL}/articles/draft`, postData)
    alert('🎉 草稿儲存成功！')
  } catch (error) {
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
