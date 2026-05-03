// 後台管理路由
export default [
  {
    path: '/',
    name: 'admin-home',
    redirect: '/signin',
  },
  {
    path: '/signin',
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
        component: () => import('@/views/Ecommerce.vue'),
        meta: {
          title: 'eCommerce Dashboard',

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
        path: 'calendar',
        name: 'admin-calendar',
        component: () => import('@/views/Tailadmin/Others/Calendar.vue'),
        meta: {
          title: 'Calendar',

        },
      },
      {
        path: 'profile',
        name: 'admin-profile',
        component: () => import('@/views/Tailadmin/Others/UserProfile.vue'),
        meta: {
          title: 'User Profile',

        },
      },
      {
        path: 'form-elements',
        name: 'admin-form-elements',
        component: () => import('@/views/Tailadmin/Forms/FormElements.vue'),
        meta: {
          title: 'Form Elements',

        },
      },
      {
        path: 'basic-tables',
        name: 'admin-basic-tables',
        component: () => import('@/views/Tailadmin/Tables/BasicTables.vue'),
        meta: {
          title: 'Basic Tables',

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
        path: 'line-chart',
        name: 'admin-line-chart',
        component: () => import('@/views/Tailadmin/Chart/LineChart/LineChart.vue'),
        meta: {
          title: 'Line Chart',

        },
      },
      {
        path: 'bar-chart',
        name: 'admin-bar-chart',
        component: () => import('@/views/Tailadmin/Chart/BarChart/BarChart.vue'),
        meta: {
          title: 'Bar Chart',

        },
      },
      {
        path: 'alerts',
        name: 'admin-alerts',
        component: () => import('@/views/Tailadmin/UiElements/Alerts.vue'),
        meta: {
          title: 'Alerts',

        },
      },
      {
        path: 'avatars',
        name: 'admin-avatars',
        component: () => import('@/views/Tailadmin/UiElements/Avatars.vue'),
        meta: {
          title: 'Avatars',

        },
      },
      {
        path: 'badge',
        name: 'admin-badge',
        component: () => import('@/views/Tailadmin/UiElements/Badges.vue'),
        meta: {
          title: 'Badge',

        },
      },
      {
        path: 'buttons',
        name: 'admin-buttons',
        component: () => import('@/views/Tailadmin/UiElements/Buttons.vue'),
        meta: {
          title: 'Buttons',

        },
      },
      {
        path: 'images',
        name: 'admin-images',
        component: () => import('@/views/Tailadmin/UiElements/Images.vue'),
        meta: {
          title: 'Images',

        },
      },
      {
        path: 'videos',
        name: 'admin-videos',
        component: () => import('@/views/Tailadmin/UiElements/Videos.vue'),
        meta: {
          title: 'Videos',
        },
      },
    ],
  },
]
