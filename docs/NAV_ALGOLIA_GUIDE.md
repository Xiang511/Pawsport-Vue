# Nav 導航頁面 Algolia 整合指南

## 📋 概述

此指南說明如何將 Nav.vue 中的導航頁面資訊上傳到 Algolia `dev_page` 索引，讓用戶可以搜尋網站的所有頁面。

## 🗂️ 文件結構

```
docs/
  └── nav-pages.json          # 導航頁面資料（已建立）
  └── NAV_ALGOLIA_GUIDE.md    # 本說明文件

scripts/
  └── upload-nav-to-algolia.js  # 上傳腳本（已建立）
```

## 📝 資料格式

`nav-pages.json` 包含所有導航頁面的資訊，每個頁面包含：

```json
{
  "objectID": "page_home",
  "name": "首頁",
  "path": "/",
  "category": "主選單",
  "group": "導航",
  "icon": "Home",
  "type": "main",
  "description": "Petmily 首頁",
  "searchableText": "首頁 Home 主選單",
  "breadcrumb": "首頁",
  "level": 1
}
```

### 欄位說明

| 欄位 | 說明 | 範例 |
|------|------|------|
| `objectID` | 唯一識別碼 | `page_home` |
| `name` | 頁面名稱 | `首頁` |
| `path` | 路由路徑 | `/` |
| `category` | 頁面分類 | `主選單`、`寵物`、`遊戲` |
| `group` | 群組 | `導航` |
| `icon` | 圖示名稱 | `Home` |
| `type` | 類型 | `main`、`submenu`、`utility` |
| `description` | 頁面描述 | `Petmily 首頁` |
| `searchableText` | 搜尋關鍵字 | 包含中英文關鍵字 |
| `breadcrumb` | 麵包屑路徑 | `寵物 > 領養狗狗` |
| `level` | 層級 | `1`、`2` |

## 🚀 上傳步驟

### 1. 設定環境變數

確保 `.env` 檔案包含以下變數：

```env
VITE_ALGOLIA_APP_ID=你的Application ID
VITE_ALGOLIA_ADMIN_KEY=你的Admin API Key
```

⚠️ **注意**: `ADMIN_KEY` 僅用於上傳腳本，不要在前端程式碼中使用！

### 2. 執行上傳腳本

```bash
node scripts/upload-nav-to-algolia.js
```

### 3. 驗證上傳

成功上傳後會顯示：

```
✅ 資料上傳成功！
📦 已上傳的 Object IDs:
   - page_home
   - page_pet_adoption
   - page_pet_health
   ...

🎉 完成！導航頁面資料已成功上傳到 Algolia
🔍 索引名稱: dev_page
📊 記錄數量: 13
```

## 💻 前端使用

### 方法 1: 使用現有的 SearchBarAlgolia 組件

```vue
<script setup>
import SearchBarAlgolia from '@/components/Client/SearchBarAlgolia.vue'

const handleSelect = (hit) => {
  // 用戶選擇了搜尋結果
  router.push(hit.path)
}
</script>

<template>
  <SearchBarAlgolia @select="handleSelect" />
</template>
```

### 方法 2: 使用 Composable 自訂搜尋

```vue
<script setup>
import { useAlgoliaSearch } from '@/composables/useAlgoliaSearch'

// 指定使用 dev_page 索引
const { query, hits, isLoading, search } = useAlgoliaSearch('dev_page')

const handleSearch = (searchQuery) => {
  query.value = searchQuery
  search()
}
</script>

<template>
  <input v-model="query" @input="handleSearch" placeholder="搜尋頁面..." />
  
  <div v-if="isLoading">載入中...</div>
  
  <div v-for="hit in hits" :key="hit.objectID">
    <router-link :to="hit.path">
      <h3>{{ hit.name }}</h3>
      <p>{{ hit.description }}</p>
      <span>{{ hit.breadcrumb }}</span>
    </router-link>
  </div>
</template>
```

