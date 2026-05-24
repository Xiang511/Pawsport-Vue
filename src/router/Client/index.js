// 前台用戶路由
export default [
  {
    path: '/',
    name: 'Client',
    component: () => import('@/layouts/Client/Basic.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Client/HomeView.vue'),
        meta: {
          title: '首頁 | Petmily ',
        },
      },
      {
        path: '/color',
        name: 'color-palette',
        component: () => import('@/views/Client/ColorPalette.vue'),
        meta: {
          title: '調色盤',
        },
      },
      {
        path: '/create-article',
        name: 'create-article',
        component: () => import('@/views/Client/community/CreateArticle.vue'),
        meta: {
          title: '新增貼文 | Petmily',
        },
      },
      {
        path: '/article-list',
        name: 'article-list',
        component: () => import('@/views/Client/community/ArticleList.vue'),
        meta: {
          title: '貼文列表 | Petmily',
        },
      },
      {
        path: '/article-detail',
        name: 'article-detail',
        component: () => import('@/views/Client/community/ArticleDetail.vue'),
        meta: {
          title: '文章內容 | Petmily',
          // note:之後可以更新動態顯示文章標題
        },
      },
      {
        path: '/mypage',
        name: 'mypage',
        component: () => import('@/views/Client/community/MyPage.vue'),
        meta: {
          title: '個人主頁 | Petmily',
        },
      },
      {
        path: '/adopt',
        name: 'pet-adoption',
        component: () => import('@/views/Client/pet/PetAdoptionView.vue'),
        meta: {
          title: '領養狗狗 | Petmily',
        },
      },
      {
        path: '/adopt/create',
        name: 'pet-adoption-add',
        component: () => import('@/views/Client/pet/PostPetView.vue'),
        meta: {
          title: '領養狗狗 | Petmily',
        },
      },
      {
        path: '/adopt/:id',
        name: 'pet-adoption-detail',
        component: () => import('@/views/Client/pet/PetAdoptionDetailView.vue'),
        meta: {
          title: '狗狗檔案 | Petmily',
        },
      },
      {
        path: '/healthpassport',
        name: 'pet-health-passport',
        component: () => import('@/views/Client/pet/PetPassportView.vue'),
        meta: {
          title: '健康護照 | Petmily',
        },
      },
      {
        path: '/healthpassport/addpet',
        name: 'pet-health-passport-add',
        component: () => import('@/views/Client/pet/PassportAddPetView.vue'),
        meta: {
          title: '新增寵物 | Petmily',
        },
      },
      {
        path: '/healthpassport/edit/:id',
        name: 'pet-health-passport-edit',
        component: () => import('@/views/Client/pet/PassportEditView.vue'),
        meta: {
          title: '編輯寵物資料 | Petmily',
        },
      },
      {
        path: '/healthpassport/medical/add',
        name: 'passport-add-medical',
        component: () => import('@/views/Client/pet/PassportAddMedicalView.vue'),
        meta: {
          title: '新增醫療診斷紀錄 | Petmily',
        },
      },
      {
        path: '/healthpassport/vaccine/add',
        name: 'passport-add-vaccine',
        component: () => import('@/views/Client/pet/PassportAddVaccineView.vue'),
        meta: {
          title: '新增疫苗施打紀錄 | Petmily',
        },
      },
      {
        path: '/healthpassport/image/add',
        name: 'passport-add-image',
        component: () => import('@/views/Client/pet/PassportAddImageView.vue'),
        meta: {
          title: '上傳毛孩影像 | Petmily',
        },
      },
      {
        path: '/healthpassport/weight/add',
        name: 'passport-add-weight',
        component: () => import('@/views/Client/pet/PassportAddWeightView.vue'),
        meta: {
          title: '新增體重紀錄 | Petmily',
        },
      },
      {
        path: '/missingreport',
        name: 'missing-report',
        component: () => import('@/views/Client/pet/MissingPetView.vue'),
        meta: {
          title: '遺失協尋 | Petmily',
        },
      },
      {
        path: '/missingreport/create',
        name: 'missing-report-create',
        component: () => import('@/views/Client/pet/PostMissingPetView.vue'),
        meta: {
          title: '刊登遺失協尋 | Petmily',
        },
      },
      {
        path: '/missingreport/:id',
        name: 'missing-report-detail',
        component: () => import('@/views/Client/pet/MissingPetDetailView.vue'),
        meta: {
          title: '遺失協尋詳情 | Petmily',
        },
      },
      {
        path: '/error-404',
        name: 'Client-error-404-basic',
        component: () => import('@/views/Tailadmin/Errors/FourZeroFour.vue'),
        meta: {
          title: '404 找不到頁面 | Petmily',
        },
      },
      {
        path: '/faq',
        name: 'Client-faq',
        component: () => import('@/views/Client/Support/FaqView.vue'),
        meta: {
          title: '常見問題 | Petmily',
        },
      },
      {
        path: '/qa',
        name: 'Client-qa',
        component: () => import('@/views/Client/Support/QAView.vue'),
        meta: {
          title: '聯絡我們 | Petmily',
        },
      },
      {
        path: '/enewsletter',
        name: 'Client-enewsletter',
        component: () => import('@/views/Client/Support/ENewsletterView.vue'),
        meta: {
          title: '電子報訂閱 | Petmily',
        },
      },
    ],
  },
  {
    path: '/game',
    name: 'GameLayout',
    component: () => import('@/layouts/Client/GameLayout.vue'),
    children: [
      {
        path: '',
        name: 'Client-gameview',
        component: () => import('@/views/Client/Game/GameView.vue'),
        meta: {
          title: '遊戲 | Petmily',
        },
      },
      {
        path: 'mainmenu',
        name: 'Client-mainmenu',
        component: () => import('@/views/Client/Game/MainMenu.vue'),
        meta: {
          title: '遊戲主選單 | Petmily',
        },
      },
      {
        path: 'playerprofile',
        name: 'Client-playerprofile',
        component: () => import('@/views/Client/Game/PlayerProfile.vue'),
        meta: {
          title: '玩家資料 | Petmily',
        },
      },
      {
        path: 'levelselect',
        name: 'Client-levelselect',
        component: () => import('@/views/Client/Game/LevelSelect.vue'),
        meta: {
          title: '選擇關卡 | Petmily',
        },
      },
      {
        path: 'gameplay/:category',
        name: 'Client-gameplay',
        component: () => import('@/views/Client/Game/GamePlay.vue'),
        meta: {
          title: '寵物問答挑戰 | Petmily',
        },
      },
      {
        path: 'skinshop',
        name: 'Client-skinshop',
        component: () => import('@/views/Client/Game/SkinShop.vue'),
        meta: {
          title: '造型商店 | Petmily',
        },
      },
      {
        path: 'inventory',
        name: 'Client-inventory',
        component: () => import('@/views/Client/Game/Inventory.vue'),
        meta: {
          title: '我的收藏 | Petmily',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'SigninLayout',
    component: () => import('@/layouts/Client/SigninLayout.vue'),
    children: [
      {
        path: '',
        name: 'Client-login',
        component: () => import('@/components/Client/Signin.vue'),
        meta: {
          title: '登入 | Petmily',
        },
      },
    ],
  },
  {
    path: '/user',
    name: 'UserLayout',
    component: () => import('@/layouts/Client/Basic.vue'),
    children: [
      {
        path: '',
        name: 'Client-user-error',
        component: () => import('@/views/Tailadmin/Errors/FourZeroFour.vue'),
        meta: {
          title: '404 Page',
        },
      },
      {
        path: 'profile',
        name: 'Client-profile',
        component: () => import('@/components/Client/Profile.vue'),
        meta: {
          title: '會員中心 | Petmily',
        },
      },
    ],
  },
]
