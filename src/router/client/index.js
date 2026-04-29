// 前台用戶路由
export default [
  {
    path: '/',
    name: 'client-home',
    // component: () => import('../../layouts/client/default.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../../views/client/AboutView.vue'),
        meta: {
          title: '關於我們',
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
