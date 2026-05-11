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
      // 在這裡添加更多前台路由
    ],
  },
]
