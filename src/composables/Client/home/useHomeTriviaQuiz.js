import { ref } from 'vue'

const quizQuestion = {
  question: '巧克力與葡萄乾對貓狗有致命危險，這是因為什麼？',
  options: [
    { text: '巧克力含可可鹼易致中毒，葡萄乾會引發急性腎衰竭', isCorrect: true },
    { text: '主要是太甜導致牙齒蛀牙，以及糖分過高變胖', isCorrect: false },
    { text: '因為可可粉會黏住喉嚨，葡萄乾會卡在氣管堵塞', isCorrect: false },
  ],
  explanation:
    '可可鹼在貓狗體內代謝極慢，會損害中樞神經系統與心肌；而葡萄與葡萄乾即使是極小計量也可能引發嚴重的急性腎衰竭，絕對不可餵食！',
}

export function useHomeTriviaQuiz() {
  const quizScore = ref(0)
  const quizState = ref('pending') // pending | answered
  const selectedOption = ref(null)

  const handleAnswer = (index) => {
    if (quizState.value !== 'pending') return
    selectedOption.value = index
    quizState.value = 'answered'
    if (quizQuestion.options[index].isCorrect) {
      quizScore.value += 10
    }
  }

  const resetQuiz = () => {
    quizState.value = 'pending'
    selectedOption.value = null
  }

  return { quizScore, quizState, selectedOption, quizQuestion, handleAnswer, resetQuiz }
}
