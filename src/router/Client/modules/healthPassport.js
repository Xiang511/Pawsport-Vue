export default [
  {
    path: '/healthpassport',
    name: 'pet-health-passport',
    component: () => import('@/views/Client/pet/PetPassportView.vue'),
    meta: {
      title: '健康護照 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/healthpassport/addpet',
    name: 'pet-health-passport-add',
    component: () => import('@/views/Client/pet/PassportAddPetView.vue'),
    meta: {
      title: '新增寵物 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/healthpassport/edit/:id',
    name: 'pet-health-passport-edit',
    component: () => import('@/views/Client/pet/PassportEditView.vue'),
    meta: {
      title: '編輯寵物資料 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/healthpassport/medical/add',
    name: 'passport-add-medical',
    component: () => import('@/views/Client/pet/PassportAddMedicalView.vue'),
    meta: {
      title: '新增醫療診斷紀錄 | Petmily',
    },
  },
  {
    path: '/healthpassport/vaccine/add',
    name: 'passport-add-vaccine',
    component: () => import('@/views/Client/pet/PassportAddVaccineView.vue'),
    meta: {
      title: '新增疫苗施打紀錄 | Petmily',
    },
  },
  {
    path: '/healthpassport/image/add',
    name: 'passport-add-image',
    component: () => import('@/views/Client/pet/PassportAddImageView.vue'),
    meta: {
      title: '上傳毛孩影像 | Petmily',
    },
  },
  {
    path: '/healthpassport/weight/add',
    name: 'passport-add-weight',
    component: () => import('@/views/Client/pet/PassportAddWeightView.vue'),
    meta: {
      title: '新增體重紀錄 | Petmily',
    },
  },
]
