export default [
  {
    path: '/missingreport',
    name: 'missing-report',
    component: () => import('@/views/Client/pet/MissingPetView.vue'),
    meta: {
      title: '遺失協尋 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/missingreport/create',
    name: 'missing-report-create',
    component: () => import('@/views/Client/pet/PostMissingPetView.vue'),
    meta: {
      title: '刊登遺失協尋 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/missingreport/:id',
    name: 'missing-report-detail',
    component: () => import('@/views/Client/pet/MissingPetDetailView.vue'),
    meta: {
      title: '遺失協尋詳情 | Petmily 寵物媒合平台',
    },
  },
]
