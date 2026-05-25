import { ref, computed } from 'vue'
import request from '@/api/axios'

export function useCommunityHome() {
  // === 原始資料管理 ===
  const allCategories = ref([]) // 儲存後端回傳的所有原始分類
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
        request.get('/Users/articles'),
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

  const getCategoryId = (c) => {
    return Number(c.categoryId ?? c.categoryID ?? c.CategoryID ?? c.categoryid)
  }

  const getCategoryName = (c) => {
    return c.categoryName ?? c.CategoryName ?? c.categoryname
  }

  const getParentId = (c) => {
    const value = c.parentId ?? c.parentID ?? c.ParentID ?? c.parentid
    return value === null || value === undefined ? null : Number(value)
  }

  const getLevel = (c) => {
    const value = c.level ?? c.Level
    return value === null || value === undefined ? null : Number(value)
  }

  const getArticleCategoryId = (article) => {
    return Number(
      article.categoryId ?? article.categoryID ?? article.CategoryID ?? article.categoryid,
    )
  }

  // === 1. 分類階層化處理 (Computed) ===
  const parentCategories = computed(() => {
    if (!allCategories.value || allCategories.value.length === 0) {
      return [{ categoryid: 0, categoryname: '全部' }]
    }

    const parents = allCategories.value.filter((c) => {
      return Number(c.level) === 0 || c.parentId === null
    })

    return [
      { categoryid: 0, categoryname: '全部' },
      ...parents.map((c) => ({
        categoryid: Number(c.categoryId),
        categoryname: c.categoryName,
      })),
    ]
  })

  // 根據目前選取的大分類，動態變出對應的子分類按鈕
  const subCategories = computed(() => {
    if (Number(currentParentId.value) === 0) return []

    return allCategories.value
      .filter((c) => Number(c.parentId) === Number(currentParentId.value))
      .map((c) => ({
        categoryid: Number(c.categoryId),
        categoryname: c.categoryName,
      }))
  })

  // === 2. 核心篩選邏輯：支援多層級與關鍵字 (Computed) ===
  const filteredArticles = computed(() => {
    return articleData.value.filter((article) => {
      let matchCategory = true

      const articleCategoryId = getArticleCategoryId(article)
      const parentId = Number(currentParentId.value)
      const subId = Number(currentSubId.value)

      if (parentId !== 0) {
        if (subId !== 0) {
          // 選了小分類：只顯示這個小分類的文章
          matchCategory = articleCategoryId === subId
        } else {
          // 只選大分類：顯示該大分類本身 + 底下所有小分類的文章
          const allowedCategoryIds = subCategories.value.map((c) => Number(c.categoryid))

          // 如果有文章直接掛在大分類，也一起顯示
          allowedCategoryIds.push(parentId)

          matchCategory = allowedCategoryIds.includes(articleCategoryId)
        }
      }

      const keyword = searchQuery.value.trim().toLowerCase()
      const matchKeyword =
        !keyword ||
        article.title?.toLowerCase().includes(keyword) ||
        article.summary?.toLowerCase().includes(keyword)

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
    currentParentId.value = Number(id)
    currentSubId.value = 0
    currentPage.value = 1
  }

  const selectSub = (id) => {
    currentSubId.value = Number(id)
    currentPage.value = 1
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
