<script setup>
import { Award, ChevronRight, Star, Sparkles, CheckCircle } from 'lucide-vue-next'
import { useHomeTriviaQuiz } from '@/composables/Client/Home/useHomeTriviaQuiz'

const { quizScore, quizState, selectedOption, quizQuestion, handleAnswer, resetQuiz } =
  useHomeTriviaQuiz()
</script>

<template>
  <div
    class="card-feature group rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_#445944] md:p-8">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="rounded-2xl border-2 border-[#445944] bg-[#f2d44d]/15 p-3 text-[#445944]">
          <Award :size="28" />
        </div>
        <div>
          <h3 class="text-2xl font-extrabold text-[#445944]">知識問答</h3>
          <p class="text-xs text-gray-500">解鎖養寵知識與毛幣造型</p>
        </div>
      </div>
      <router-link
        to="/game"
        class="text-brand-success-900 flex items-center gap-1 text-sm font-bold hover:underline">
        進入遊戲
        <ChevronRight :size="16" />
      </router-link>
    </div>

    <div class="mb-6 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-4">
      <div class="mb-3 flex items-center justify-between">
        <span class="rounded-full bg-[#FAE4AE] px-2 py-0.5 text-xs font-bold text-amber-800">
          每日知識一題
        </span>
        <span class="font-fredoka flex items-center gap-1 text-xs font-bold text-amber-700">
          <Star :size="12" fill="currentColor" />
          首頁積分: {{ quizScore }}
        </span>
      </div>
      <h4 class="mb-4 text-sm leading-relaxed font-extrabold text-gray-800">
        {{ quizQuestion.question }}
      </h4>

      <div class="space-y-2">
        <button
          v-for="(opt, idx) in quizQuestion.options"
          :key="idx"
          @click="handleAnswer(idx)"
          :disabled="quizState === 'answered'"
          class="flex w-full items-center justify-between rounded-xl border-2 p-3 text-left text-xs font-semibold transition-all"
          :class="[
            quizState === 'pending'
              ? 'border-gray-200 bg-white hover:border-black hover:bg-gray-50'
              : opt.isCorrect
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                : selectedOption === idx
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : 'border-gray-200 bg-white opacity-60',
          ]">
          <span>{{ opt.text }}</span>
          <component
            v-if="quizState === 'answered' && opt.isCorrect"
            :is="CheckCircle"
            :size="14"
            class="ml-2 shrink-0 text-emerald-600" />
        </button>
      </div>

      <div
        v-if="quizState === 'answered'"
        class="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-3">
        <div class="mb-1 flex items-center gap-1">
          <Sparkles :size="14" class="animate-bounce text-amber-500" />
          <span class="text-xs font-black text-gray-700">
            {{
              quizQuestion.options[selectedOption].isCorrect
                ? '答對了！恭喜獲得 10 積分 🎉'
                : '答錯了，再接再厲！'
            }}
          </span>
        </div>
        <p class="text-[11px] leading-relaxed text-gray-500">
          {{ quizQuestion.explanation }}
        </p>
        <button
          @click="resetQuiz"
          class="mt-2 text-[10px] font-bold text-[#445944] underline hover:text-black">
          再試一次
        </button>
      </div>
    </div>

    <router-link
      to="/game"
      class="text-theme-lg block w-full rounded-xl bg-[#445944] py-3 text-center font-bold text-white transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
      🎮 開始寵物問答挑戰
    </router-link>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap');

.font-fredoka {
  font-family: 'Fredoka', 'GenJyuu', sans-serif;
}

.card-feature {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
