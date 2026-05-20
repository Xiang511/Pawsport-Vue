/**
 * Algolia 搜尋 Composable
 * 
 * 使用方式：
 * 
 * // 預設使用 players 索引
 * const { query, hits, isLoading, error, search } = useAlgoliaSearch()
 * 
 * // 使用菜單索引
 * const { query, hits, isLoading, error, search } = useAlgoliaSearch('menu')
 * 
 * // 使用自定義索引配置
 * const { query, hits, isLoading, error, search } = useAlgoliaSearch({
 *   indexName: 'custom_index',
 *   searchOptions: { hitsPerPage: 5 }
 * })
 * 
 * // 執行搜尋
 * search('搜尋關鍵字')
 * 
 * // 或使用 reactive query
 * query.value = '搜尋關鍵字'
 */

import { ref, watch } from 'vue'
import algoliasearch from 'algoliasearch/lite'
import { algoliaConfig } from '@/config/algolia'

export function useAlgoliaSearch(indexConfig = 'players') {
    // 解析索引配置
    let indexName, searchOptions

    if (typeof indexConfig === 'string') {
        // 使用預定義的索引配置
        const config = algoliaConfig.indices[indexConfig]
        if (!config) {
            console.error(`找不到索引配置: ${indexConfig}`)
            indexName = algoliaConfig.indexName
            searchOptions = algoliaConfig.searchOptions
        } else {
            indexName = config.name
            searchOptions = config.searchOptions
        }
    } else if (typeof indexConfig === 'object') {
        // 使用自定義配置
        indexName = indexConfig.indexName || algoliaConfig.indexName
        searchOptions = indexConfig.searchOptions || algoliaConfig.searchOptions
    } else {
        // 預設配置
        indexName = algoliaConfig.indexName
        searchOptions = algoliaConfig.searchOptions
    }

    // 初始化 Algolia 客戶端
    const searchClient = algoliasearch(
        algoliaConfig.appId,
        algoliaConfig.apiKey
    )

    const index = searchClient.initIndex(indexName)

    // 搜尋狀態
    const query = ref('')
    const hits = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    const nbHits = ref(0)

    // 防抖計時器
    let timeoutId = null

    /**
     * 執行搜尋
     */
    const search = async (searchQuery) => {
        // 如果搜尋字串為空，清空結果
        if (!searchQuery || searchQuery.trim() === '') {
            hits.value = []
            nbHits.value = 0
            return
        }

        isLoading.value = true
        error.value = null

        try {
            const result = await index.search(searchQuery, searchOptions)

            hits.value = result.hits
            nbHits.value = result.nbHits
        } catch (err) {
            console.error('Algolia 搜尋錯誤:', err)
            error.value = err.message || '搜尋失敗，請稍後再試'
        } finally {
            isLoading.value = false
        }
    }

    /**
     * 帶防抖的搜尋
     */
    const debouncedSearch = (searchQuery, delay = 300) => {
        if (timeoutId) clearTimeout(timeoutId)

        timeoutId = setTimeout(() => {
            search(searchQuery)
        }, delay)
    }

    /**
     * 監聽 query 變化自動搜尋
     */
    watch(query, (newValue) => {
        debouncedSearch(newValue)
    })

    /**
     * 清空搜尋結果
     */
    const clearResults = () => {
        query.value = ''
        hits.value = []
        nbHits.value = 0
        error.value = null
    }

    return {
        // 狀態
        query,
        hits,
        isLoading,
        error,
        nbHits,

        // 方法
        search,
        debouncedSearch,
        clearResults,

        // 索引資訊
        indexName
    }
}
