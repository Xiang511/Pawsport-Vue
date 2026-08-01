# Petmily Vue — Claude 專案設定

## 專案知識圖譜

@KNOWLEDGE_GRAPH.md

---

## 專案基本資訊

- **專案名稱**：Petmily（PawsPort）前端
- **框架**：Vue 3 + Vite + Tailwind CSS 4
- **語言**：JavaScript（主）、TypeScript（部分 stores）
- **套件管理**：npm

## 啟動指令

```bash
# 開發伺服器（HTTPS，port 5173）
npm run dev

# 建置
npm run build

# 格式化
npm run format

# Lint 修正
npm run lint
```

## 開發環境

- 前端：`https://localhost:5173`
- 後端 API（Proxy）：`https://localhost:7048`
- 所有 `/api/*` 請求透過 Vite proxy 轉發到後端，不需加 domain

## 路徑別名

`@` 對應 `./src`，例如 `@/stores/auth.js` = `src/stores/auth.js`

## 重要規則

### API 呼叫
- 一律使用 `@/api/axios.js` 的實例，不要直接 import axios
- baseURL 已設為 `/api`，呼叫時只需寫相對路徑，例如 `request.get('/users/1')`

### 狀態管理
- 登入狀態讀取用 `useAuthStore`（`stores/auth.js`）
- 遊戲玩家狀態用 `usePlayerStore`（`stores/usePlayerStore.ts`）
- 兩者都有 localStorage 持久化，重新整理後狀態保留

### 路由守衛
- `/user/*`、`/game/*`、`/healthpassport/*` 需要登入
- 訪問 `/dashboard/*` 會強制登出並跳到 `/dashboard/login`
- 未登入訪問受保護路由 → 跳到 `/login`

### 目錄慣例
- 前台元件放 `src/components/Client/`
- 後台元件放 `src/components/Tailadmin/`
- 前台頁面放 `src/views/Client/`
- 後台頁面放 `src/views/Tailadmin/`
- 業務邏輯抽取到 `src/composables/`

### 命名規範
- 元件檔名：PascalCase（`ProfileView.vue`）
- composables：camelCase + use 前綴（`useAuthStore`、`useGameAudio`）
- 後台專屬 composables 放在 `composables/Tailadmin/`

## 色彩主題（前台）

| 變數用途 | 色碼 |
|---------|------|
| 深綠（主色） | `#445944` |
| 奶油色（背景） | `#FAE4AE` |
| 棕色（強調） | `#9C6D6D` |
