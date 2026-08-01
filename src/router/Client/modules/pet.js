export default [
  {
    path: '/adopt',
    name: 'pet-adoption',
    component: () => import('@/views/Client/pet/PetAdoptionView.vue'),
    meta: {
      title: '領養狗狗 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/adopt/create',
    name: 'pet-adoption-add',
    component: () => import('@/views/Client/pet/PostPetView.vue'),
    meta: {
      title: '領養狗狗 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/adopt/:id',
    name: 'pet-adoption-detail',
    component: () => import('@/views/Client/pet/PetAdoptionDetailView.vue'),
    meta: {
      title: '狗狗檔案 | Petmily 寵物媒合平台',
    },
  },
]
