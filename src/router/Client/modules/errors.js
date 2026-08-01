export default [
  {
    path: '/error-404',
    name: 'Client-error-404-basic',
    component: () => import('@/views/Tailadmin/Errors/FourZeroFour.vue'),
    meta: {
      title: '404 找不到頁面 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/error-401',
    name: 'Client-error-401',
    component: () => import('@/views/Client/Errors/UnauthorizedView.vue'),
    meta: {
      title: '401 請先登入 | Petmily 寵物媒合平台',
    },
  },
  {
    path: '/error-403',
    name: 'Client-error-403',
    component: () => import('@/views/Client/Errors/ForbiddenView.vue'),
    meta: {
      title: '403 權限不足 | Petmily 寵物媒合平台',
    },
  },
]
