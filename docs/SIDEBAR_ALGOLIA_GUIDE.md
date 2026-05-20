# Sidebar 菜單搜尋整合指南

## 📋 概述

這份指南說明如何將 Pawsport-Vue 的 Sidebar 菜單資訊導出成 JSON 格式，並上傳到 Algolia，實現快速的菜單搜尋功能。

## 🎯 功能特點

✅ **即時搜尋菜單項目** - 輸入即搜，快速找到功能  
✅ **智能排序** - 依菜單層級和名稱排序  
✅ **多語言支援** - 支援中文和英文搜尋  
✅ **同義詞支援** - 例如「會員」=「用戶」=「使用者」  
✅ **麵包屑導航** - 顯示完整的菜單路徑  
✅ **標籤標示** - 顯示 PRO、NEW 等標籤  

---

## 🚀 快速開始

### 步驟 1: 導出 Sidebar 資料

執行導出腳本，將 Sidebar 菜單資訊轉換成 JSON 格式：

```bash
node scripts/export-sidebar-to-algolia.js
```

這會：
1. ✅ 讀取 `AppSidebar.vue` 中的菜單結構
2. ✅ 轉換成 Algolia 可用的 JSON 格式
3. ✅ 輸出到 `sidebar-algolia.json` 文件
4. ✅ 顯示統計資訊

**輸出範例：**
```
📋 開始導出 Sidebar 資料...

✅ 轉換完成！
📊 總共有 21 個選單項目

📁 類別統計：
   會員: 3 個項目
   寵物: 4 個項目
   遊戲: 3 個項目
   社群: 4 個項目
   客服: 4 個項目
   系統設定: 2 個項目

💾 JSON 已儲存到: ./sidebar-algolia.json
```

### 步驟 2: 設定環境變數

在 `.env` 文件中添加 Algolia 配置（如果還沒有的話）：

```env
# 複製 .env.example
cp .env.example .env

# 編輯 .env 文件
VITE_ALGOLIA_APP_ID=你的Application_ID
VITE_ALGOLIA_ADMIN_KEY=你的Admin_API_Key  # 僅用於上傳腳本
VITE_ALGOLIA_SEARCH_KEY=你的Search_API_Key
VITE_ALGOLIA_MENU_INDEX_NAME=menu_items
```

⚠️ **重要**: 
- `VITE_ALGOLIA_ADMIN_KEY` 只用於上傳腳本，**不要**在前端代碼中使用
- 前端只使用 `VITE_ALGOLIA_SEARCH_KEY`（Search-Only API Key）

### 步驟 3: 上傳到 Algolia

執行上傳腳本：

```bash
node scripts/upload-sidebar-to-algolia.js
```

這會：
1. ✅ 連接到 Algolia
2. ✅ 創建或更新 `menu_items` 索引
3. ✅ 上傳所有菜單項目
4. ✅ 配置索引設定（搜尋屬性、同義詞等）

**輸出範例：**
```
🚀 開始上傳 Sidebar 資料到 Algolia...

📊 準備上傳 21 個選單項目到索引: menu_items

✅ 資料上傳成功！
📦 已上傳的 Object IDs (前 10 個):
   - menu_1
   - menu_2
   ...

⚙️  配置索引設定...
✅ 索引設定配置完成
✅ 同義詞設定完成

🎉 完成！Sidebar 資料已成功上傳到 Algolia
```

---

## 📄 JSON 資料結構

每個菜單項目的 JSON 格式：

```json
{
  "objectID": "menu_1",
  "name": "基本資料",
  "path": "/dashboard/member",
  "category": "會員",
  "group": "選單",
  "icon": "UsersRound",
  "type": "submenu",
  "isPro": false,
  "isNew": false,
  "searchableText": "基本資料 會員 選單",
  "breadcrumb": "選單 > 會員 > 基本資料",
  "level": 2
}
```

