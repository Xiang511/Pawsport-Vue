<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as signalR from '@microsoft/signalr'
import { Bot, X, Send, Sparkles } from 'lucide-vue-next'

const isOpen = ref(false) // 控制聊天視窗開關
const messageInput = ref('')
const chatHistory = ref([
  // 預設一條歡迎訊息
  {
    sender: 'AI',
    text: '汪汪！我是 Petmily 專屬 AI 小幫手 🐾 請問有什麼我可以幫忙的嗎？',
    time: new Date().toLocaleTimeString(),
  },
])
let connection = null
const chatContainer = ref(null) // 用來抓取聊天室的捲軸

onMounted(async () => {
  // 1. 建立 SignalR 連線設定
  connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7048/aiChatHub')
    .withAutomaticReconnect()
    .build()

  // 2. 監聽後端傳來的 "ReceiveMessage" 事件
  connection.on('ReceiveMessage', (sender, message) => {
    chatHistory.value.push({
      sender: sender,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    scrollToBottom()
  })

  // 3. 正式啟動連線
  try {
    await connection.start()
    console.log('SignalR 連線成功！')
  } catch (err) {
    console.error('SignalR 連線失敗: ', err)
  }
})

onUnmounted(() => {
  if (connection) {
    connection.stop()
  }
})

// 防連點
const isSending = ref(false)

// 4. 點擊送出按鈕
const sendMessage = async (event) => {
  // 【防護一】如果是中文輸入法正在選字時按下的 Enter，直接阻斷，不送出！
  if (event && event.isComposing) return

  // 【防護二】如果輸入框沒字，或者「正在發送中(鎖上了)」，也不要執行
  if (!messageInput.value || isSending.value) return

  // 正式開始發送，把鎖「鎖上」
  isSending.value = true

  try {
    // 呼叫 C# Hub 裡面的 "SendMessage" 方法
    await connection.invoke('SendMessage', messageInput.value)
    messageInput.value = '' // 清空輸入框
  } catch (err) {
    console.error('發送失敗: ', err)
  } finally {
    // 執行完畢 (不管成功或失敗)，把鎖「解開」
    isSending.value = false
  }
}

// 讓聊天室永遠捲動到最底部的魔法
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
</script>

<template>
  <div>
    <button
      @click="isOpen = !isOpen"
      class="group fixed bottom-8 left-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#755e44] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#5c4e40] hover:shadow-xl"
      title="呼叫 AI 小幫手">
      <Bot v-if="!isOpen" class="h-8 w-8 transition-transform group-hover:scale-110" />
      <X v-else class="h-8 w-8 transition-transform group-hover:rotate-90" />

      <span v-if="!isOpen" class="absolute top-0 right-0 flex h-4 w-4">
        <span
          class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
        <span class="relative inline-flex h-4 w-4 rounded-full bg-amber-500"></span>
      </span>
    </button>

    <Transition name="slide-up">
      <div
        v-if="isOpen"
        class="fixed bottom-28 left-8 z-50 flex h-[500px] w-80 flex-col overflow-hidden rounded-2xl border-2 border-[#e8dccb] bg-white shadow-2xl sm:w-96">
        <div class="flex items-center justify-between bg-[#755e44] px-4 py-3 text-white">
          <div class="flex items-center gap-2 font-bold tracking-wider">
            <Sparkles class="h-5 w-5 text-amber-300" />
            Petmily | AI 客服小幫手
          </div>
          <button
            @click="isOpen = false"
            class="rounded-full p-1 transition-colors hover:bg-white/20">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div ref="chatContainer" class="flex-1 overflow-y-auto bg-[#fbf6ef] p-4">
          <div v-for="(msg, index) in chatHistory" :key="index" class="mb-4 flex flex-col">
            <div
              :class="msg.sender === 'User' ? 'self-end text-right' : 'self-start text-left'"
              class="max-w-[85%]">
              <div
                class="inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm"
                :class="
                  msg.sender === 'User'
                    ? 'rounded-br-sm bg-[#755e44] text-white'
                    : 'rounded-bl-sm border border-[#e8dccb] bg-white text-[#7a6856]'
                ">
                {{ msg.text }}
              </div>

              <div class="mt-1 text-[11px] text-[#b4a496]">
                {{ msg.sender === 'User' ? '您' : 'AI 客服小幫手' }} • {{ msg.time }}
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-[#e8dccb] bg-white p-3">
          <div class="flex gap-2">
            <input
              v-model="messageInput"
              @keydown.enter="sendMessage($event)"
              type="text"
              class="flex-1 rounded-lg border px-3 py-2"
              placeholder="輸入訊息..." />
            <button
              @click="sendMessage"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#755e44] text-white transition-transform hover:scale-105 hover:bg-[#5c4e40]">
              <Send class="ml-0.5 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
