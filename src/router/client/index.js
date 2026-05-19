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
          // note:之後可以更新動態顯示文章標題
        },
      },
      {
        path: '/mypage',
        name: 'mypage',
        component: () => import('../../views/client/Community/MyPage.vue'),
        meta: {
          title: '個人主頁 | Petmily',
        },
      },
      {
        path: '/adopt',
        name: 'pet-adoption',
        component: () => import('@/views/client/pet/PetAdoptionView.vue'),
        meta: {
          title: '領養狗狗 | Petmily',
        },
      },
      {
        path: '/adopt/create',
        name: 'pet-adoption-add',
        component: () => import('@/views/client/pet/PostPetView.vue'),
        meta: {
          title: '領養狗狗 | Petmily',
        },
      },
      {
        path: '/healthpassport',
        name: 'pet-health-passport',
        component: () => import('@/views/client/pet/PetPassportView.vue'),
        meta: {
          title: '健康護照 | Petmily',
        },
      },
      {
        path: '/healthpassport/addpet',
        name: 'pet-health-passport-add',
        component: () => import('@/views/client/pet/PassportAddPetView.vue'),
        meta: {
          title: '新增寵物 | Petmily',
        },
      },
      {
        path: '/healthpassport/edit/:id',
        name: 'pet-health-passport-edit',
        component: () => import('@/views/client/pet/PassportEditView.vue'),
        meta: {
          title: '編輯寵物資料 | Petmily',
        },
      },
      {
        path: '/missingreport',
        name: 'missing-report',
        component: () => import('@/views/client/pet/MissingPetView.vue'),
        meta: {
          title: '遺失協尋 | Petmily',
        },
      },
      {
        path: '/missingreport/create',
        name: 'missing-report-create',
        component: () => import('@/views/client/pet/PostMissingPetView.vue'),
        meta: {
          title: '刊登遺失協尋 | Petmily',
        },
      },
      {
        path: '/missingreport/:id',
        name: 'missing-report-detail',
        component: () => import('@/views/client/pet/MissingPetDetailView.vue'),
        meta: {
          title: '遺失協尋詳情 | Petmily',
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
        path: 'gameplay/:category',
        name: 'client-gameplay',
        component: () => import('@/views/client/Game/GamePlay.vue'),
        meta: {
          title: '寵物問答挑戰 | Petmily',
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
      {
        path: 'inventory',
        name: 'client-inventory',
        component: () => import('@/views/client/Game/Inventory.vue'),
        meta: {
          title: '我的收藏 | Petmily',
        },
      },
    ],
  },
]