## 🔍 搜尋功能特色

### 配置的搜尋屬性（依重要性排序）

1. `name` - 頁面名稱（最重要）
2. `searchableText` - 組合搜尋文字（含中英文關鍵字）
3. `category` - 類別
4. `description` - 描述
5. `path` - 路徑

### 可篩選的屬性

- `group` - 群組（導航）
- `category` - 類別（寵物/遊戲/社群/支援/帳戶）
- `type` - 類型（main/submenu/utility）
- `level` - 層級（1或2）

### 範例搜尋

| 搜尋關鍵字 | 會找到 |
|-----------|--------|
| `領養` | 領養狗狗 |
| `game` 或 `遊戲` | 寵物知識問答 |
| `社群` 或 `community` | 社群首頁、新增貼文 |
| `FAQ` 或 `常見` | 常見問題 |
| `登入` 或 `login` | 登入 |

## 📦 包含的頁面

目前 `nav-pages.json` 包含以下頁面：

### 主選單 (1個)
- 首頁 (`/`)

### 寵物 (3個)
- 領養狗狗 (`/pet-adoption`)
- 寵物健康護照 (`/pet-health-passport`)
- 遺失協尋 (`/missing-report`)

### 遊戲 (1個)
- 寵物知識問答 (`/game`)

### 社群 (2個)
- 社群首頁 (`/community`)
- 新增貼文 (`/create-article`)

### 支援 (3個)
- 常見問題 (`/support/faq`)
- 聯絡我們 (`/support/contact`)
- 電子報訂閱 (`/support/newsletter`)

### 帳戶 (3個)
- 登入 (`/login`)
- 註冊 (`/signup`)
- 個人資料 (`/user/profile`)

**總計：13 個頁面**

## 🔄 更新頁面資料

當新增或修改 Nav.vue 中的路由時：

1. 編輯 `docs/nav-pages.json`
2. 新增或修改頁面資訊
3. 重新執行上傳腳本：
   ```bash
   node scripts/upload-nav-to-algolia.js
   ```

## ⚙️ 索引設定

上傳腳本會自動配置以下設定：

- ✅ 搜尋屬性優先順序
- ✅ 可篩選屬性（facets）
- ✅ 自定義排名（優先顯示主選單）
- ✅ 高亮顯示設定
- ✅ 錯別字容忍度
- ✅ 每頁顯示 20 筆結果

## 🐛 常見問題

### Q: 上傳失敗，顯示認證錯誤
A: 檢查 `.env` 檔案中的 `VITE_ALGOLIA_APP_ID` 和 `VITE_ALGOLIA_ADMIN_KEY` 是否正確。

### Q: 前端搜尋不到結果
A: 
1. 確認資料已成功上傳到 Algolia
2. 檢查前端使用的索引名稱是否為 `dev_page`
3. 在 Algolia Dashboard 中測試搜尋

### Q: 如何新增更多頁面？
A: 編輯 `docs/nav-pages.json`，參考現有格式新增頁面資訊，然後重新執行上傳腳本。

### Q: 可以在開發環境測試嗎？
A: 可以！建議建立一個測試用的 Algolia Application，使用不同的 `APP_ID` 和 `ADMIN_KEY`。

## 📚 相關文件

- [Algolia 搜尋整合指南](./ALGOLIA_GUIDE.md)
- [Sidebar Algolia 整合指南](./SIDEBAR_ALGOLIA_GUIDE.md)
- [Algolia 官方文件](https://www.algolia.com/doc/)

## 🎯 下一步

1. ✅ 建立 `nav-pages.json` 資料檔案
2. ✅ 建立上傳腳本
3. ⏳ 設定 Algolia 環境變數
4. ⏳ 執行上傳腳本
5. ⏳ 在前端整合搜尋功能
6. ⏳ 測試搜尋功能

---

**建立日期**: 2026-05-24  
**維護者**: Petmily 開發團隊
