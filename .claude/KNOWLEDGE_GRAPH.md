# Petmily Vue 專案知識圖譜

## 1. 應用程式啟動鏈

```mermaid
graph LR
    main["main.js\n進入點"]
    app["App.vue\n根元件"]
    pinia["Pinia\n狀態管理"]
    persist["pinia-plugin-persistedstate\n持久化"]
    router["router/index.js\n路由"]
    google["vue3-google-login\nGoogle OAuth"]

    main --> app
    main --> pinia
    main --> router
    main --> google
    pinia --> persist
```

---

## 2. 路由結構

```mermaid
graph TD
    router["router/index.js"]
    client["router/Client/index.js\n前台路由"]
    admin["router/Tailadmin/index.js\n後台路由"]

    router --> client
    router --> admin

    client --> L_basic["Layout: Basic.vue\n一般頁面"]
    client --> L_game["Layout: GameLayout.vue\n遊戲"]
    client --> L_signin["Layout: SigninLayout.vue\n登入/註冊"]

    L_basic --> V_home["HomeView"]
    L_basic --> V_profile["ProfileView\n/user/profile"]
    L_basic --> V_community["community/\n社群"]
    L_basic --> V_pet["pet/\n寵物護照 & 領養 & 協尋"]
    L_basic --> V_support["Support/\n客服 & FAQ"]

    L_game --> V_game["Game/\n遊戲系列"]

    L_signin --> C_signin["Signin.vue"]
    L_signin --> C_signup["Signup.vue"]
    L_signin --> C_forgot["ForgotPassword.vue"]
    L_signin --> C_reset["ResetPasswordWithToken.vue"]

    admin --> L_admin["Layout: Tailadmin/default.vue\n後台"]
    L_admin --> V_member["Member/\n會員管理"]
    L_admin --> V_pet_admin["Pet/\n寵物後台"]
    L_admin --> V_game_admin["Game/\n遊戲後台"]
    L_admin --> V_community_admin["Community/\n社群後台"]
    L_admin --> V_support_admin["Support/\n客服後台"]
```

---

## 3. 全域狀態（Stores）依賴圖

```mermaid
graph TD
    auth["stores/auth.js\nuseAuthStore\n─────────────\nstate: userInfo, isLoggedIn\nactions: setLoginInfo, clearLoginInfo\npersist: localStorage[pawsport-auth]"]
    player["stores/usePlayerStore.ts\nusePlayerStore\n─────────────\nstate: playerId, playerData\ncomputed: playerName, playerPoints, enabledSkinId\npersist: localStorage"]

    player -->|"讀取 userInfo.userId"| auth
    player -->|"GET /api/users/{id}/player-profile"| axios
    player -->|"PUT /api/Player/{playerId}"| axios

    router_guard["router/index.js\nbeforeEach Guard"]
    axios["api/axios.js\nAxios 實例"]

    router_guard -->|"讀取 isLoggedIn"| auth
    router_guard -->|"clearLoginInfo()"| auth
    axios -->|"401 → clearLoginInfo()"| auth
    axios -->|"401/403 → router.push()"| router_guard
```

---

## 4. API 層

```mermaid
graph LR
    axios["api/axios.js\nbaseURL: /api\nwithCredentials: true\ntimeout: 15000ms"]

    req["Request 攔截器\nconsole.log 請求"]
    res["Response 攔截器\n401 → 跳轉登入\n403 → 跳轉權限不足"]

    axios --> req
    axios --> res

    res -->|"401"| auth_store["useAuthStore\nclearLoginInfo()"]
    res -->|"401/403"| router["Vue Router\npush('/login')"]

    axios -->|"被所有 views/composables 使用"| views["Views / Composables"]
```

---

## 5. 前台功能模組圖

