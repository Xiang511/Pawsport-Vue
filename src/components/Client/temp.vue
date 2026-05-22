// 📄 CreateArticle.vue
<script setup>
import axios from 'axios'
import { ref } from 'vue'
import ArticleEditor from '@/components/ArticleEditor.vue'

const API_BASE_URL = 'https://localhost:7048/api'

// 🚀 處理「發佈貼文」 (Status = 1)
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

// 💾 處理「儲存草稿」 (Status = 0)
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
  <div>
    <ArticleEditor
      :categories="categoriesData"
      @publish="handlePublish"
      @save-draft="handleSaveDraft" />
  </div>
</template>
