<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ArticleEditor from '@/components/Client/ArticleEditor.vue'

// 假資料
// === 分類連動的資料結構 ===
const categoriesData = {
  寵物專區: ['貓', '狗', '鳥類', '鼠兔', '其他水族爬蟲'],
  美食天地: ['台灣小吃', '日韓料理', '歐美西餐', '甜點下午茶', '咖啡蔬食'],
  科技生活: ['手機3C', '電腦組裝', '軟體開發', 'AI應用', '智慧家居'],
  旅遊札記: ['國內旅遊', '日本自助', '歐洲行程', '住宿推薦', '必買伴手禮'],
}

// 模擬未來接 API 的狀況
onMounted(async () => {
  try {
    // const res = await axios.get('/api/Categories')
    // categoriesData.value = res.data
  } catch (error) {
    console.error('取得分類失敗', error)
  }
})

// 2. 處理發佈：API 發送寫在這裡！
const handlePublish = async (postData) => {
  console.log('View 接收到組件傳來的資料，準備送往 C# API：', postData)
  try {
    // const res = await axios.post('/api/Article', postData)
    // alert('發布成功！')
  } catch (error) {
    // alert('發布失敗')
  }
}

// 3. 處理草稿
const handleSaveDraft = (postData) => {
  console.log('View 收到草稿儲存請求：', postData)
  // axios.post('/api/Article/Draft', postData)
}
</script>

<template>
  <!-- 頁面最外層：只寫背景顏色 -->
  <div class="min-h-screen bg-[#f9f6f4] pt-6">
    <!-- 內容區：最大1280px -->
    <div class="container mx-auto w-full max-w-6xl px-4">
      <!-- 左右分邊容器，flex -->

      <div class="page-container">
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
