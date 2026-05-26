<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

import request from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

import ArticleEditor from '@/components/Client/Article_ArticleEditor.vue'
import Article_ToastAlert from '@/components/Client/Article_ToastAlert.vue'

import { useArticleActions } from '@/composables/useArticleActions'
import { useCategories } from '@/composables/useCategories'

const { categoriesData, isCategoryLoading, fetchCategories } = useCategories()
const { draftsData, fetchDrafts, deleteDraft, saveOrUpdateArticle } = useArticleActions()

const router = useRouter()
const articleEditorRef = ref(null)
const articleId = ref(null)
const toastRef = ref(null)

const authStore = useAuthStore()

// 發布貼文 (Status = 1)
const handlePublish = async (postData) => {
  try {
    const result = await saveOrUpdateArticle(articleId.value, postData, 1)
    toastRef.value?.trigger('文章發布成功！正在為您跳轉...')

    // 利用 router 跳轉到文章詳細頁
    if (result.data) {
      setTimeout(() => {
        router.push({
          name: 'article-detail',
          params: { id: result.data },
        })
      }, 1000) // 稍微延遲 1 秒讓使用者看得到 Toast 成功訊息
    } else {
      router.push('/community-home') // 萬一拿不到 ID 的安全備案頁面
    }
  } catch (error) {
    console.error('發布文章失敗：', error)
    toastRef.value?.trigger(`發布失敗：${error.response?.data?.message || '網路連線異常'}`)
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
        toastRef.value?.trigger('草稿儲存成功！您可留在本頁繼續修改。')
      }
    } else {
      await fetchDrafts()
      toastRef.value?.trigger('草稿已更新！')
    }
  } catch (error) {
    console.error('儲存草稿失敗：', error)
    toastRef.value?.trigger('儲存草稿失敗，請檢查網路連線')
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
    toastRef.value?.trigger('載入草稿失敗')
  }
}

// 刪除草稿
const handleDeleteDraft = async (id) => {
  try {
    const result = await deleteDraft(id)
    // 💡 8. 換掉 alert
    toastRef.value?.trigger(result.message || '草稿刪除成功')
  } catch (error) {
    toastRef.value?.trigger('刪除草稿失敗')
  }
}

// 重設ID狀態（切換到全新文章模式）
const handleResetArticleId = () => {
  articleId.value = null
  console.log('【狀態切換】已成功清空文章 ID，現在進入「全新文章」模式。')
}

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    toastRef.value?.trigger('請先登入')
    router.push('/login')
    return
  }

  try {
    await Promise.all([fetchCategories(), fetchDrafts()])
  } catch (error) {
    console.error('初始化資料失敗：', error)
    console.log('目前的 toastRef 實體是：', toastRef.value)
    await nextTick()
    toastRef.value?.trigger('無法載入初始資料，請檢查後端連線')
  }
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
    <Article_ToastAlert ref="toastRef" />
  </div>
</template>

<style scoped></style>
