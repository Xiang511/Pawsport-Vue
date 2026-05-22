<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import ArticleEditor from '@/components/Client/Article_ArticleEditor.vue'
import request from '@/api/axios'

import { useArticleActions } from '@/composables/useArticleActions'
import { useCategories } from '@/composables/useCategories'

const router = useRouter()
const articleEditorRef = ref(null)
const articleId = ref(null)

const { categoriesData, isCategoryLoading, fetchCategories } = useCategories()
const { draftsData, fetchDrafts, deleteDraft, saveOrUpdateArticle } = useArticleActions()

// 發布貼文 (Status = 1)
const handlePublish = async (postData) => {
  try {
    const result = await saveOrUpdateArticle(articleId.value, postData, 1)
    alert('文章發布成功！')

    // 利用 router 跳轉到文章詳細頁
    if (result.data) {
      router.push(`/article-detail/${result.data}`)
    } else {
      router.push('/article-list') // 萬一拿不到 ID 的安全備案頁面
    }
  } catch (error) {
    console.error('發布文章失敗：', error)
    alert(`發布失敗：${error.response?.data?.message || '網路連線異常'}`)
  }
}

// 儲存草稿 (Status = 0)
const handleSaveDraft = async (postData) => {
  try {
    const result = await saveOrUpdateArticle(articleId.value, postData, 0)

    if (result.isNew) {
      if (result.data) {
        articleId.value = result.data
        if (articleEditorRef.value) {
          articleEditorRef.value.syncArticleId(result.data)
        }
        await fetchDrafts() // 刷新草稿夾
        alert('草稿儲存成功！您可留在本頁繼續修改。')
      }
    } else {
      await fetchDrafts()
      alert('草稿已更新！')
    }
  } catch (error) {
    console.error('儲存草稿失敗：', error)
    alert('儲存草稿失敗')
  }
}

// 點擊草稿後載入詳細資料
const handleLoadDraft = async (id) => {
  try {
    const response = await request.get(`/Article/${id}`)
    const draftDetail = response.data.data || response.data

    // 💡 接下來把你拿到的詳細資料，塞進你目前表單的 Ref 變數裡
    // 舉例（請換成你專案實際的變數名稱）：
    // currentArticleId.value = draftDetail.articleId
    // form.title = draftDetail.title
    // form.categoryId = draftDetail.categoryId
    // quillEditor.value.setHTML(draftDetail.content) // 如果是用富文本編輯器

    console.log('草稿詳細資料載入成功！', draftDetail)
  } catch (error) {
    alert('載入草稿失敗')
  }
}

// 刪除草稿
const handleDeleteDraft = async (id) => {
  const result = await deleteDraft(id)
  alert(result.message)
}

// 重設ID狀態（切換到全新文章模式）
const handleResetArticleId = () => {
  articleId.value = null
  console.log('【狀態切換】已成功清空文章 ID，現在進入「全新文章」模式。')
}

onMounted(async () => {
  fetchCategories()
  fetchDrafts()
})
</script>

<template>
  <!-- 頁面最外層：只寫背景顏色 -->
  <div class="min-h-screen bg-[#f9f6f4] pt-6">
    <!-- 內容區：最大1280px -->
    <div class="container mx-auto w-full max-w-6xl px-4">
      <!-- 左右分邊容器，flex -->

      <div class="container mx-auto p-4">
        <div v-if="isCategoryLoading" class="py-10 text-center text-gray-500">
          <span>正在載入分類資料...</span>
        </div>
        <!-- 編輯器元件 -->
        <ArticleEditor
          ref="articleEditorRef"
          :categories="categoriesData"
          :drafts="draftsData"
          @publish="handlePublish"
          @save-draft="handleSaveDraft"
          @reset-id="handleResetArticleId"
          @load-draft="handleLoadDraft"
          @delete-draft="handleDeleteDraft" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
