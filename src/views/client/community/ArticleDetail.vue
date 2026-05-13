<script setup>
import { readonly, ref, onMounted } from 'vue'
// 假資料
// 內文模擬quill格式生成
const articleDetail = ref({
  articleid: 1,
  title: '貓咪能不能吃螃蟹？獸醫告訴你攝取甲殼類的隱藏風險',
  content: `
  <p><span class="ql-size-large" style="color: rgb(102, 102, 102);">許多飼主在享用豪華的海鮮大餐時，看著愛貓那對渴望的眼神，常會不自覺地想分享一口手中的螃蟹...</span></p>
  <p><br></p>
  <blockquote style="border-left: 4px solid #ccc; margin-bottom: 5px; margin-top: 5px; padding-left: 16px;">
    身為專業的飼主，我們必須先深入了解：螃蟹對於貓咪來說，究竟是<strong>營養補給品</strong>，還是潛藏的<strong>健康炸彈</strong>？
  </blockquote>
  <p><br></p>
  
  <h2 style="color: rgb(230, 0, 0);">一、螃蟹的營養價值與潛在益處</h2>
  <p>從營養學的角度來看，螃蟹確實含有許多對貓咪有益的成分：</p>
  <ul>
    <li><strong>優質蛋白質：</strong>對於維持貓咪肌肉質量至關重要。</li>
    <li><strong style="color: rgb(0, 102, 204);">牛磺酸 (Taurine)：</strong>這是貓咪自身無法合成，卻對心臟與視網膜健康不可或缺的胺基酸。</li>
    <li><strong>Omega-3 脂肪酸：</strong>幫助貓咪維持皮膚健康。</li>
  </ul>
  <p><br></p>
  <p class="ql-align-center"><img src="https://placecats.com/neo/600/400" alt="可愛貓咪觀察海鮮" /></p>
  <p class="ql-align-center"><em style="color: rgb(153, 153, 153);">圖：雖然海鮮很誘人，但給予前必須經過正確處理</em></p>
  <p><br></p>

  <h2 style="color: rgb(230, 0, 0);">二、絕對不能忽視的四大風險</h2>
  <p>雖然營養豐富，但如果處理不當，可能會讓你的貓咪進出動物醫院：</p>
  
  <h3>1. 生食的致命誘惑：<span style="background-color: rgb(255, 255, 0);">硫胺酶 (Thiaminase)</span></h3>
  <p><strong style="color: rgb(255, 0, 0);">絕對不要給貓吃生螃蟹！</strong>生鮮甲殼類動物體內含有硫胺酶，它會分解貓咪體內的維生素 B1。</p>
  
  <h3>2. 硬殼的物理傷害</h3>
  <p>螃蟹殼質地堅硬且尖銳。一旦誤食碎殼，極有可能導致<span style="color: rgb(230, 0, 0);"><strong>食道刺穿</strong></span>或嚴重的腸胃道阻塞。</p>
  <p><br></p>
  <p class="ql-align-center"><img src="https://placecats.com/500/300" alt="睡覺的貓咪" /></p>

  <h2 style="color: rgb(230, 0, 0);">三、如何正確且安全地餵食螃蟹？</h2>
  <p>請務必遵循以下<span style="color: rgb(0, 138, 0);"><strong>「三不原則」</strong></span>：</p>
  <ol>
    <li><span style="background-color: rgb(250, 204, 204);">不要調味</span>：嚴禁加入鹽、胡椒、大蒜或洋蔥。</li>
    <li><span style="background-color: rgb(250, 204, 204);">不要給內臟</span>：蟹膏與蟹黃脂肪含量過高，容易引起消化不良。</li>
    <li><span style="background-color: rgb(250, 204, 204);">不要取代主食</span>：只能佔每日總熱量的 5-10% 以內。</li>
  </ol>
  <p><br></p>
  <p><strong>正確步驟：</strong> <span style="color: rgb(0, 102, 204);">選擇新鮮螃蟹</span> → <span style="color: rgb(0, 102, 204);">清水徹底煮熟</span> → <span style="color: rgb(0, 102, 204);">手工細心去殼</span></p>
  <p><br></p>

  <hr>
  <p><br></p>
  <p>身為飼主，我們的責任是確保每一口進入貓咪嘴裡的食物都是安全的。下次當你在剝蟹腳時，記得：<span class="ql-size-large" style="color: rgb(230, 0, 0);"><strong>愛牠，就請給牠最純粹的肉塊。</strong></span></p>
`,
  categoryid: 5,
  categoryname: '寵物飲食百科',
  userid: 1024,
  username: '螃蟹殺手',
  userphoto: 'https://placecats.com/g/120/80',
  create_at: '2026-05-12 10:30:00',
  tags: ['貓咪健康', '寵物海鮮', '貓飲食指南', '螃蟹'],
  viewcount: 1250,
  bookmark: 85,
})
</script>

