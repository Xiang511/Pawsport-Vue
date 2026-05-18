import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import basicSsl from '@vitejs/plugin-basic-ssl'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss(), mkcert()],
  server: {
    https: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7048',
        changeOrigin: true,
        secure: false, // 後端使用自簽證書，需設為 false
        // cookieDomainRewrite: 'localhost', // 重寫 Cookie 的 domain
        // cookiePathRewrite: '/', // 重寫 Cookie 的 path
        // configure: (proxy, options) => {
        //   proxy.on('proxyReq', (proxyReq, req, res) => {
        //     // 確保 Cookie 被轉發
        //     if (req.headers.cookie) {
        //       proxyReq.setHeader('Cookie', req.headers.cookie)
        //     }
        //   })
        // },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