**欄位說明：**
- `objectID`: 唯一識別碼
- `name`: 菜單項目名稱
- `path`: 路由路徑
- `category`: 父級類別（會員、寵物、遊戲等）
- `group`: 群組名稱（選單、其他）
- `icon`: 圖示名稱
- `type`: 類型（menu 或 submenu）
- `isPro`: 是否為 Pro 功能
- `isNew`: 是否為新功能
- `searchableText`: 組合搜尋文字
- `breadcrumb`: 完整路徑
- `level`: 菜單層級（1=一級，2=二級）

---

## 🎨 使用菜單搜尋組件

### 方法 1: 使用 SearchBarMenu 組件

在 Header 中使用專門的菜單搜尋組件：

```vue
<script setup>
import SearchBarMenu from '@/components/Tailadmin/layout/header/SearchBarMenu.vue'

const handleSelectMenuItem = (menuItem) => {
  console.log('選擇了菜單:', menuItem)
  // 自動導航到該頁面
}
</script>

<template>
  <SearchBarMenu @select="handleSelectMenuItem" />
</template>
```

### 方法 2: 使用 useAlgoliaSearch Composable

在自定義組件中使用：

```vue
<script setup>
import { useAlgoliaSearch } from '@/composables/useAlgoliaSearch'

// 使用菜單索引
const { query, hits, isLoading } = useAlgoliaSearch('menu')

// query.value = '會員' 會自動搜尋
</script>
```

### 方法 3: 替換現有的 SearchBar

在 `AppHeader.vue` 中替換原本的 SearchBar：

```vue
<!-- 原本 -->
<SearchBar />

<!-- 替換成 -->
<SearchBarMenu />
```

---

## ⚙️ Algolia 索引配置

上傳腳本會自動配置以下設定：

### 搜尋屬性（依重要性）
1. `name` - 菜單名稱（最重要）
2. `searchableText` - 組合搜尋文字
3. `category` - 類別
4. `path` - 路徑

### 過濾和分面屬性
- `group` - 群組
- `category` - 類別
- `type` - 類型
- `level` - 層級
- `isPro` - Pro 功能
- `isNew` - 新功能

### 同義詞設定
腳本會自動設定以下同義詞：

| 概念 | 同義詞 |
|------|--------|
| 會員 | 會員、用戶、使用者、member、user |
| 寵物 | 寵物、毛孩、pet、animal |
| 遊戲 | 遊戲、題庫、game、quiz |
| 社群 | 社群、貼文、文章、community、post、article |
| 客服 | 客服、支援、幫助、support、help、faq |
| 設定 | 設定、設置、配置、settings、config |

---

## 🔄 更新流程

當 Sidebar 菜單有變更時：

1. **更新 `AppSidebar.vue`** - 修改菜單結構
2. **更新導出腳本** - 如果需要，更新 `export-sidebar-to-algolia.js` 中的 menuGroups
3. **重新導出** - 執行 `node scripts/export-sidebar-to-algolia.js`
4. **重新上傳** - 執行 `node scripts/upload-sidebar-to-algolia.js`

💡 **提示**: 你可以創建一個 npm script 來簡化流程：

```json
// package.json
{
  "scripts": {
    "algolia:export": "node scripts/export-sidebar-to-algolia.js",
    "algolia:upload-menu": "node scripts/upload-sidebar-to-algolia.js",
    "algolia:sync-menu": "npm run algolia:export && npm run algolia:upload-menu"
  }
}
```

然後只需執行：
```bash
npm run algolia:sync-menu
```

---

## 🛠️ 腳本選項

### export-sidebar-to-algolia.js

```bash
# 基本導出
node scripts/export-sidebar-to-algolia.js
```

這會輸出 JSON 到控制台並儲存到 `sidebar-algolia.json`

### upload-sidebar-to-algolia.js

```bash
# 上傳資料
node scripts/upload-sidebar-to-algolia.js

# 清空索引（謹慎使用！）
node scripts/upload-sidebar-to-algolia.js clear
```

---

## 🔍 搜尋測試

