<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles } from 'lucide-vue-next'

import request from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

import ArticleEditor from '@/components/Client/Article_ArticleEditor.vue'
import Article_ToastAlert from '@/components/Client/Article_ToastAlert.vue'
import ScrollToTopButton from '@/components/Client/ScrollToTopButton.vue'

import { useArticleActions } from '@/composables/useArticleActions'
import { useCategories } from '@/composables/useCategories'

const { categoriesData, isCategoryLoading, fetchCategories } = useCategories()
const { draftsData, fetchDrafts, deleteDraft, saveOrUpdateArticle, fetchDraftDetail } =
  useArticleActions()

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
    const draftDetail = await fetchDraftDetail(id)

    articleId.value = draftDetail.articleId

    if (articleEditorRef.value) {
      articleEditorRef.value.loadDraftToEditor(draftDetail)
    }

    toastRef.value?.trigger('草稿載入成功')
  } catch (error) {
    console.error('載入草稿失敗:', error)
    toastRef.value?.trigger('載入草稿失敗')
  }
}

// 刪除草稿
const handleDeleteDraft = async (id) => {
  try {
    const result = await deleteDraft(id)
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
  <!-- 頁面最外層：對齊 warm sand 背景與 Fredoka 字型 -->
  <div class="min-h-screen bg-[#FCF4E5] text-gray-800 antialiased font-fredoka">
    
    <!-- HERO BANNER SECTION -->
    <section class="relative overflow-hidden bg-[#FCF4E5] px-6 pt-12 pb-8">
      <!-- Floating Background Ornaments -->
      <div class="absolute top-8 left-10 pointer-events-none opacity-20 animate-float">
        <span class="text-4xl">✏️</span>
      </div>
      <div class="absolute bottom-8 right-20 pointer-events-none opacity-20 animate-float delay-2s">
        <span class="text-4xl">🐾</span>
      </div>

      <div class="mx-auto max-w-3xl">
        <div class="text-center">
          <div class="inline-flex items-center gap-1.5 rounded-full  bg-[#7a6856] px-3.5 py-1 text-sm font-black text-white uppercase tracking-wider mb-3">
            <Sparkles :size="12" class="text-amber-500 animate-spin-slow" />
            PETMILY EDITOR
          </div>
          <h1 class="text-center text-4xl font-black tracking-tight text-[#445944]">
            撰寫社群貼文
          </h1>
          <p class="text-center text-lg font-bold text-gray-500 mt-2">
            與大家分享您與毛孩的有趣生活、實用知識或是疑難雜症吧！
          </p>
        </div>
      </div>
    </section>

    <!-- 內容區：最大1280px -->
    <div class="container mx-auto px-4 py-8">
      <div v-if="isCategoryLoading" class="py-16 text-center font-black text-[#445944] text-lg animate-pulse">
        ⏳ 正在載入分類資料...
      </div>
      
      <!-- 編輯器元件 -->
      <ArticleEditor
        v-if="!isCategoryLoading"
        ref="articleEditorRef"
        :categories="categoriesData"
        :drafts="draftsData"
        @publish="handlePublish"
        @save-draft="handleSaveDraft"
        @reset-id="handleResetArticleId"
        @load-draft="handleLoadDraft"
        @delete-draft="handleDeleteDraft" />
    </div>

    <Article_ToastAlert ref="toastRef" />
    <ScrollToTopButton />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Quicksand:wght@300..700&display=swap');

.font-fredoka {
  font-family: 'Fredoka', 'GenJyuu', sans-serif;
}

.animate-spin-slow {
  animation: spin 12s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.delay-2s {
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(3deg);
  }
}
</style>
