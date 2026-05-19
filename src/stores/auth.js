import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userInfo: null,
    isLoggedIn: false,
    isInitialized: false, //  每次重新整理網頁，都應該維持預設值 false
  }),

  actions: {
    setLoginInfo(user) {
      this.userInfo = user
      this.isLoggedIn = true
    },
    clearLoginInfo() {
      this.userInfo = null
      this.isLoggedIn = false
    },
  },

  // 💡 調整持久化設定
  persist: {
    key: 'pawsport-auth', // 這是存在 localStorage 的 key 名稱
    paths: ['userInfo', 'isLoggedIn'], //只同步這兩個欄位，排除 isInitialized
  },
})
