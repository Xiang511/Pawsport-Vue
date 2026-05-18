// 前台用戶路由
export default [
  {
    path: '/',
    name: 'Client',
    component: () => import('@/layouts/client/Basic.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/client/HomeView.vue'),
        meta: {
          title: '首頁 | Petmily ',
        },
      },
      {
        path: '/color',
        name: 'color-palette',
        component: () => import('@/views/client/ColorPalette.vue'),
        meta: {
          title: '調色盤',
        },
      },

      // 在這裡添加更多前台路由
      {
        path: '/create-article',
        name: 'create-article',
        component: () => import('@/views/client/community/CreateArticle.vue'),
        meta: {
          title: '新增貼文 | Petmily',
        },
      },
      {
        path: '/article-list',
        name: 'article-list',
        component: () => import('@/views/client/community/ArticleList.vue'),
        meta: {
          title: '貼文列表 | Petmily',
        },
      },
      {
        path: '/article-detail',
        name: 'article-detail',
        component: () => import('@/views/client/community/ArticleDetail.vue'),
        meta: {
          title: '文章內容 | Petmily',
          // plus:之後可以更新動態顯示文章標題
        },
      },
    ],
  },
  {
    path: '/game',
    name: 'GameLayout',
    component: () => import('@/layouts/client/GameLayout.vue'),
    children: [
      {
        path: '',
        name: 'client-gameview',
        component: () => import('@/views/client/Game/GameView.vue'),
        meta: {
          title: '遊戲 | Petmily',
        },
      },
      {
        path: 'mainmenu',
        name: 'client-mainmenu',
        component: () => import('@/views/client/Game/MainMenu.vue'),
        meta: {
          title: '遊戲主選單 | Petmily',
        },
      },
      {
        path: 'playerprofile',
        name: 'client-playerprofile',
        component: () => import('@/views/client/Game/PlayerProfile.vue'),
        meta: {
          title: '玩家資料 | Petmily',
        },
      },
      {
        path: 'levelselect',
        name: 'client-levelselect',
        component: () => import('@/views/client/Game/LevelSelect.vue'),
        meta: {
          title: '選擇關卡 | Petmily',
        },
      },
      {
        path: 'levelselect-1',
        name: 'client-levelselect-1',
        component: () => import('@/views/client/Game/LevelSelect-1.vue'),
        meta: {
          title: '選擇關卡-1 | Petmily',
        },
      },
      {
        path: 'skinshop',
        name: 'client-skinshop',
        component: () => import('@/views/client/Game/SkinShop.vue'),
        meta: {
          title: '造型商店 | Petmily',
        },
      },
    ],
  },
]
