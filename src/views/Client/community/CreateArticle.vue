<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ArticleEditor from '@/components/Client/ArticleEditor.vue'
import { useRouter } from 'vue-router'
import request from '@/api/axios'
import { useAuthStore } from '@/stores/auth'
import { useArticleActions } from '@/composables/useArticleActions'

const authStore = useAuthStore()
const articleEditorRef = ref(null)
const { draftsData, fetchDrafts, deleteDraft } = useArticleActions()

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
    if (item.level === 0) {
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
    if (parentName && result[parentName] !== undefined) {
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
    const response = await request.get('/Category')
    // 先用 transformCategories 洗過
    categoriesData.value = transformCategories(response.data.data)
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

    if (
      articleId.value === null ||
      articleId.value === undefined ||
      articleId.value === 'undefined'
    ) {
      // 情況 A：從來沒存過草稿，直接發佈 (POST)
      // console.log('【發佈】全新貼文 POST Payload:', payload)
      const response = await request.post('/Article', payload)

      // 取得新生成的文章 ID
      finalId = response.data.data
    } else {
      // 情況 B：之前有存過草稿，現在決定正式發佈 (PUT)
      // console.log(`【發佈】現有草稿轉正式發佈 PUT /Article/${articleId.value} Payload:`, payload)
      await request.put(`/Article/${articleId.value}`, payload)
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

    if (
      articleId.value === null ||
      articleId.value === undefined ||
      articleId.value === 'undefined'
    ) {
      // 情況 1：第一次儲存草稿 (POST)
      // console.log('【草稿】第一次儲存 POST Payload:', payload)
      const response = await request.post('/Article', payload)

      if (response.status === 200 || response.status === 201) {
        const newId = response.data?.data
        if (newId) {
          articleId.value = newId
          if (articleEditorRef.value) {
            articleEditorRef.value.syncArticleId(newId)
          }
          await fetchDrafts()
          alert('草稿儲存成功！您可留在本頁繼續修改。')
        } else {
          console.error('儲存成功，但從 response 中找不到 id 欄位。')
          alert('草稿已儲存，但未能取得文章識別碼。')
        }
      }
    } else {
      // 情況 2：第二次以上儲存同一篇草稿 (PUT)
      const response = await request.put(`/Article/${articleId.value}`, payload)

      if (response.status === 200 || response.status === 204) {
        await fetchDrafts()
        alert('草稿已更新！')
      }
    }
  } catch (error) {
    console.error('儲存草稿失敗：', error)
    alert('儲存草稿失敗')
  }
}

// 清空 ID 的監聽函式
const handleResetArticleId = () => {
  articleId.value = null
  console.log('【狀態切換】已成功清空文章 ID，現在進入「全新文章」模式。')
}

// 3. 處理「點擊草稿後載入」
const handleLoadDraft = async (id) => {
  try {
    // 這裡通常是去呼叫取得單一文章詳細資料的 API（例如：[HttpGet("{id}")]）
    const response = await request.get(`/Article/${id}`)

    // 一樣要注意組員包裝的 Success 格式，可能要寫 response.data.data
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

// 4. 處理「刪除草稿」
const handleDeleteDraft = async (id) => {
  const result = await deleteDraft(id) // Composable 會自己去刪除並刷清單
  alert(result.message)
}

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await request.get('/Category')
    // 先用 transformCategories 洗過
    categoriesData.value = transformCategories(response.data.data)
  } catch (error) {
    console.error('取得分類失敗：', error)
    alert('無法載入分類選單')
  } finally {
    isLoading.value = false
  }
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
        <div v-if="isLoading" class="py-10 text-center text-gray-500">
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
