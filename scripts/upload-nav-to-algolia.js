/**
 * 將 Nav 導航頁面資訊上傳到 Algolia dev_page 索引
 * 
 * 使用方式：
 * 1. 確保已設定 VITE_ALGOLIA_APP_ID 和 VITE_ALGOLIA_ADMIN_KEY
 * 2. 執行: node scripts/upload-nav-to-algolia.js
 * 
 * 注意：這個腳本使用 Admin API Key，不要在前端使用！
 */

import algoliasearch from 'algoliasearch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// 載入環境變數
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 從環境變數讀取配置
const APP_ID = process.env.VITE_ALGOLIA_APP_ID || 'YOUR_APP_ID'
const ADMIN_API_KEY = process.env.VITE_ALGOLIA_ADMIN_KEY || 'YOUR_ADMIN_API_KEY'
const INDEX_NAME = process.env.VITE_ALGOLIA_INDEX_NAME || 'dev_PAGENAME'

/**
 * 讀取 nav-pages.json 資料
 */
function loadNavPages() {
    const filePath = path.join(__dirname, '../docs/nav-pages.json')

    try {
        const rawData = fs.readFileSync(filePath, 'utf8')
        const pages = JSON.parse(rawData)
        return pages
    } catch (error) {
        console.error('❌ 無法讀取 nav-pages.json:', error.message)
        process.exit(1)
    }
}

/**
 * 上傳導航頁面資料到 Algolia
 */
async function uploadToAlgolia() {
    console.log('🚀 開始上傳導航頁面資料到 Algolia...\n')

    // 檢查配置
    if (APP_ID === 'YOUR_APP_ID' || ADMIN_API_KEY === 'YOUR_ADMIN_API_KEY') {
        console.error('❌ 請先設定 Algolia 環境變數：')
        console.error('   VITE_ALGOLIA_APP_ID')
        console.error('   VITE_ALGOLIA_ADMIN_KEY')
        console.error('\n💡 提示：請在 .env 檔案中設定這些變數')
        process.exit(1)
    }

    // 初始化 Algolia 客戶端
    const client = algoliasearch(APP_ID, ADMIN_API_KEY)
    const index = client.initIndex(INDEX_NAME)

    // 讀取導航頁面資料
    const records = loadNavPages()

    console.log(`📊 準備上傳 ${records.length} 個導航頁面到索引: ${INDEX_NAME}\n`)
    console.log('📄 包含的頁面：')
    records.forEach(record => {
        console.log(`   - ${record.name} (${record.path})`)
    })

    try {
        // 上傳資料
        const { objectIDs } = await index.saveObjects(records, {
            autoGenerateObjectIDIfNotExist: false
        })

        console.log('\n✅ 資料上傳成功！')
        console.log(`📦 已上傳的 Object IDs:`)
        objectIDs.forEach(id => console.log(`   - ${id}`))

        // 配置索引設定
        console.log('\n⚙️  配置索引設定...')
        await configurePageIndex(index)

        console.log('\n' + '='.repeat(80))
        console.log('🎉 完成！導航頁面資料已成功上傳到 Algolia')
        console.log('='.repeat(80))
        console.log(`\n🔍 索引名稱: ${INDEX_NAME}`)
        console.log(`📊 記錄數量: ${records.length}`)
        console.log(`🌐 Algolia Dashboard: https://dashboard.algolia.com/`)
        console.log('\n📝 前端使用方式：')
        console.log('   import { useAlgoliaSearch } from "@/composables/useAlgoliaSearch"')
        console.log('   const { query, hits, search } = useAlgoliaSearch("dev_page")')
        console.log('='.repeat(80))

    } catch (error) {
        console.error('\n❌ 上傳失敗:', error)
        console.error('錯誤詳情:', error.message)
        if (error.transporterStackTrace) {
            console.error('堆疊追蹤:', error.transporterStackTrace)
        }
        process.exit(1)
    }
}

/**
 * 配置頁面索引設定
 */
async function configurePageIndex(index) {
    try {
        await index.setSettings({
            // 可搜尋的屬性（依重要性排序）
            searchableAttributes: [
                'name',              // 頁面名稱（最重要）
                'searchableText',    // 組合搜尋文字
                'category',          // 類別
                'description',       // 描述
                'path',              // 路徑
            ],

            // 用於過濾和分面的屬性
            attributesForFaceting: [
                'searchable(group)',      // 群組（導航）
                'searchable(category)',   // 類別（寵物/遊戲/社群等）
                'searchable(type)',       // 類型（main/submenu/utility）
                'level',                  // 層級
            ],

            // 自定義排名
            customRanking: [
                'desc(level)',  // 優先顯示主選單
                'asc(name)',    // 按名稱排序
            ],

            // 結果排名
            ranking: [
                'typo',
                'geo',
                'words',
                'filters',
                'proximity',
                'attribute',
                'exact',
                'custom'
            ],

            // 高亮設定
            attributesToHighlight: [
                'name',
                'description',
                'searchableText'
            ],

            // 返回的屬性
            attributesToRetrieve: [
                'name',
                'path',
                'category',
                'group',
                'icon',
                'type',
                'description',
                'breadcrumb',
                'level'
            ],

            // 每頁結果數
            hitsPerPage: 20,

            // 錯別字容忍度
            typoTolerance: 'min',

            // 移除多餘的空格
            removeStopWords: true,

            // 忽略複數形
            ignorePlurals: true,
        })

        console.log('✅ 索引設定完成')

    } catch (error) {
        console.error('❌ 配置索引失敗:', error.message)
        throw error
    }
}

// 執行上傳
uploadToAlgolia().catch(error => {
    console.error('程式執行失敗:', error)
    process.exit(1)
})
