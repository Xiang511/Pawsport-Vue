# Petmily — 寵物媒合平台

![GitHub last commit](https://img.shields.io/github/last-commit/Xiang511/Petmily-Vue?display_timestamp=committer&style=flat-square) ![GitHub commit activity](https://img.shields.io/github/commit-activity/y/Xiang511/Petmily-Vue?style=flat-square) ![GitHub Created At](https://img.shields.io/github/created-at/Xiang511/Petmily-Vue?style=flat-square) ![GitHub License](https://img.shields.io/github/license/Xiang511/Petmily-Vue?style=flat-square)

我們都很關注流浪動物領養議題，也觀察到目前社會上養寵物的風氣越趨興盛，所以想要打造一個讓人們可以安心使用的寵物領養平台，並鼓勵領養代替購買。

同時藉著此平台，宣導寵物相關新知並透過遊戲的方式讓有興趣領養的人更了解如何照顧小動物、並且提供論壇讓飼主有可以互相交流的地方、也能讓飼主註冊登入此平台後記錄寵物的相關訊息，若對於平台提供的資訊有疑慮或是有其他想法亦能透過AI或真人客服尋求解答。


## Features

- **會員系統** 
    - **基本功能** — 註冊、登入、管理個人資料
    - **權限管理** — Scope RBAC 、 登入IP紀錄與地圖化顯示
    - **驗證管理** — Email 驗證、密碼重設、Google OAuth、JWT

- **寵物系統**
    - **寵物領養** — 刊登、瀏覽、申請領養寵物
    - **健康護照** — 記錄寵物病歷、疫苗、體重與照片
    - **走失協尋** — 刊登走失寵物，支援地圖定位

- **遊戲系統**
    - **領養知識遊戲** — 寵物主題 Q&A，積分兌換外觀道具

- **社群系統**
    - **基本功能** — 發文、留言
    - **草稿匣** — 儲存未完成的文章，隨時編輯發布
    - **標籤(TAG)** — 文章標籤分類，方便搜尋與瀏覽
    - **父子分類** — 文章分類支援父子結構，方便搜尋與瀏覽
    - **最近瀏覽** — 記錄使用者最近瀏覽的文章，方便回顧與管理
     
- **客服系統**
    - **LINE BOT** — 提供寵物相關資訊與服務
    - **AI 客服** — ChatGPT 即時回應常見問題
    - **真人客服** — Microsoft SignalR 即時通訊
    - **電子報** — 定期發送寵物相關資訊與活動消息
    - **常見問題** — 提供常見問題解答，方便使用者查詢
    - **QA紀錄** — 記錄使用者與客服的對話紀錄，方便後續追蹤與分析

- **其他內容**
    - **後台管理** — 會員、寵物、遊戲、社群、客服一站式管理
    - **Algolia 全站搜尋** — 文章、導覽列、側邊欄即時搜尋



## Tech stack

| 分類 | 技術 |
|------|------|
| 前端框架 | Vue 3 + Vite |
| 狀態管理 | Pinia |
| 路由 | Vue Router 4 |
| 樣式 | Tailwind CSS 4 |
| 圖表 | Chart.js、ApexCharts |
| 地圖 | Leaflet |
| 搜尋 | Algolia |
| 身份驗證 | Google OAuth (vue3-google-login) |
| 即時通訊 | Microsoft SignalR |
| 富文字編輯器 | Quill |



## 專案結構

```
src/
├── api/                    # Axios 攔截器
├── assets/                 # 全域樣式
├── components/
│   ├── Client/             # 前台元件（導覽列、文章、健康護照等）
│   └── Tailadmin/          # 後台元件（圖表、表格、UI 元件庫）
├── composables/            # Vue Composables（搜尋、文章、音效等）
├── config/                 # Google OAuth、Algolia 設定
├── layouts/
│   ├── Client/             # 前台版型
│   └── Tailadmin/          # 後台版型
├── router/
│   ├── index.js            # 主路由（含身份驗證守衛）
│   ├── Client/             # 前台路由
│   └── Tailadmin/          # 後台路由
├── stores/
│   ├── auth.js             # 使用者身份驗證狀態
│   └── usePlayerStore.ts   # 遊戲玩家狀態
├── views/
│   ├── Client/             # 前台頁面
│   └── Tailadmin/          # 後台頁面
└── main.js                 # 應用程式入口
```


## CI/CD

| Workflow | 觸發條件 | 說明 |
|----------|----------|------|
| `lint.yml` | Push | ESLint 自動檢查 |
| `deploy.yml` | 手動觸發 | 建置並部署伺服器 |
| `nuclei-scan.yml` | 排程 | 資安弱點掃描 |
| `ProjectStructureLint.yml` | Push | 專案結構驗證 |


## Contributors

<a href="https://github.com/xiang511/petmily-vue/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=xiang511/petmily-vue" />
</a>



## API

[API 連結](https://github.com/Xiang511/petmily)


## License

本專案採用 AGPL-3.0 授權，詳見 [LICENSE](LICENSE) 文件。