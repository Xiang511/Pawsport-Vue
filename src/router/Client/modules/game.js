export default {
  path: '/game',
  name: 'GameLayout',
  component: () => import('@/layouts/Client/GameLayout.vue'),
  children: [
    {
      path: '',
      name: 'Client-gameview',
      component: () => import('@/views/Client/Game/GameView.vue'),
      meta: {
        title: '遊戲 | Petmily 寵物媒合平台',
      },
    },
    {
      path: 'mainmenu',
      name: 'Client-mainmenu',
      component: () => import('@/views/Client/Game/MainMenu.vue'),
      meta: {
        title: '遊戲主選單 | Petmily 寵物媒合平台',
      },
    },
    {
      path: 'playerprofile',
      name: 'Client-playerprofile',
      component: () => import('@/views/Client/Game/PlayerProfile.vue'),
      meta: {
        title: '玩家資料 | Petmily 寵物媒合平台',
      },
    },
    {
      path: 'levelselect',
      name: 'Client-levelselect',
      component: () => import('@/views/Client/Game/LevelSelect.vue'),
      meta: {
        title: '選擇關卡 | Petmily 寵物媒合平台',
      },
    },
    {
      path: 'gameplay/:category',
      name: 'Client-gameplay',
      component: () => import('@/views/Client/Game/GamePlay.vue'),
      meta: {
        title: '寵物問答挑戰 | Petmily 寵物媒合平台',
      },
    },
    {
      path: 'skinshop',
      name: 'Client-skinshop',
      component: () => import('@/views/Client/Game/SkinShop.vue'),
      meta: {
        title: '造型商店 | Petmily 寵物媒合平台',
      },
    },
    {
      path: 'inventory',
      name: 'Client-inventory',
      component: () => import('@/views/Client/Game/Inventory.vue'),
      meta: {
        title: '我的收藏 | Petmily 寵物媒合平台',
      },
    },
  ],
}
