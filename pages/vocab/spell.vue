<template>
  <StudyLayout v-if="ready" title="拼写练习" immersive :step="spellIndex + 1" :total="spellWords.length" :toast="toastMessage" :back-action="exitSpelling">
    <view class="page spell-page"><view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width:progressPercent + '%'}"></view></view></view><view class="spell-prompt"><text class="eyebrow">根据中文释义拼出单词</text><text class="spell-meaning">{{ currentWord.pos }}　{{ currentWord.meaning }}</text><text class="hint-link" @tap="requestAnswerHint">需要提示？</text></view><view class="card spelling-card"><view class="letter-slots"><view v-for="(letter,i) in slots" :key="i" class="letter-slot" :class="{'answer-correct':checked && letter === currentWord.word.toLowerCase()[i],'answer-wrong':checked && letter !== currentWord.word.toLowerCase()[i]}" @tap="removeLetter(i)">{{ letter || '' }}</view></view><view class="letter-bank"><button v-for="(letter,i) in letterBank" :key="i" class="letter-key" :disabled="usedLetters.includes(i) || answered" @tap="addLetter(i)">{{ letter }}</button></view><view v-if="checked" class="explanation" :class="{'feedback-wrong':!correct}"><text class="explanation-title">{{ correct ? (from === 'worddetail' ? '拼写正确，本词已学完！' : '拼写正确！') : '标红的字母位置不对，调整后再试' }}</text><text v-if="correct" class="explanation-text">{{ currentWord.word }}　{{ currentWord.meaning }}</text></view></view><view class="bottom-action"><button class="primary-button" @tap="checkOrNext">{{ actionLabel }}</button></view></view>
  </StudyLayout>
