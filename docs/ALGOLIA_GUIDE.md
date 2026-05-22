# Algolia 搜尋整合指南

## 📋 目錄
1. [前置準備](#前置準備)
2. [設定步驟](#設定步驟)
3. [使用方法](#使用方法)
4. [進階功能](#進階功能)
5. [常見問題](#常見問題)

---

## 前置準備

### 1. 註冊 Algolia 帳號
1. 前往 [Algolia 官網](https://www.algolia.com/) 註冊帳號
2. 建立一個新的 Application
3. 記下你的 **Application ID**

### 2. 取得 API Keys
在 Algolia Dashboard 中：
1. 前往 **Settings** > **API Keys**
2. 找到 **Search-Only API Key**（重要：不要使用 Admin API Key）
3. 複製這個 Key

### 3. 建立索引 (Index)
1. 在 Algolia Dashboard 點選 **Indices**
2. 建立一個新的索引，例如 `players`
3. 上傳你的資料（可以透過 Dashboard、API 或自動同步）

---

## 設定步驟

### 步驟 1: 安裝套件（已完成）
```bash
npm install vue-instantsearch@4 algoliasearch@4
```

### 步驟 2: 設定環境變數
1. 複製 `.env.example` 為 `.env`：
```bash
cp .env.example .env
```

2. 在 `.env` 文件中填入你的 Algolia 資訊：
```env
VITE_ALGOLIA_APP_ID=你的Application ID
VITE_ALGOLIA_SEARCH_KEY=你的Search-Only API Key
VITE_ALGOLIA_INDEX_NAME=你的索引名稱
```

⚠️ **重要**: `.env` 文件不應該被 commit 到 Git，請確保它在 `.gitignore` 中。

### 步驟 3: 配置檢查
確認以下文件已建立：
- ✅ `src/config/algolia.js` - Algolia 配置
- ✅ `src/composables/useAlgoliaSearch.js` - 搜尋邏輯
- ✅ `src/components/Tailadmin/Game/SearchBarAlgolia.vue` - 範例組件

---

## 使用方法

### 方法 1: 使用完整的 SearchBarAlgolia 組件

在你的頁面或佈局中引入並使用：

```vue
<script setup>
import SearchBarAlgolia from '@/components/Tailadmin/Game/SearchBarAlgolia.vue'

const handleSearch = (result) => {
  console.log('搜尋結果:', result)
}

const handleSelect = (hit) => {
  console.log('選擇了:', hit)
  // 執行你的邏輯，例如導航到詳細頁面
  // router.push(`/players/${hit.objectID}`)
}
</script>

<template>
  <SearchBarAlgolia 
    @search="handleSearch"
    @select="handleSelect"
  />
</template>
```

### 方法 2: 使用 Composable 自定義

如果你想完全自定義 UI，可以直接使用 composable：

```vue
<script setup>
import { useAlgoliaSearch } from '@/composables/useAlgoliaSearch'

const { query, hits, isLoading, error, search } = useAlgoliaSearch()

// 方式 1: 自動搜尋（當 query 改變時）
// query.value = '搜尋關鍵字'

// 方式 2: 手動觸發搜尋
const handleSearch = () => {
  search(query.value)
}
</script>

<template>
  <div>
    <input v-model="query" placeholder="搜尋..." />
    
    <div v-if="isLoading">載入中...</div>
    <div v-if="error">{{ error }}</div>
    
    <ul>
      <li v-for="hit in hits" :key="hit.objectID">
        {{ hit.name }}
      </li>
    </ul>
  </div>
</template>
```

### 方法 3: 修改現有的 SearchBar

如果你想修改現有的 `SearchBar.vue`，可以這樣做：

```vue
<script setup>
import { useAlgoliaSearch } from '@/composables/useAlgoliaSearch'

const emit = defineEmits(['search'])

// 使用 Algolia
const { query, hits, isLoading } = useAlgoliaSearch()

// 當輸入改變時，hits 會自動更新
// 你可以 emit 結果給父組件
watch(hits, (newHits) => {
  emit('search', newHits)
})
</script>
```

---

## 進階功能

### 1. 自定義搜尋參數

在 `src/config/algolia.js` 中調整搜尋選項：

```javascript
export const algoliaConfig = {
  // ...其他設定
  
  searchOptions: {
    hitsPerPage: 20,  // 調整每頁結果數
    
    // 指定要搜尋的屬性
    attributesToRetrieve: ['name', 'id', 'avatar', 'email'],
    
    // 指定要高亮的屬性
    attributesToHighlight: ['name', 'id'],
    
    // 過濾條件
    filters: 'status:active',
    
    // 分面搜尋
    facets: ['category', 'level'],
  }
}
```

### 2. 多索引搜尋

如果你需要同時搜尋多個索引：

```javascript
const { query, hits: playersHits } = useAlgoliaSearch('players')
const { hits: itemsHits } = useAlgoliaSearch('items')
```

### 3. 排序和篩選

```javascript
const search = async (searchQuery) => {
  const result = await index.search(searchQuery, {
    ...algoliaConfig.searchOptions,
    
    // 排序
    sortBy: 'level:desc',
    
    // 數值範圍篩選
    numericFilters: ['level>=10', 'level<=50'],
    
    // 地理位置搜尋
    aroundLatLng: '40.71,-74.01',
    aroundRadius: 1000,
  })
}
```

### 4. 搜尋分析

Algolia 自動記錄搜尋分析，你可以在 Dashboard 查看：
- 熱門搜尋關鍵字
- 無結果的搜尋
- 點擊率
- 轉換率

---

## 資料結構建議

你的 Algolia 索引資料應該包含：

```json
{
  "objectID": "player_123",
  "name": "玩家名稱",
  "id": "P123456",
  "email": "player@example.com",
  "avatar": "https://...",
  "level": 25,
  "status": "active",
  "createdAt": 1234567890,
  "tags": ["premium", "verified"]
}
```

**重要屬性**:
- `objectID`: 必須，唯一識別碼
- 其他屬性根據你的需求自定義

---

## 上傳資料到 Algolia

### 方法 1: 透過 Dashboard（小量資料）
在 Algolia Dashboard 手動上傳 JSON 文件

### 方法 2: 透過 API（推薦）

建立一個資料同步腳本：

```javascript
// scripts/sync-algolia.js
import algoliasearch from 'algoliasearch'

const client = algoliasearch('YOUR_APP_ID', 'YOUR_ADMIN_API_KEY')
const index = client.initIndex('players')

// 準備資料
const records = [
  { objectID: '1', name: '玩家一', id: 'P001' },
  { objectID: '2', name: '玩家二', id: 'P002' },
  // ...更多資料
]

// 批次上傳
index.saveObjects(records)
  .then(({ objectIDs }) => {
    console.log('上傳成功:', objectIDs)
  })
  .catch(error => {
    console.error('上傳失敗:', error)
  })
```

執行：
```bash
node scripts/sync-algolia.js
```

### 方法 3: 自動同步（進階）

如果你有後端 API，可以在新增/更新/刪除資料時自動同步到 Algolia：

```javascript
// 後端範例
async function createPlayer(playerData) {
  // 1. 儲存到資料庫
  const player = await db.players.create(playerData)
  
  // 2. 同步到 Algolia
  await algoliaIndex.saveObject({
    objectID: player.id,
    ...playerData
  })
  
  return player
}
```

---

## 常見問題

### Q1: 為什麼搜尋沒有結果？
- ✅ 檢查 Application ID 和 API Key 是否正確
- ✅ 確認索引名稱是否正確
- ✅ 確認索引中有資料
- ✅ 檢查瀏覽器 Console 是否有錯誤訊息

### Q2: 搜尋速度慢怎麼辦？
- 減少 `hitsPerPage` 數量
- 限制 `attributesToRetrieve`
- 使用 `lite` 版本的客戶端（已使用）

### Q3: 如何自定義搜尋結果的顯示？
修改 `SearchBarAlgolia.vue` 中的結果列表模板即可。

### Q4: 可以搜尋中文嗎？
可以！Algolia 支援多語言，包括中文。如需更好的中文搜尋體驗，可以在索引設定中調整 `queryLanguages`。

### Q5: 免費方案有限制嗎？
Algolia 免費方案包含：
- 10,000 次搜尋請求/月
- 10,000 條記錄

超過需要升級付費方案。

### Q6: 如何保護 API Key？
- ✅ 使用 Search-Only API Key（不是 Admin API Key）
- ✅ 在前端只使用 Search-Only Key
- ✅ 資料寫入操作應該在後端進行

---

## 相關資源

- [Algolia 官方文檔](https://www.algolia.com/doc/)
- [Vue InstantSearch 文檔](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/vue/)
- [Algolia Dashboard](https://dashboard.algolia.com/)
- [搜尋最佳實踐](https://www.algolia.com/doc/guides/managing-results/relevance-overview/)

---

## 下一步

1. ✅ 設定 `.env` 文件
2. ✅ 上傳測試資料到 Algolia
3. ✅ 測試搜尋功能
4. ✅ 根據需求自定義 UI
5. ✅ 設定搜尋分析

如有任何問題，請參考 Algolia 官方文檔或提出 issue。
