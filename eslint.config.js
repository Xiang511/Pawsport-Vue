import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'

export default [
  // 1. 基礎 JavaScript 建議規則 (取代原本的 TS 規則)
  // 如果你安裝了 @eslint/js，可以用 js.configs.recommended

  // 2. Vue 規則
  ...pluginVue.configs['flat/essential'],

  // 3. 自定義調整
  {
    files: ['*.vue', '**/*.vue', '*.js', '**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // 移除 tseslint.parser，改用預設或 vue 內建解析器
    },
    rules: {
      'vue/no-static-inline-styles': [
        'error',
        {
          allowBinding: false, // 是否允許 :style="{ color: 'red' }" 這種動態綁定，建議設為 false 或根據需求調整
        },
      ],
      'vue/multi-word-component-names': 'off', // 允許 Home.vue
      'no-unused-vars': 'off', // 隱藏未使用變數的警告
      'vue/no-v-html': 'warn', // 使用 v-html 顯示警告，因為它可能導致 XSS 攻擊
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],
    },
  },

  // 4. 禁用與 Prettier 衝突的規則
  eslintConfigPrettier,
]