</template>
<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyLayout from '../../components/StudyLayout.vue'
import { words } from '../index/learning-data.js'
import { dailyWordIndexes, localDayKey } from '../../config/daily-words.js'
import { scopedWords, nextWordIndex, studyWordIndexes, wordStudyQuery } from '../../features/vocab/word-scope.js'
import { finishWordStudyStep, advanceWordStudy } from '../../features/vocab/word-navigation.js'
import { loadDailyWordProgress, loadRecentItems, loadWordCompletion, saveRecentItem } from '../../services/study-records.js'
import { useRewardedHint } from '../../composables/useRewardedHint.js'
const ready = ref(false)
const item = ref(0)
const from = ref('wordlist')
const articleIndex = ref(-1)
const seriesIndex = ref(-1)
const source = ref('article')
const chapterIndex = ref(0)
const dailyStudy = ref(false)
const studyDate = ref('')
const spellIndex = ref(0)
const spellWords = computed(() => {
  if (from.value === 'worddetail') return [words[item.value] || words[0]]
  if (from.value === 'today') return dailyWordIndexes(studyDate.value || localDayKey(),words.length).map(index => words[index])
  if (from.value === 'articlewordlist') return scopedWords(source.value,articleIndex.value,seriesIndex.value,chapterIndex.value).words
  return words
})
const currentWord = computed(() => spellWords.value[spellIndex.value] || words[0])
const context = computed(() => ({dailyStudy:dailyStudy.value,studyDate:studyDate.value || localDayKey(),source:source.value,articleIndex:articleIndex.value,seriesIndex:seriesIndex.value,chapterIndex:chapterIndex.value}))
const slots = ref([])
const letterBank = ref([])
const usedLetters = ref([])
const answered = ref(false)
const checked = ref(false)
const correct = ref(false)
const toastMessage = ref('')
const progressPercent = computed(() => spellWords.value.length ? (spellIndex.value + (answered.value && correct.value ? 1 : 0)) / spellWords.value.length * 100 : 0)
const nextIndex = computed(() => nextWordIndex(item.value,context.value))
const actionLabel = computed(() => {
  if (!answered.value) return '检查拼写'
  if (from.value === 'worddetail') {
    if (nextIndex.value >= 0) return '下一个单词'
    if (dailyStudy.value) return '完成今日学习'
    if (source.value === 'external') return '完成本章词汇'
    if (articleIndex.value >= 0) return '完成本文词汇'
    return '完成本轮学习'
  }
  return spellIndex.value < spellWords.value.length - 1 ? '下一个单词' : from.value === 'today' ? '完成今日拼写' : '完成练习'
})
const { request } = useRewardedHint()
let toastTimer
onLoad(options => {
  from.value = options.from || 'wordlist'
  item.value = Number(['worddetail','today'].includes(from.value) ? options.item || 0 : options.series || options.item || 0)
  articleIndex.value = options.article === undefined ? -1 : Number(options.article)
  seriesIndex.value = options.series === undefined ? -1 : Number(options.series)
  source.value = options.source || 'article'
  chapterIndex.value = Number(options.chapter || 0)
  dailyStudy.value = options.study === 'daily'
  studyDate.value = options.day || ''
  if (from.value === 'today') spellIndex.value = Math.max(0,dailyWordIndexes(studyDate.value || localDayKey(),words.length).indexOf(item.value))
  setupSpell()
  ready.value = true
})
onUnmounted(() => clearTimeout(toastTimer))
function toast(message) { toastMessage.value = message; clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastMessage.value = '' },1800) }
function setupSpell() { const answer = currentWord.value.word.toLowerCase(); slots.value = Array(answer.length).fill(''); letterBank.value = answer.split('').sort(() => Math.random() - .5); usedLetters.value = []; answered.value = false; correct.value = false; checked.value = false }
function addLetter(index) { if (usedLetters.value.includes(index) || answered.value) return; const empty = slots.value.indexOf(''); if (empty < 0) return; slots.value[empty] = letterBank.value[index]; usedLetters.value.push(index); checked.value = false }
function removeLetter(index) { if (answered.value || !slots.value[index]) return; const letter = slots.value[index]; const bankIndex = letterBank.value.findIndex((entry,i) => entry === letter && usedLetters.value.includes(i)); if (bankIndex >= 0) usedLetters.value = usedLetters.value.filter(i => i !== bankIndex); slots.value[index] = ''; checked.value = false }
function completeWord() {
  if (from.value !== 'worddetail') return
  const word = currentWord.value
  const index = words.findIndex(entry => entry.word === word.word)
  if (index < 0) return
  const completion = loadWordCompletion()
  if (!completion[word.word]) { completion[word.word] = true; try { uni.setStorageSync('readEnglishWordCompletion',completion); uni.$emit('readEnglishWordCompletionUpdate') } catch (_) {} }
  if (dailyStudy.value && studyWordIndexes(context.value).includes(index)) {
    const next = {...loadDailyWordProgress(context.value.studyDate),[word.word]:true}
    try { uni.setStorageSync('readEnglishDailyWordProgress:' + context.value.studyDate,next); uni.$emit('readEnglishDailyWordProgressUpdate') } catch (_) {}
  }
  saveRecentItem(loadRecentItems(),'word',index,word.word,word.pos + ' ' + word.meaning)
}
function checkOrNext() {
  if (!answered.value) {
    if (slots.value.includes('')) { toast('请先填完所有字母'); return }
    correct.value = slots.value.join('') === currentWord.value.word.toLowerCase()
    checked.value = true
    answered.value = correct.value
    if (correct.value) completeWord()
    return
  }
  if (from.value === 'worddetail') {
    if (nextIndex.value >= 0) advanceWordStudy(item.value,nextIndex.value,'/pages/vocab/detail?item=' + nextIndex.value + wordStudyQuery(context.value))
    else finishWordStudyStep()
    return
  }
  if (spellIndex.value < spellWords.value.length - 1) { spellIndex.value++; setupSpell(); return }
  toast('拼写练习完成')
  const fallback = from.value === 'today' ? '/pages/vocab/index' : from.value === 'articlewordlist' && source.value === 'external' ? '/pages/vocab/list?source=external&series=' + seriesIndex.value + '&chapter=' + chapterIndex.value : from.value === 'articlewordlist' ? '/pages/vocab/list?article=' + articleIndex.value : '/pages/vocab/list'
  uni.navigateBack({fail:() => fallback === '/pages/vocab/index' ? uni.switchTab({url:fallback}) : uni.redirectTo({url:fallback})})
}
function exitSpelling() { if (from.value === 'worddetail') finishWordStudyStep(); else uni.navigateBack({fail:() => uni.switchTab({url:'/pages/vocab/index'})}) }
function requestAnswerHint() { const word = currentWord.value.word; request({kind:'spell',answer:word,isCurrent:() => currentWord.value.word === word}) }
</script>
