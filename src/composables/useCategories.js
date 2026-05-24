import { ref } from 'vue'
import request from '@/api/axios'

export function useCategories() {
  const categoriesData = ref({})
  const isCategoryLoading = ref(false)

  //把資料轉換成需要的格式
  const transformCategories = (apiData) => {
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

  const fetchCategories = async () => {
    isCategoryLoading.value = true
    try {
      const response = await request.get('/Category')
      // 先用 transformCategories 洗過
      categoriesData.value = transformCategories(response.data.data)
    } catch (error) {
      console.error('取得分類失敗：', error)
      throw error
    } finally {
      isCategoryLoading.value = false
    }
  }

  return {
    categoriesData,
    isCategoryLoading,
    fetchCategories,
  }
}
