// 前台用戶路由
export default [
  {
    path: '/',
    name: 'Client',
    component: () => import('../../layouts/client/Basic.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../../views/client/HomeView.vue'),
        meta: {
          title: '首頁 | Petmily ',
        },
      },
      {
        path: '/color',
        name: 'color-palette',
        component: () => import('../../views/client/ColorPalette.vue'),
        meta: {
          title: '調色盤',
        },
      },
      {
        path: 'game',
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
      // 在這裡添加更多前台路由
    ],
  },
]