```mermaid
graph TD
    subgraph 認證模組
        signin["Signin.vue"]
        signup["Signup.vue"]
        forgot["ForgotPassword.vue"]
        reset["ResetPasswordWithToken.vue"]
        signin & signup & forgot & reset -->|"POST /api/auth/..."| api
    end

    subgraph 會員模組
        profile_view["ProfileView.vue\n/user/profile"]
        profile_comp["components/Client/Profile.vue"]
        profile_view -->|"使用"| profile_comp
        profile_view -->|"GET/PUT /api/users/{id}"| api
        profile_view -->|"GET /api/users/{id}/player-profile"| api
    end

    subgraph 社群模組
        community_home["CommunityHome.vue"]
        article_detail["ArticleDetail.vue"]
        create_article["CreateArticle.vue"]
        mypage["MyPage.vue"]

        community_home -->|"useCommunityHome"| composable_community["composables/useCommunityHome"]
        article_detail -->|"useArticleComments"| composable_comments["composables/useArticleComments"]
        create_article -->|"useEditorState\nuseArticleActions"| composable_editor["composables/useEditorState\ncomposables/useArticleActions"]
        community_home & article_detail & create_article -->|"useCategories"| composable_cat["composables/useCategories"]

        community_home -->|"GET /api/articles"| api
        article_detail -->|"GET /api/articles/{id}"| api
        create_article -->|"POST /api/articles"| api
    end

    subgraph 寵物模組
        passport["PetPassportView.vue"]
        adoption["PetAdoptionView.vue"]
        missing["MissingPetView.vue"]

        passport -->|"ImageTab / MedicalTab\nVaccineTab / WeightTab"| passport_tabs["寵物護照 Tab 元件群"]
        passport -->|"GET/POST /api/passport/..."| api
        adoption -->|"GET /api/Pet/adoption"| api
        missing -->|"GET /api/MissingReports"| api
    end

    subgraph 遊戲模組
        game_view["GameView.vue"]
        gameplay["GamePlay.vue"]
        skinshop["SkinShop.vue"]
        inventory["Inventory.vue"]
        player_profile["PlayerProfile.vue"]

        game_view & gameplay & skinshop & inventory & player_profile -->|"usePlayerStore"| player_store["stores/usePlayerStore"]
        gameplay -->|"useGameAudio"| composable_audio["composables/useGameAudio"]
        gameplay -->|"GET /api/Questions/{category}"| api
        skinshop -->|"GET/POST /api/Shop"| api
    end

    subgraph 客服模組
        faq["FaqView.vue"]
        qa["QAView.vue"]
        enewsletter["ENewsletterView.vue"]
        ai_chat["AiChatFloatView.vue"]

        faq -->|"GET /api/Support/faq"| api
        qa -->|"POST /api/Support/qa"| api
        enewsletter -->|"GET /api/ENewsletter"| api
        ai_chat -->|"SignalR Hub"| hub["AIChatHub (後端)"]
    end

    api["api/axios.js\n→ /api (後端)"]
```

---

## 6. 後台（Tailadmin）模組圖

```mermaid
graph TD
    admin_layout["Tailadmin/default.vue\n後台版型"]

    admin_layout --> AppHeader["AppHeader.vue"]
    admin_layout --> AppSidebar["AppSidebar.vue"]
    admin_layout --> SidebarProvider["SidebarProvider.vue"]

    AppHeader --> UserMenu["header/UserMenu.vue"]
    AppHeader --> NotificationMenu["header/NotificationMenu.vue"]
    AppHeader --> SearchBar["header/SearchBar.vue"]

    admin_layout -->|"路由 children"| member_views["Member 管理頁\nMemberList / BlockList\nLogActivity / Permissions"]
    admin_layout -->|"路由 children"| pet_views["Pet 管理頁\nPetList / AdoptList\nMissingList / PassportList"]
    admin_layout -->|"路由 children"| game_views["Game 管理頁\nPlayerList / QuestionList / ShopList"]
    admin_layout -->|"路由 children"| community_views["Community 管理頁\nArticleList"]
    admin_layout -->|"路由 children"| support_views["Support 管理頁\nFaqList / QAList\nLineBotList / ENewsletterList"]

    member_views -->|"useMemberDataTableLogic"| composable_member["composables/Tailadmin/useMemberDataTableLogic"]
    member_views -->|"MemberInfoTable / LoginActivityTable\nMemberPermissionTable / MemberBlocklistTable"| member_components["components/Tailadmin/Member/"]

    member_views & pet_views & game_views & community_views & support_views -->|"GET/PUT/POST/PATCH\n/api/..."| api["api/axios.js"]
```

