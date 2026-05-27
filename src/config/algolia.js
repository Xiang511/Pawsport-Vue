/**
 * Algolia 搜尋配置
 *
 * 使用方式：
 * 1. 到 Algolia Dashboard (https://dashboard.algolia.com) 取得你的 API Keys
 * 2. 替換下方的 appId、apiKey、indexName
 * 3. 建議在環境變數中設置這些值，不要直接寫在代碼中
 */

export const algoliaConfig = {
  // 從 Algolia Dashboard 取得
  appId: import.meta.env.VITE_ALGOLIA_APP_ID || 'YOUR_APP_ID',

  // 使用 Search-Only API Key (不要使用 Admin API Key)
  apiKey: import.meta.env.VITE_ALGOLIA_SEARCH_KEY || 'YOUR_SEARCH_API_KEY',

  // 索引配置
  indices: {
    // 玩家搜尋索引
    players: {
      name: import.meta.env.VITE_ALGOLIA_INDEX_NAME || 'players',
      searchOptions: {
        hitsPerPage: 10,
        attributesToRetrieve: ['*'],
        attributesToHighlight: ['name', 'id'],
      },
    },

    // 菜單搜尋索引
    menu: {
      name: import.meta.env.VITE_ALGOLIA_MENU_INDEX_NAME || 'menu_items',
      searchOptions: {
        hitsPerPage: 20,
        attributesToRetrieve: [
          'name',
          'path',
          'category',
          'group',
          'icon',
          'breadcrumb',
          'type',
          'level',
          'isPro',
          'isNew',
        ],
        attributesToHighlight: ['name', 'category', 'searchableText'],
      },
    },

    // 導航頁面搜尋索引
    dev_page: {
      name: import.meta.env.VITE_ALGOLIA_INDEX_NAME || 'dev_PAGENAME',
      searchOptions: {
        hitsPerPage: 20,
        attributesToRetrieve: [
          'name',
          'path',
          'category',
          'group',
          'icon',
          'breadcrumb',
          'type',
          'description',
          'level',
        ],
        attributesToHighlight: ['name', 'description', 'searchableText'],
      },
    },
  },

  // 預設索引名稱（向後兼容）
  get indexName() {
    return this.indices.players.name
  },

  // 預設搜尋配置（向後兼容）
  get searchOptions() {
    return this.indices.players.searchOptions
  },
}
