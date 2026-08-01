import communityRoutes from './modules/community'
import petRoutes from './modules/pet'
import healthPassportRoutes from './modules/healthPassport'
import missingReportRoutes from './modules/missingReport'
import supportRoutes from './modules/support'
import errorRoutes from './modules/errors'
import gameRoute from './modules/game'
import authRoutes from './modules/auth'
import userRoute from './modules/user'

// 前台用戶路由
export default [
  {
    path: '/',
    name: 'Client',
    component: () => import('@/layouts/Client/Basic.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Client/HomeView.vue'),
        meta: {
          title: '首頁 | Petmily 寵物媒合平台 ',
        },
      },
      {
        path: '/color',
        name: 'color-palette',
        component: () => import('@/views/Client/ColorPalette.vue'),
        meta: {
          title: '調色盤',
        },
      },
      ...communityRoutes,
      ...petRoutes,
      ...healthPassportRoutes,
      ...missingReportRoutes,
      ...supportRoutes,
      ...errorRoutes,
    ],
  },
  gameRoute,
  ...authRoutes,
  userRoute,
]
