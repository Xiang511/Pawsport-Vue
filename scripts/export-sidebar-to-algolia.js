/**
 * 將 Sidebar 菜單資訊導出為 Algolia 格式的 JSON
 * 
 * 執行方式：
 * node scripts/export-sidebar-to-algolia.js
 */

// Sidebar 菜單結構（從 AppSidebar.vue 複製）
const menuGroups = [
    {
        title: '選單',
        items: [
            {
                icon: 'UsersRound',
                name: '會員',
                subItems: [
                    { name: '基本資料', path: '/dashboard/member' },
                    { name: '違規名單', path: '/dashboard/Blocklist' },
                    { name: '權限管理', path: '/dashboard/permissions' },
                ],
            },
            {
                icon: 'Dog',
                name: '寵物',
                subItems: [
                    { name: '寵物資訊一覽', path: '/dashboard/pet', pro: false },
                    { name: '寵物健康護照', path: '/dashboard/passport', pro: false },
                    { name: '領養記錄一覽', path: '/dashboard/adoption', pro: false },
                    { name: '寵物走失紀錄', path: '/dashboard/missingreport', pro: false },
                ],
            },
            {
                icon: 'Gamepad2Icon',
                name: '遊戲',
                subItems: [
                    { name: '題庫管理', path: '/dashboard/questions', pro: false },
                    { name: '玩家管理', path: '/dashboard/players', pro: false },
                    { name: '商店管理', path: '/dashboard/shop', pro: false },
                ],
            },
            {
                icon: 'NotebookPen',
                name: '社群',
                subItems: [
                    { name: '貼文管理', path: '/dashboard/article-list', pro: false },
                    { name: '基本資料', path: '/dashboard/basic-tables', pro: false },
                    { name: '違規名單', path: '/violation-list', pro: false },
                    { name: '權限管理', path: '/permissions', pro: false },
                ],
            },
            {
                icon: 'MessageCircleMore',
                name: '客服',
                subItems: [
                    { name: '常見問題', path: '/dashboard/faq', pro: false },
                    { name: 'QA記錄', path: '/dashboard/qa', pro: false },
                    { name: '電子報', path: '/dashboard/enewsletter', pro: false },
                    { name: 'LINE BOT', path: '/dashboard/linebot', pro: false },
                ],
            },
        ],
    },
    {
        title: '其他',
        items: [
            {
                icon: 'Settings',
                name: '系統設定',
                subItems: [
                    { name: '登入活動', path: '/dashboard/log-activity', pro: false },
                    { name: 'Bar Chart', path: '/dashboard/bar-chart', pro: false },
                ],
            },
        ],
    },
]

/**
 * 將 Sidebar 資料轉換成 Algolia 記錄格式
 */
function convertToAlgoliaRecords() {
    const records = []
    let id = 1

    menuGroups.forEach((group) => {
        group.items.forEach((item) => {
            // 如果有子選項，則為每個子選項創建記錄
            if (item.subItems) {
                item.subItems.forEach((subItem) => {
                    records.push({
                        objectID: `menu_${id}`,
                        name: subItem.name,
                        path: subItem.path,
                        category: item.name, // 父級類別
                        group: group.title, // 群組名稱
                        icon: item.icon,
                        type: 'submenu',
                        isPro: subItem.pro || false,
                        isNew: subItem.new || false,
                        // 搜尋用的文字組合
                        searchableText: `${subItem.name} ${item.name} ${group.title}`,
                        // 階層路徑（用於麵包屑）
                        breadcrumb: `${group.title} > ${item.name} > ${subItem.name}`,
                        level: 2, // 二級選單
                    })
                    id++
                })
            }
            // 如果有直接路徑（沒有子選項）
            else if (item.path) {
                records.push({
                    objectID: `menu_${id}`,
                    name: item.name,
                    path: item.path,
                    category: item.name,
                    group: group.title,
                    icon: item.icon,
                    type: 'menu',
                    isPro: item.pro || false,
                    isNew: item.new || false,
                    searchableText: `${item.name} ${group.title}`,
                    breadcrumb: `${group.title} > ${item.name}`,
                    level: 1, // 一級選單
                })
                id++
            }
        })
    })

    return records
}

/**
 * 主函數
 */
async function main() {
    console.log('📋 開始導出 Sidebar 資料...\n')

    // 轉換資料
    const records = convertToAlgoliaRecords()

    // 顯示統計
    console.log('✅ 轉換完成！')
    console.log(`📊 總共有 ${records.length} 個選單項目\n`)

    // 按類別統計
    const categories = {}
    records.forEach(record => {
        if (!categories[record.category]) {
            categories[record.category] = 0
        }
        categories[record.category]++
    })

    console.log('📁 類別統計：')
    Object.entries(categories).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} 個項目`)
    })

    // 輸出 JSON
    const jsonOutput = JSON.stringify(records, null, 2)

    console.log('\n' + '='.repeat(80))
    console.log('📄 Algolia JSON 格式：')
    console.log('='.repeat(80))
    console.log(jsonOutput)
    console.log('='.repeat(80))

    // 儲存到文件
    const fs = await import('fs')
    const path = await import('path')
    const { fileURLToPath } = await import('url')

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const outputPath = path.join(__dirname, '..', 'sidebar-algolia.json')

    try {
        fs.writeFileSync(outputPath, jsonOutput, 'utf8')
        console.log(`\n💾 JSON 已儲存到: ${outputPath}`)
    } catch (error) {
        console.error('\n❌ 儲存文件失敗:', error.message)
    }

    // 顯示使用說明
    console.log('\n' + '='.repeat(80))
    console.log('📖 接下來的步驟：')
    console.log('='.repeat(80))
    console.log('1. 檢查生成的 sidebar-algolia.json 文件')
    console.log('2. 使用以下命令上傳到 Algolia:')
    console.log('   node scripts/upload-sidebar-to-algolia.js')
    console.log('3. 或在 Algolia Dashboard 手動上傳此 JSON 文件')
    console.log('='.repeat(80))

    return records
}

// 導出函數供其他腳本使用
export {
    convertToAlgoliaRecords,
    menuGroups
}

// 執行主函數
main().catch(error => {
    console.error('執行失敗:', error)
    process.exit(1)
})
