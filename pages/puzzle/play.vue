<template>
  <StudyLayout v-if="ready" title="拼句练习" :toast="toastMessage">
    <view class="page puzzleplay-page"><view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width: ((sentenceIndex + (answered ? 1 : 0)) / currentSet.items.length * 100) + '%'}"></view></view><text class="muted">{{ sentenceIndex + 1 }} / {{ currentSet.items.length }}</text></view><text class="question-type">{{ currentSet.title }}</text><text class="puzzle-cn">{{ puzzle.cn }}</text><text class="hint-link puzzle-hint" @tap="requestAnswerHint">需要提示？</text><view class="placed-words"><text v-if="!chosenWords.length" class="muted">点选下方单词，组成正确句子</text><view v-for="(word,i) in chosenWords" :key="i" class="word-token chosen" :class="{ 'answer-correct': checked && word === puzzle.answer.split(' ')[i], 'answer-wrong': checked && word !== puzzle.answer.split(' ')[i] }" @tap="unpick(i)">{{ word }}</view></view><view class="word-bank"><view v-for="(word,i) in bank" :key="i" class="word-token" :class="{used: usedIndexes.includes(i)}" @tap="pick(i)">{{ word }}</view></view><view v-if="checked" class="explanation" :class="{ 'feedback-wrong': !correct }"><text class="explanation-title">{{ correct ? '语序正确！' : '标红的词块位置不对，调整后再试' }}</text><text v-if="correct" class="explanation-text">{{ puzzle.answer }}</text></view><view class="bottom-action"><button class="primary-button" @tap="checkOrNext">{{ answered ? (sentenceIndex < currentSet.items.length - 1 ? '下一句' : '完成练习') : '检查答案' }}</button></view></view>
  </StudyLayout>
</template>
<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyLayout from '../../components/StudyLayout.vue'
import { puzzleSets } from '../index/learning-data.js'
import { loadPuzzleProgress, loadRecentItems, savePuzzleProgress, saveRecentItem } from '../../services/study-records.js'
import { useRewardedHint } from '../../composables/useRewardedHint.js'

const ready = ref(false)
const setIndex = ref(0)
const sentenceIndex = ref(0)
const currentSet = computed(() => puzzleSets[setIndex.value] || puzzleSets[0])
const puzzle = computed(() => currentSet.value.items[sentenceIndex.value] || currentSet.value.items[0])
const bank = ref([])
const chosenWords = ref([])
const usedIndexes = ref([])
const answered = ref(false)
const checked = ref(false)
const correct = ref(false)
const toastMessage = ref('')
const { request } = useRewardedHint()
let toastTimer

onLoad(options => {
  const requestedSet = Number(options.item || 0)
  setIndex.value = puzzleSets[requestedSet] ? requestedSet : 0
  const saved = loadPuzzleProgress()[currentSet.value.id] || {cursor:0}
  const requestedSentence = options.sentence === undefined ? saved.cursor : Number(options.sentence)
  sentenceIndex.value = Math.max(0, Math.min(Number.isFinite(requestedSentence) ? requestedSentence : 0, currentSet.value.items.length - 1))
  resetSentence()
  ready.value = true
})
onUnmounted(() => clearTimeout(toastTimer))

function toast(message) { toastMessage.value = message; clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastMessage.value = '' }, 1800) }
function resetSentence() {
  bank.value = puzzle.value.answer.split(' ').sort(() => Math.random() - .5)
  chosenWords.value = []
  usedIndexes.value = []
  answered.value = false
  checked.value = false
  correct.value = false
}
function pick(index) {
  if (answered.value || usedIndexes.value.includes(index)) return
  chosenWords.value.push(bank.value[index])
  usedIndexes.value.push(index)
  checked.value = false
}
function unpick(position) {
  if (answered.value) return
  chosenWords.value.splice(position, 1)
  usedIndexes.value.splice(position, 1)
  checked.value = false
}
function recordProgress(cursor, completed) {
  savePuzzleProgress(loadPuzzleProgress(), currentSet.value, cursor, completed)
  saveRecentItem(loadRecentItems(), 'puzzle', setIndex.value, currentSet.value.title, currentSet.value.subtitle + ' · 拼句练习', {puzzleCursor:cursor,puzzleTotal:currentSet.value.items.length,puzzleCompleted:completed})
}
function checkOrNext() {
  if (answered.value) {
    if (sentenceIndex.value < currentSet.value.items.length - 1) { sentenceIndex.value++; resetSentence() }
    else { toast('这组练习完成'); uni.navigateBack({fail:() => uni.redirectTo({url:'/pages/puzzle/index'})}) }
    return
  }
  if (chosenWords.value.length !== bank.value.length) { toast('先把所有单词拼完'); return }
  correct.value = chosenWords.value.join(' ') === puzzle.value.answer
  checked.value = true
  if (!correct.value) return
  answered.value = true
  const nextCursor = sentenceIndex.value + 1
  recordProgress(nextCursor, nextCursor === currentSet.value.items.length)
}
function requestAnswerHint() {
  const sourceSet = currentSet.value.id
  const sourceIndex = sentenceIndex.value
  request({kind:'puzzle',answer:puzzle.value.answer,isCurrent:() => currentSet.value.id === sourceSet && sentenceIndex.value === sourceIndex})
}
</script>
