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
      {
        path: '/create-article',
        name: 'create-article',
        component: () => import('../../views/client/Community/CreateArticle.vue'),
        meta: {
          title: '新增貼文',
        },
      },
      {
        path: '/article-list',
        name: 'article-list',
        component: () => import('../../views/client/Community/ArticleList.vue'),
        meta: {
          title: '貼文列表',
        },
      },
    ],
  },
]
