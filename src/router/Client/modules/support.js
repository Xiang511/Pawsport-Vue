export default [
  {
    path: '/faq',
    name: 'Client-faq',
    component: () => import('@/views/Client/Support/FaqView.vue'),
    meta: {
      title: '常見問題 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/qa',
    name: 'Client-qa',
    component: () => import('@/views/Client/Support/QAView.vue'),
    meta: {
      title: '聯絡我們 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/enewsletter',
    name: 'Client-enewsletter',
    component: () => import('@/views/Client/Support/ENewsletterView.vue'),
    meta: {
      title: '電子報訂閱 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/support/enewsletter/:id',
    name: 'Client-enewsletter-detail',
    component: () => import('@/views/Client/Support/ENewsletterDetailView.vue'),
    meta: {
      title: '電子報 | Petmily',
    },
  },
]
