<template>
  <StudyLayout v-if="ready" title="语法练习" :toast="toastMessage">
    <view class="page question-page"><view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width: answered ? '100%' : '35%'}"></view></view><text class="muted">练习</text></view><text class="question-type">语法小练习</text><text class="question-title">{{ currentGrammar.quiz.prompt }}</text><view class="option-list"><view v-for="(option,i) in currentGrammar.quiz.options" :key="i" class="option-card" :class="optionState(i)" @tap="choose(i)"><text class="option-letter">{{ String.fromCharCode(65+i) }}</text><text>{{ option }}</text><text v-if="answered && i === currentGrammar.quiz.answer" class="option-check">✓</text></view></view><view v-if="answered" class="explanation"><text class="explanation-title">{{ correct ? '回答正确' : '看看解析' }}</text><text class="explanation-text">{{ currentGrammar.quiz.explanation }}</text></view><view class="bottom-action"><button class="primary-button" @tap="checkOrReturn">{{ answered ? '返回语法解析' : '确认答案' }}</button></view></view>
  </StudyLayout>
</template>
<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyLayout from '../../components/StudyLayout.vue'
import { grammar } from '../index/learning-data.js'
const ready = ref(false)
const item = ref(0)
const currentGrammar = computed(() => grammar[item.value] || grammar[0])
const selected = ref(-1)
const answered = ref(false)
const correct = ref(false)
const toastMessage = ref('')
let toastTimer
onLoad(options => { const requested = Number(options.item || 0); item.value = grammar[requested] ? requested : 0; ready.value = true })
onUnmounted(() => clearTimeout(toastTimer))
function choose(index) { if (!answered.value) selected.value = index }
function optionState(index) {
  if (!answered.value) return selected.value === index ? 'chosen-option' : ''
  if (index === currentGrammar.value.quiz.answer) return 'correct-option'
  return index === selected.value ? 'wrong-option' : ''
}
function checkOrReturn() {
  if (answered.value) { uni.navigateBack({fail:() => uni.redirectTo({url:'/pages/grammar/detail?item=' + item.value})}); return }
  if (selected.value < 0) { toastMessage.value = '先选择一个答案'; clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastMessage.value = '' }, 1800); return }
  correct.value = selected.value === currentGrammar.value.quiz.answer
  answered.value = true
}
</script>
