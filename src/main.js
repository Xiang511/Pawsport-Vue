import { createApp } from 'vue'

import { createPinia } from 'pinia'

import App from './App.vue'
import './assets/Tailadmin/main.css'
import router from './router'

// 現在從 ./router/index.js 導入

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