上傳完成後，可以在 Algolia Dashboard 測試搜尋：

1. 前往 https://dashboard.algolia.com/
2. 選擇你的 Application
3. 點選 `menu_items` 索引
4. 在搜尋框輸入關鍵字測試

**測試範例：**
- 輸入「會員」→ 應該找到「基本資料」、「違規名單」、「權限管理」
- 輸入「寵物」→ 應該找到「寵物資訊一覽」、「健康護照」等
- 輸入「user」→ 應該找到「會員」相關項目（同義詞）

---

## 📊 資料統計

目前的 Sidebar 包含：

| 類別 | 項目數 |
|------|--------|
| 會員 | 3 |
| 寵物 | 4 |
| 遊戲 | 3 |
| 社群 | 4 |
| 客服 | 4 |
| 系統設定 | 2 |
| **總計** | **21** |

---

## ❓ 常見問題

### Q1: 為什麼搜尋沒有結果？

檢查清單：
- ✅ 確認已執行上傳腳本
- ✅ 檢查 `.env` 中的 API Keys 是否正確
- ✅ 確認索引名稱是 `menu_items`
- ✅ 在 Algolia Dashboard 檢查資料是否存在

### Q2: 如何添加新的菜單項目到搜尋？

1. 在 `AppSidebar.vue` 中添加新的菜單項目
2. 在 `export-sidebar-to-algolia.js` 中同步更新 menuGroups
3. 重新執行導出和上傳腳本

### Q3: 可以搜尋英文嗎？

可以！索引配置支援中英文搜尋，且設定了同義詞。

### Q4: 如何自定義搜尋結果的顯示？

修改 `SearchBarMenu.vue` 組件中的模板部分即可。

### Q5: 搜尋會收費嗎？

Algolia 免費方案包含：
- 10,000 次搜尋請求/月
- 10,000 條記錄

菜單搜尋只有約 20 條記錄，完全在免費額度內。

### Q6: 導出的 JSON 文件可以手動上傳嗎？

可以！在 Algolia Dashboard 中：
1. 選擇 `menu_items` 索引
2. 點選「Add records」
3. 上傳 `sidebar-algolia.json` 文件

---

## 🎯 進階功能

### 自定義同義詞

在 `upload-sidebar-to-algolia.js` 的 `configureSynonyms` 函數中添加：

```javascript
{
  objectID: 'custom_synonym',
  type: 'synonym',
  synonyms: ['關鍵字1', '關鍵字2', 'keyword1', 'keyword2']
}
```

### 自定義排序

在 `configureMenuIndex` 函數中修改 `customRanking`：

```javascript
customRanking: [
  'asc(level)',     // 先顯示一級選單
  'desc(isNew)',    // 新功能優先
  'asc(name)',      // 再按名稱排序
]
```

### 添加分析追蹤

使用 Algolia Insights API 追蹤搜尋和點擊：

```javascript
import aa from 'search-insights'

// 初始化
aa('init', {
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_SEARCH_KEY'
})

// 追蹤點擊
aa('clickedObjectIDsAfterSearch', {
  index: 'menu_items',
  eventName: 'Menu item clicked',
  objectIDs: [hit.objectID],
  queryID: result.queryID
})
```

---

## 📚 相關資源

- [Algolia 官方文檔](https://www.algolia.com/doc/)
- [Algolia Dashboard](https://dashboard.algolia.com/)
- [Vue InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/vue/)
- [主 Algolia 整合指南](./ALGOLIA_GUIDE.md)

---

## 🎉 完成檢查清單

- [ ] 執行導出腳本生成 JSON
- [ ] 設定環境變數
- [ ] 執行上傳腳本
- [ ] 在 Algolia Dashboard 確認資料
- [ ] 測試搜尋功能
- [ ] 整合 SearchBarMenu 組件
- [ ] 測試菜單導航

---

如有任何問題，請參考 [ALGOLIA_GUIDE.md](./ALGOLIA_GUIDE.md) 或提出 issue。
