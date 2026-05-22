/**
 * 將 Sidebar 菜單資訊上傳到 Algolia
 * 
 * 使用方式：
 * 1. 確保已設定 VITE_ALGOLIA_APP_ID 和 VITE_ALGOLIA_ADMIN_KEY
 * 2. 執行: node scripts/upload-sidebar-to-algolia.js
 * 
 * 注意：這個腳本使用 Admin API Key，不要在前端使用！
 */

import algoliasearch from 'algoliasearch'
import { convertToAlgoliaRecords } from './export-sidebar-to-algolia.js'
import dotenv from 'dotenv'

// 載入環境變數
dotenv.config()

// 從環境變數讀取配置
const APP_ID = process.env.VITE_ALGOLIA_APP_ID || 'YOUR_APP_ID'
const ADMIN_API_KEY = process.env.VITE_ALGOLIA_ADMIN_KEY || 'YOUR_ADMIN_API_KEY'
const INDEX_NAME = process.env.VITE_ALGOLIA_MENU_INDEX_NAME || 'menu_items' // 使用不同的索引名稱

/**
 * 上傳 Sidebar 資料到 Algolia
 */
async function uploadToAlgolia() {
    console.log('🚀 開始上傳 Sidebar 資料到 Algolia...\n')

    // 檢查配置
    if (APP_ID === 'YOUR_APP_ID' || ADMIN_API_KEY === 'YOUR_ADMIN_API_KEY') {
        console.error('❌ 請先設定 Algolia 環境變數：')
        console.error('   VITE_ALGOLIA_APP_ID')
        console.error('   VITE_ALGOLIA_ADMIN_KEY')
        console.error('   VITE_ALGOLIA_MENU_INDEX_NAME (可選，預設為 menu_items)')
        process.exit(1)
    }

    // 初始化 Algolia 客戶端
    const client = algoliasearch(APP_ID, ADMIN_API_KEY)
    const index = client.initIndex(INDEX_NAME)

    // 獲取要上傳的資料
    const records = convertToAlgoliaRecords()

    console.log(`📊 準備上傳 ${records.length} 個選單項目到索引: ${INDEX_NAME}\n`)

    try {
        // 上傳資料
        const { objectIDs } = await index.saveObjects(records)

        console.log('✅ 資料上傳成功！')
        console.log(`📦 已上傳的 Object IDs (前 10 個):`)
        objectIDs.slice(0, 10).forEach(id => console.log(`   - ${id}`))
        if (objectIDs.length > 10) {
            console.log(`   ... 還有 ${objectIDs.length - 10} 個`)
        }

        // 配置索引設定
        console.log('\n⚙️  配置索引設定...')
        await configureMenuIndex(index)

        console.log('\n' + '='.repeat(80))
        console.log('🎉 完成！Sidebar 資料已成功上傳到 Algolia')
        console.log('='.repeat(80))
        console.log(`\n🔍 索引名稱: ${INDEX_NAME}`)
        console.log(`📊 記錄數量: ${records.length}`)
        console.log(`🌐 Algolia Dashboard: https://dashboard.algolia.com/`)
        console.log('='.repeat(80))

    } catch (error) {
        console.error('\n❌ 上傳失敗:', error)
        console.error('錯誤詳情:', error.message)
        process.exit(1)
    }
}

/**
 * 配置菜單索引設定
 */
async function configureMenuIndex(index) {
    try {
        await index.setSettings({
            // 可搜尋的屬性（依重要性排序）
            searchableAttributes: [
                'name',              // 選單名稱（最重要）
                'searchableText',    // 組合搜尋文字
                'category',          // 類別
                'path',              // 路徑
            ],

            // 用於過濾和分面的屬性
            attributesForFaceting: [
                'group',      // 群組（選單/其他）
                'category',   // 類別（會員/寵物/遊戲等）
                'type',       // 類型（menu/submenu）
                'level',      // 層級
                'isPro',      // 是否為 Pro 功能
                'isNew',      // 是否為新功能
            ],

            // 用於顯示的屬性
            attributesToRetrieve: [
                'name',
                'path',
                'category',
                'group',
                'icon',
                'breadcrumb',
                'type',
                'level',
                'isPro',
                'isNew',
            ],

            // 自定義排序（依層級和字母排序）
            customRanking: [
                'asc(level)',     // 先顯示一級選單
                'asc(name)',      // 再按名稱排序
            ],

            // 高亮設定
            highlightPreTag: '<mark class="bg-yellow-200">',
            highlightPostTag: '</mark>',

            // 搜尋設定
            attributesToHighlight: [
                'name',
                'category',
                'searchableText',
            ],

            // 分頁設定
            hitsPerPage: 20,

            // 查詢語言（支援中文）
            queryLanguages: ['zh', 'en'],

            // 移除停用詞
            removeStopWords: true,

            // 不精確匹配設定
            typoTolerance: true,

            // 分詞設定
            separatorsToIndex: '',

            // 忽略複數形式
            ignorePlurals: false,
        })

        console.log('✅ 索引設定配置完成')

        // 設定同義詞（可選）
        await configureSynonyms(index)

    } catch (error) {
        console.error('❌ 設定索引配置失敗:', error.message)
    }
}

/**
 * 配置搜尋同義詞
 */
async function configureSynonyms(index) {
    try {
        const synonyms = [
            {
                objectID: 'member_synonym',
                type: 'synonym',
                synonyms: ['會員', '用戶', '使用者', 'member', 'user']
            },
            {
                objectID: 'pet_synonym',
                type: 'synonym',
                synonyms: ['寵物', '毛孩', 'pet', 'animal']
            },
            {
                objectID: 'game_synonym',
                type: 'synonym',
                synonyms: ['遊戲', '題庫', 'game', 'quiz']
            },
            {
                objectID: 'community_synonym',
                type: 'synonym',
                synonyms: ['社群', '貼文', '文章', 'community', 'post', 'article']
            },
            {
                objectID: 'support_synonym',
                type: 'synonym',
                synonyms: ['客服', '支援', '幫助', 'support', 'help', 'faq']
            },
            {
                objectID: 'settings_synonym',
                type: 'synonym',
                synonyms: ['設定', '設置', '配置', 'settings', 'config']
            },
        ]

        await index.saveSynonyms(synonyms, {
            replaceExistingSynonyms: true
        })

        console.log('✅ 同義詞設定完成')
    } catch (error) {
        console.warn('⚠️  同義詞設定失敗（可忽略）:', error.message)
    }
}

/**
 * 清空索引（謹慎使用！）
 */
async function clearIndex() {
    console.log('⚠️  警告：即將清空索引...')

    const client = algoliasearch(APP_ID, ADMIN_API_KEY)
    const index = client.initIndex(INDEX_NAME)

    try {
        await index.clearObjects()
        console.log('✅ 索引已清空')
    } catch (error) {
        console.error('❌ 清空索引失敗:', error)
    }
}

/**
 * 主函數
 */
async function main() {
    const args = process.argv.slice(2)
    const command = args[0]

    switch (command) {
        case 'clear':
            await clearIndex()
            break

        case 'upload':
        default:
            await uploadToAlgolia()
            break
    }
}

// 執行
main()
