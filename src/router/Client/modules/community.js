export default [
  {
    path: '/create-article',
    name: 'create-article',
    component: () => import('@/views/Client/community/CreateArticle.vue'),
    meta: {
      title: '新增貼文 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/community-home',
    name: 'community-home',
    component: () => import('@/views/Client/community/CommunityHome.vue'),
    meta: {
      title: '社群首頁 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/article-detail/:id',
    name: 'article-detail',
    component: () => import('@/views/Client/community/ArticleDetail.vue'),
    meta: {
      title: '文章內容 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: () => import('@/views/Client/community/MyPage.vue'),
    meta: {
      title: '個人主頁 | Petmily 寵物媒合平台',
    },
  },
]
