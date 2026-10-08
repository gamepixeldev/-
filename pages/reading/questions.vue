<template>
  <StudyLayout v-if="ready" title="阅读理解" immersive :step="questionIndex + 1" :total="questions.length" :toast="toastMessage">
    <view class="page question-page"><view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width: ((questionIndex + 1) / questions.length * 100) + '%'}"></view></view></view><text class="question-type">{{ question.type }}</text><text class="question-title">{{ question.prompt }}</text><text class="question-cn">{{ question.cn }}</text><view v-if="question.kind === 'choice'" class="option-list"><view v-for="(option,i) in question.options" :key="i" class="option-card" :class="optionState(i)" @tap="chooseOption(i)"><text class="option-letter">{{ String.fromCharCode(65 + i) }}</text><text>{{ option }}</text><text v-if="answered && i === question.answer" class="option-check">✓</text></view></view><view v-else class="fill-wrap"><input v-model="fillAnswer" class="fill-input" placeholder="输入你的答案" /></view><view v-if="answered" class="explanation"><text class="explanation-title">{{ correct ? '回答正确' : '看看解析' }}</text><text class="explanation-text">{{ question.explanation }}</text></view><view class="bottom-action"><button class="primary-button" @tap="checkOrNext">{{ answered ? (questionIndex < questions.length - 1 ? '下一题' : '完成练习') : '确认答案' }}</button></view></view>
  </StudyLayout>
</template>
<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyLayout from '../../components/StudyLayout.vue'
import { resolveReadingContext } from '../../features/reading/reading-context.js'
defineOptions({ inheritAttrs: false })
const ready = ref(false)
const item = ref(0)
const chapterIndex = ref(0)
const source = ref('article')
const context = computed(() => resolveReadingContext(source.value,item.value,chapterIndex.value))
const questions = computed(() => context.value.article.questions || [])
const questionIndex = ref(0)
const question = computed(() => questions.value[questionIndex.value] || questions.value[0] || {})
const selectedOption = ref(-1)
const fillAnswer = ref('')
const answered = ref(false)
const correct = ref(false)
const toastMessage = ref('')
let toastTimer
onLoad(options => { item.value = Number(options.series || options.item || 0); chapterIndex.value = Number(options.chapter || 0); source.value = options.source || 'article'; ready.value = true })
onUnmounted(() => clearTimeout(toastTimer))
function toast(message) { toastMessage.value = message; clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastMessage.value = '' }, 1800) }
function chooseOption(index) { if (!answered.value) selectedOption.value = index }
function optionState(index) {
  if (!answered.value) return selectedOption.value === index ? 'chosen-option' : ''
  if (index === question.value.answer) return 'correct-option'
  return index === selectedOption.value ? 'wrong-option' : ''
}
function checkOrNext() {
  if (!answered.value) {
    if (selectedOption.value < 0 && !fillAnswer.value.trim()) { toast('先选择或填写答案'); return }
    correct.value = question.value.kind === 'choice' ? selectedOption.value === question.value.answer : fillAnswer.value.trim().toLowerCase() === question.value.answer.toLowerCase()
    answered.value = true
    return
  }
  if (questionIndex.value < questions.value.length - 1) { questionIndex.value++; selectedOption.value = -1; fillAnswer.value = ''; answered.value = false; return }
  toast('阅读理解完成')
  const fallback = context.value.isExternal ? '/pages/reading/chapter?item=' + context.value.seriesIndex + '&chapter=' + context.value.chapterIndex : '/pages/reading/article?item=' + context.value.articleIndex
  uni.navigateBack({fail:() => uni.redirectTo({url:fallback})})
}
</script>
