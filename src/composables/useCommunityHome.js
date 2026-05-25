import { ref, computed } from 'vue'
import request from '@/api/axios'

export function useCommunityHome() {
  // === 原始資料管理 ===
  const allCategories = ref([]) // 儲存後端回傳的所有原始分類
  const categories = ref([{ categoryid: 0, categoryname: '全部' }])
  const articleData = ref([])
  const isLoading = ref(false)
  const isError = ref(false)

  // === 篩選與分頁狀態 ===
  const currentParentId = ref(0) // 當前選取的大分類 ID (0 代表全部)
  const currentSubId = ref(0) // 當前選取的子分類 ID (0 代表不限子分類)
  const searchQuery = ref('')

  const currentPage = ref(1) // 當前頁碼
  const pageSize = ref(5) // 每頁顯示幾篇

  // === 串接 API 取得真實資料 ===
  const fetchData = async () => {
    isLoading.value = true
    isError.value = false
    try {
      const [categoriesResponse, articlesResponse] = await Promise.all([
        request.get('/Category'),
        request.get('/Article'),
      ])

      allCategories.value = categoriesResponse.data.data || []
      articleData.value = articlesResponse.data.data || []
    } catch (error) {
      console.error('資料載入失敗:', error)
      isError.value = true
    } finally {
      isLoading.value = false
    }
  }

  // === 1. 分類階層化處理 (Computed) ===
  const parentCategories = computed(() => {
    if (!allCategories.value || allCategories.value.length === 0) {
      return [{ categoryid: 0, categoryname: '全部' }]
    }

    // 💡 配合你的資料庫：篩選出 Level 為 0，或是 ParentID 為 null 的大分類
    const parents = allCategories.value.filter((c) => {
      const lvl = c.level ?? c.Level
      const pId = c.parentID ?? c.parentId ?? c.ParentID

      return lvl === 0 || pId === null
    })

    // 統一格式化對應到前端 Template 用的欄位名 (全小寫)
    const formattedParents = parents.map((c) => ({
      categoryid: c.categoryID ?? c.categoryId ?? c.CategoryID,
      categoryname: c.categoryName ?? c.CategoryName,
    }))

    return [{ categoryid: 0, categoryname: '全部' }, ...formattedParents]
  })

  // 根據目前選取的大分類，動態變出對應的子分類按鈕
  const subCategories = computed(() => {
    if (currentParentId.value === 0 || !allCategories.value) return []

    // 💡 篩選出 ParentID 等於目前點選的大分類 ID 的子項目
    const subs = allCategories.value.filter((c) => {
      const pId = c.parentID ?? c.parentId ?? c.ParentID
      return pId === currentParentId.value
    })

    // 統一格式化子分類的欄位名稱
    return subs.map((c) => ({
      categoryid: c.categoryID ?? c.categoryId ?? c.CategoryID,
      categoryname: c.categoryName ?? c.CategoryName,
    }))
  })

  // === 2. 核心篩選邏輯：支援多層級與關鍵字 (Computed) ===
  const filteredArticles = computed(() => {
    return articleData.value.filter((article) => {
      // 預設符合分類
      let matchCategory = true

      // 💡 關鍵修正：相容後端可能傳來的各種大小寫欄位名 (categoryID / categoryId / CategoryID)
      const articleCategoryId = article.categoryId

      // 如果使用者有選擇特定的「大分類」（0 代表全部，不進行分類篩選）
      if (currentParentId.value !== 0) {
        if (currentSubId.value !== 0) {
          // 情況 A：使用者選了特定子分類 ➡️ 文章的分類 ID 必須「精準等於」該子分類 ID
          matchCategory = articleCategoryId === currentSubId.value
        } else {
          // 情況 B：使用者只選了大分類，沒選子分類（停在全部子項目）
          // ➡️ 撈出目前畫面上該大分類底下的所有子分類 ID 陣列
          const allowedCategoryIds = subCategories.value.map((c) => c.categoryid)

          // ➡️ 別忘了！有些文章可能直接發在大分類上，所以要把大分類自己的 ID 也加進去
          allowedCategoryIds.push(currentParentId.value)

          // ➡️ 只要文章的分類 ID 有在這一整串「允許的 ID 陣列」裡面，就算符合！
          matchCategory = allowedCategoryIds.includes(articleCategoryId)
        }
      }

      // 關鍵字比對（標題或摘要）
      const keyword = searchQuery.value.trim().toLowerCase()
      const matchKeyword =
        !keyword ||
        (article.title && article.title.toLowerCase().includes(keyword)) ||
        (article.summary && article.summary.toLowerCase().includes(keyword))

      // 同時符合分類與關鍵字才回傳
      return matchCategory && matchKeyword
    })
  })

  // === 3. 分頁切片邏輯 (Computed) ===
  // 總頁數
  const totalPages = computed(() => {
    return Math.ceil(filteredArticles.value.length / pageSize.value) || 1
  })

  // 真正渲染到畫面上的「當頁文章」
  const pagedArticles = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredArticles.value.slice(start, end)
  })

  // === 狀態重置工具 ===
  const selectParent = (id) => {
    currentParentId.value = id
    currentSubId.value = 0 // 切換大分類時，子分類歸零
    currentPage.value = 1 // 切換分類時，頁碼回到第一頁
  }

  const selectSub = (id) => {
    currentSubId.value = id
    currentPage.value = 1 // 切換子分類時，頁碼回到第一頁
  }

  const saveRecentViewedArticle = (article) => {
    const key = 'recentViewedArticles'

    const oldData = JSON.parse(localStorage.getItem(key)) || []

    const newItem = {
      articleId: article.articleId,
      title: article.title,
      categoryName: article.categoryName,
    }

    const filtered = oldData.filter((item) => item.articleId !== newItem.articleId)

    const updated = [newItem, ...filtered].slice(0, 5)

    localStorage.setItem(key, JSON.stringify(updated))
  }

  return {
    parentCategories,
    subCategories,
    isLoading,
    isError,
    currentParentId,
    currentSubId,
    searchQuery,
    currentPage,
    totalPages,
    pagedArticles, // 注意：UI 的 v-for 要改成綁定這個！
    selectParent,
    selectSub,
    fetchData,
    saveRecentViewedArticle,
  }
}
