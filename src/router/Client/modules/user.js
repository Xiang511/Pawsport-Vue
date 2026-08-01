export default {
  path: '/user',
  name: 'UserLayout',
  component: () => import('@/layouts/Client/Basic.vue'),
  children: [
    {
      path: '',
      name: 'Client-user-error',
      component: () => import('@/views/Tailadmin/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Page',
      },
    },
    {
      path: 'profile',
      name: 'Client-profile',
      component: () => import('@/views/Client/ProfileView.vue'),
      meta: {
        title: '會員中心 | Petmily 寵物媒合平台',
      },
    },
  ],
}
