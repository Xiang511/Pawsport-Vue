// 後台管理路由
export default [
  {
    path: '/',
    name: 'admin-home',
    redirect: '/dashboard/login',
  },
  {
    path: '/dashboard/login',
    name: 'admin-signin',
    component: () => import('@/views/Tailadmin/Auth/Signin.vue'),
    meta: {
      title: 'Sign In',
    },
  },
  {
    path: '/signup',
    name: 'admin-signup',
    component: () => import('@/views/Tailadmin/Auth/Signup.vue'),
    meta: {
      title: 'Sign Up',
    },
  },
  {
    path: '/dashboard',
    name: 'admin-dashboard',
    component: () => import('@/layouts/Tailadmin/default.vue'),
    children: [
      {
        path: '',
        name: 'admin-ecommerce',
        component: () => import('@/views/Tailadmin/Member/MemberList.vue'),
        meta: {
          title: '儀錶板 | PawsPort',
        },
      },
      {
        path: 'member',
        name: 'admin-memberlist',
        component: () => import('@/views/Tailadmin/Member/MemberList.vue'),
        meta: {
          title: '基本資料 | PawsPort',
        },
      },
      {
        path: 'blocklist',
        name: 'admin-blocklist',
        component: () => import('@/views/Tailadmin/Member/BlockList.vue'),
        meta: {
          title: '違規名單 | PawsPort',
        },
      },
      {
        path: 'permissions',
        name: 'admin-permissions',
        component: () => import('@/views/Tailadmin/Member/Permissions.vue'),
        meta: {
          title: '權限管理 | PawsPort',
        },
      },
      {
        path: 'log-activity',
        name: 'admin-logactivity',
        component: () => import('@/views/Tailadmin/Member/LogActivity.vue'),
        meta: {
          title: '登入活動 | PawsPort',
        },
      },

      {
        path: 'questions',
        name: 'admin-questionlist',
        component: () => import('@/views/Tailadmin/Game/QuestionList.vue'),
        meta: {
          title: '題庫管理 | PawsPort',
        },
      },
      {
        path: 'players',
        name: 'admin-playerlist',
        component: () => import('@/views/Tailadmin/Game/PlayerList.vue'),
        meta: {
          title: '玩家管理 | PawsPort',
        },
      },
      {
        path: 'shop',
        name: 'admin-shoplist',
        component: () => import('@/views/Tailadmin/Game/ShopList.vue'),
        meta: {
          title: '商店管理 | PawsPort',
        },
      },
      {
        path: 'pet',
        name: 'admin-petlist',
        component: () => import('@/views/Tailadmin/Pet/PetList.vue'),
        meta: {
          title: '寵物資訊 | PawsPort',
        },
      },
      {
        path: 'pet/create',
        name: 'admin-petcreate',
        component: () => import('@/views/Tailadmin/Pet/PetCreate.vue'),
        meta: {
          title: '新增寵物資料 | PawsPort',
        },
      },
      {
        path: 'pet/edit/:id',
        name: 'admin-petedit',
        component: () => import('@/views/Tailadmin/Pet/PetEdit.vue'),
        meta: {
          title: '修改寵物資料 | PawsPort',
        },
      },
      {
        path: 'adoption',
        name: 'admin-adoptionlist',
        component: () => import('@/views/Tailadmin/Pet/AdoptList.vue'),
        meta: {
          title: '領養記錄 | PawsPort',
        },
      },
      {
        path: 'adoption/create',
        name: 'admin-adoptcreate',
        component: () => import('@/views/Tailadmin/Pet/AdoptCreate.vue'),
        meta: {
          title: '新增領養紀錄 | PawsPort',
        },
      },
      {
        path: 'adoption/edit/:id',
        name: 'admin-adoptedit',
        component: () => import('@/views/Tailadmin/Pet/AdoptEdit.vue'),
        meta: {
          title: '修改領養紀錄 | PawsPort',
        },
      },
      {
        path: 'passport',
        name: 'admin-passportlist',
        component: () => import('@/views/Tailadmin/Pet/PassportList.vue'),
        meta: {
          title: '寵物健康護照 | PawsPort',
        },
      },
      {
        path: 'passport/detail/:id',
        name: 'admin-passportdetails',
        component: () => import('@/views/Tailadmin/Pet/PassportDetails.vue'),
        meta: {
          title: '健康護照詳情 | PawsPort',
        },
      },
      {
        path: 'passport/create',
        name: 'admin-passportcreate',
        component: () => import('@/views/Tailadmin/Pet/PassportCreate.vue'),
        meta: {
          title: '新增健康護照 | PawsPort',
        },
      },
      {
        path: 'passport/edit/:id',
        name: 'admin-passportedit',
        component: () => import('@/views/Tailadmin/Pet/PassportEdit.vue'),
        meta: {
          title: '修改健康護照 | PawsPort',
        },
      },
      {
        path: 'missingreport',
        name: 'admin-missinglist',
        component: () => import('@/views/Tailadmin/Pet/MissingList.vue'),
        meta: {
          title: '寵物走失紀錄 | PawsPort',
        },
      },
      {
        path: 'missingreport/create',
        name: 'admin-missingcreate',
        component: () => import('@/views/Tailadmin/Pet/MissingCreate.vue'),
        meta: {
          title: '新增走失紀錄 | PawsPort',
        },
      },
      {
        path: 'missingreport/edit/:id',
        name: 'admin-missingedit',
        component: () => import('@/views/Tailadmin/Pet/MissingEdit.vue'),
        meta: {
          title: '修改走失紀錄 | PawsPort',
        },
      },
      {
        path: 'faq',
        name: 'admin-faqlist',
        component: () => import('@/views/Tailadmin/Support/FaqList.vue'),
        meta: {
          title: '常見問題 | PawsPort',
        },
      },
      {
        path: 'qa',
        name: 'admin-qalist',
        component: () => import('@/views/Tailadmin/Support/QAList.vue'),
        meta: {
          title: 'Q&A記錄 | PawsPort',
        },
      },
      {
        path: 'enewsletter',
        name: 'admin-enewsletterlist',
        component: () => import('@/views/Tailadmin/Support/ENewsletterList.vue'),
        meta: {
          title: '電子報專區 | PawsPort',
        },
      },
      {
        path: 'linebot',
        name: 'admin-linebotlist',
        component: () => import('@/views/Tailadmin/Support/LineBotList.vue'),
        meta: {
          title: 'Line Bot | PawsPort',
        },
      },
      {
        path: 'blank',
        name: 'admin-blank',
        component: () => import('@/views/Tailadmin/Pages/BlankPage.vue'),
        meta: {
          title: 'Blank Page',
        },
      },
      {
        path: 'error-404',
        name: 'admin-error-404',
        component: () => import('@/views/Tailadmin/Errors/FourZeroFour.vue'),
        meta: {
          title: '404 Page',
        },
      },
      {
        path: 'error-403',
        name: 'admin-error-403',
        component: () => import('@/views/Tailadmin/Errors/Forbidden.vue'),
        meta: {
          title: '403 權限不足',
        },
      },
      {
        path: 'article-list',
        name: 'admin-article',
        component: () => import('@/views/Tailadmin/Community/ArticleList.vue'),
        meta: {
          title: '貼文管理 | PawsPort',
        },
      },
    ],
  },
]