---

## 7. 元件共用關係

```mermaid
graph LR
    subgraph 全域共用元件
        nav["Client/Nav.vue"]
        footer["Client/Footer.vue"]
        scroll["ScrollToTopButton.vue"]
        support_float["SupportFloatingServiceMenu.vue"]
        live2d["Live2DPet.vue"]
        search["SearchBarAlgolia.vue"]
    end

    subgraph 文章元件群
        editor["Article_ArticleEditor.vue"]
        comment["Article_CommentSection.vue"]
        list_card["Article_ListCard.vue"]
        draft["Article_DraftListModal.vue"]
        new_modal["Article_NewArticleModal.vue"]
        popular["Article_PopularCard.vue"]
        toast["Article_ToastAlert.vue"]
    end

    subgraph 護照 Tab 元件群
        image_tab["ImageTab.vue"]
        medical_tab["MedicalTab.vue"]
        vaccine_tab["VaccineTab.vue"]
        weight_tab["WeightTab.vue"]
    end

    Basic["Layout: Basic.vue"] -->|"包含"| nav & footer & scroll & support_float & live2d
    CommunityHome["CommunityHome.vue"] -->|"使用"| list_card & popular & search
    CreateArticle["CreateArticle.vue"] -->|"使用"| editor & draft & new_modal & toast
    ArticleDetail["ArticleDetail.vue"] -->|"使用"| comment
    PetPassportView["PetPassportView.vue"] -->|"使用"| image_tab & medical_tab & vaccine_tab & weight_tab
```

---

## 8. Composables 職責一覽

| Composable | 使用於 | 功能 |
|-----------|--------|------|
| `useAlgoliaSearch` | `SearchBarAlgolia.vue` | Algolia 全文搜尋 |
| `useArticleActions` | `CreateArticle.vue` | 文章儲存/發布/刪除 |
| `useArticleComments` | `ArticleDetail.vue` | 留言 CRUD |
| `useCategories` | 社群相關 views | 取得文章分類清單 |
| `useCommunityHome` | `CommunityHome.vue` | 社群首頁資料聚合 |
| `useDateTime` | 多處 | 日期格式化工具 |
| `useEditorState` | `CreateArticle.vue` | 編輯器狀態（草稿、圖片） |
| `useGameAudio` | `GamePlay.vue` | 遊戲音效控制 |
| `useMemberDataTableLogic` | 後台 Member views | 表格分頁/排序邏輯 |
| `useSidebar` | `AppSidebar.vue` | 側邊欄展開/收合 |

---

## 9. 路由守衛邏輯

```mermaid
flowchart TD
    start(["使用者訪問任意路由"])
    check_dashboard{"路徑以 /dashboard 開頭？"}
    check_login_path{"路徑是 /dashboard/login？"}
    force_logout["強制登出\nclearLoginInfo()"]
    redirect_dashboard_login["→ /dashboard/login"]

    check_auth{"路徑以 /user, /game,\n/healthpassport 開頭？"}
    check_logged_in{"isLoggedIn？"}
    redirect_login["→ /login"]
    allow["允許進入"]

    start --> check_dashboard
    check_dashboard -->|"是"| check_login_path
    check_login_path -->|"不是登入頁"| force_logout --> redirect_dashboard_login
    check_login_path -->|"是登入頁"| allow

    check_dashboard -->|"否"| check_auth
    check_auth -->|"是"| check_logged_in
    check_logged_in -->|"已登入"| allow
    check_logged_in -->|"未登入"| redirect_login
    check_auth -->|"否"| allow
```
