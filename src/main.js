import { createApp } from 'vue'

import { createPinia } from 'pinia'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import vue3GoogleLogin, { googleSdkLoaded } from 'vue3-google-login'

import App from './App.vue'
import './assets/Tailadmin/main.css'
import router from './router'
import { googleOAuthConfig } from './config/google-oauth'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)


// 初始化 Google Login（禁用 One Tap 自動彈出）
app.use(vue3GoogleLogin, {
    clientId: googleOAuthConfig.clientId,
    scope: googleOAuthConfig.scope,
    auto_select: false,
    cancel_on_tap_outside: true,
})

// GSI 腳本載入後立即取消自動 One Tap 提示
googleSdkLoaded((google) => {
    google.accounts.id.cancel()
    google.accounts.id.disableAutoSelect()
})

app.mount('#app')