<template>
  <!-- 頁面最外層：只寫背景顏色 -->
  <div class="min-h-screen bg-[#FCF8F2] pb-12 text-slate-800">
    <!-- 頂部麵包屑 (巴哈常用) -->
    <nav class="container mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
      首頁 > 論壇 > {{ articleDetail.categoryname }} > {{ articleDetail.title }}
    </nav>

    <!-- 內容區：最大1280px -->
    <div class="container mx-auto w-full max-w-7xl px-4">
      <!-- 左右分邊容器，flex -->
      <!--  -->
      <div class="flex flex-col gap-6 py-8 md:flex-row">
        <!-- 左邊30%：作者資訊 (類似巴哈左側或 Reddit Sidebar) -->
        <!--  -->
        <aside class="w-full md:w-1/4">
          <div class="sticky top-6 flex flex-col gap-4">
            <div class="overflow-hidden rounded-xl bg-white shadow-sm">
              <div class="h-16 bg-linear-to-r from-orange-400 to-amber-500"></div>
              <div class="px-4 pb-6">
                <div class="-mt-8 mb-3 flex justify-center">
                  <img
                    :src="articleDetail.userphoto"
                    class="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm" />
                </div>
                <div class="text-center">
                  <h3 class="text-lg font-bold">{{ articleDetail.username }}</h3>
                  <p class="text-xs text-slate-400">Lv.99 貓咪觀察員</p>
                  <button
                    class="mt-4 w-full rounded-full bg-slate-900 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
                    + 追蹤
                  </button>
                </div>
              </div>
            </div>

            <!-- 文章資訊統計 -->
            <div class="rounded-xl bg-white p-4 shadow-sm">
              <h4 class="mb-3 text-sm font-bold text-slate-500">文章數據</h4>
              <div class="space-y-2 text-sm text-slate-600">
                <div class="flex justify-between">
                  <span>閱讀數</span>
                  <span class="font-mono">{{ articleDetail.viewcount }}</span>
                </div>
                <div class="flex justify-between">
                  <span>收藏數</span>
                  <span class="font-mono">{{ articleDetail.bookmark }}</span>
                </div>
                <div class="flex justify-between">
                  <span>發表日期</span>
                  <span class="font-mono text-xs">{{ articleDetail.create_at }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- 右邊70% 主內容：文章樓層 -->
        <main class="w-full md:w-3/4">
          <!-- 文章首樓卡片 -->
          <article class="overflow-hidden rounded-xl bg-white shadow-sm">
            <!-- 標題區域 -->
            <header class="border-b border-slate-100 p-6 md:p-8">
              <div class="mb-3 flex items-center gap-2">
                <span class="rounded bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">
                  {{ articleDetail.categoryname }}
                </span>
                <div class="flex gap-2">
                  <span
                    v-for="tag in articleDetail.tags"
                    :key="tag"
                    class="cursor-pointer text-xs text-blue-500 hover:underline">
                    #{{ tag }}
                  </span>
                </div>
              </div>
              <h1 class="text-2xl leading-tight font-black md:text-2xl">
                {{ articleDetail.title }}
              </h1>
            </header>

            <!-- 文章內容區域 -->
            <!-- 加上 article-content class 方便在 style 中自定義 v-html 樣式 -->
            <section class="article-content px-6 py-8 md:px-10">
              <div v-html="articleDetail.content" class="prose prose-slate max-w-none"></div>
            </section>

            <!-- 底部按鈕區 (Reddit 風格) -->
            <footer
              class="flex items-center justify-between border-t border-slate-50 bg-slate-50/50 px-6 py-4">
              <div class="flex items-center gap-4">
                <button
                  class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition hover:bg-orange-100 hover:text-orange-600">
                  <span class="text-xl">▲</span>
                  <span class="font-bold">{{ articleDetail.likes }}</span>
                </button>
                <button
                  class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition hover:bg-slate-200">
                  <span>💬</span>
                  <span class="font-bold">12</span>
                </button>
              </div>
              <div class="flex items-center gap-2">
                <button class="rounded-lg p-2 transition hover:bg-slate-200" title="收藏">
                  ⭐
                </button>
                <button class="rounded-lg p-2 transition hover:bg-slate-200" title="分享">
                  🔗
                </button>
              </div>
            </footer>
          </article>

          <!-- 留言區模擬 (巴哈樓層風格) -->
          <section class="mt-6 space-y-4">
            <div class="flex items-center justify-between px-2">
              <h3 class="text-lg font-bold">全部回覆 (2)</h3>
              <select class="rounded border bg-transparent px-1 text-sm outline-none">
                <option>熱門排序</option>
                <option>最新優先</option>
              </select>
            </div>

            <!-- 留言單體 -->
            <div class="rounded-xl border-l-4 border-slate-300 bg-white p-6 shadow-sm">
              <div class="flex items-start gap-4">
                <img src="https://placecats.com/g/50/50" class="h-10 w-10 rounded-full" />
                <div class="flex-1">
                  <div class="mb-1 flex items-center justify-between">
                    <span class="text-sm font-bold">二樓路人甲</span>
                    <span class="text-xs text-slate-400">B2 | 2026-05-12 11:20</span>
                  </div>
                  <p class="text-slate-700">這篇分析好專業！推一個，我家貓咪真的很愛盯著海鮮看。</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 讓 v-html 內的內容符合 Quill 的預設視覺 */
.article-content :deep(.ql-align-center) {
  text-align: center;
}

.article-content :deep(.ql-size-large) {
  font-size: 1.5rem;
}

/* 處理列表在 Tailwind 下消失的問題 */
.article-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.article-content :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

/* 讓圖片更美觀 */
.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 1rem auto;
}

/* 模擬螢光筆 */
.article-content :deep(span[style*='background-color']) {
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
