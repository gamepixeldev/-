<template>
  <StudyLayout title="单词详解" :show-back="false">
    <view class="page vocab-page"><view class="vocab-intro"><text class="eyebrow">VOCABULARY</text><text class="large-title">每天几个词，慢慢学扎实</text></view><view class="card today-word-card"><view class="today-card-top"><view><text class="today-label">TODAY'S WORDS</text><text class="today-title">今日单词</text></view><text class="today-date">{{ todayDateLabel }}</text></view><view class="today-progress-row"><text>已完成 {{ completedCount }} / {{ todayIndexes.length }}</text></view><view class="progress-track"><view class="progress-fill" :style="{width: progressPercent + '%'}"></view></view><view class="today-preview"><text v-for="index in todayIndexes" :key="index" class="today-chip" :class="{'today-chip-done':isTodayWordDone(index)}">{{ words[index].word }}<text v-if="isTodayWordDone(index)"> ✓</text></text></view><button class="primary-button" @tap="openTodayWord">{{ completedCount === todayIndexes.length ? '再学一遍今日单词' : completedCount ? '继续今日学习' : '开始今日学习' }}</button><text class="today-spell-link" @tap="beginTodaySpelling">直接拼写　›</text></view><view class="card favorite-entry" @tap="openFavorites"><text class="shortcut-symbol shortcut-star">★</text><view class="favorite-entry-copy"><text class="shortcut-title">我的收藏</text><text class="shortcut-meta">已收藏 {{ favorites.length }} 个单词</text></view><text class="shortcut-arrow">›</text></view><view class="section-head"><text class="section-title">最近学习</text></view><view v-if="recentWords.length" class="word-list"><view v-for="item in recentWords" :key="item.key" class="card word-row" @tap="openWord(item.index,true)"><view><text class="word-main">{{ words[item.index].word }}</text><text class="word-sub">{{ words[item.index].pos }}　{{ words[item.index].meaning }}</text></view><text class="chevron">›</text></view></view><view v-else class="card word-empty"><text class="card-title">暂无单词记录</text><text class="inline-link" @tap="openTodayWord">开始今日学习　›</text></view></view>
  </StudyLayout>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import StudyLayout from '../../components/StudyLayout.vue'
import { words } from '../index/learning-data.js'
import { dailyWordIndexes, localDayKey } from '../../config/daily-words.js'
import { loadDailyWordProgress, loadFavoriteWords, loadRecentItems, loadWordCompletion } from '../../services/study-records.js'

const todayKey = ref(localDayKey())
const dailyProgress = ref(loadDailyWordProgress(todayKey.value))
const favoriteIds = ref(loadFavoriteWords())
const recentItems = ref(loadRecentItems())
const wordCompletion = ref(loadWordCompletion())
const todayIndexes = computed(() => dailyWordIndexes(todayKey.value,words.length))
const todayDateLabel = computed(() => { const [,month,day] = todayKey.value.split('-'); return `${Number(month)}月${Number(day)}日` })
const completedCount = computed(() => todayIndexes.value.filter(index => dailyProgress.value[words[index].word]).length)
const progressPercent = computed(() => todayIndexes.value.length ? completedCount.value / todayIndexes.value.length * 100 : 0)
const favorites = computed(() => words.filter(word => favoriteIds.value.includes(word.word)))
const recentWords = computed(() => recentItems.value.filter(item => item.type === 'word' && words[item.index] && wordCompletion.value[words[item.index].word]).slice(0,5))
let refreshTimer
function refresh() { todayKey.value = localDayKey(); dailyProgress.value = loadDailyWordProgress(todayKey.value); favoriteIds.value = loadFavoriteWords(); recentItems.value = loadRecentItems(); wordCompletion.value = loadWordCompletion() }
onShow(refresh)
onMounted(() => { refreshTimer = setInterval(refresh,60000) })
onUnmounted(() => clearInterval(refreshTimer))
function isTodayWordDone(index) { return Boolean(dailyProgress.value[words[index].word]) }
function openWord(index,readOnly = false) { uni.navigateTo({url:'/pages/vocab/detail?item=' + index + (readOnly ? '&readonly=1' : '&study=daily&day=' + todayKey.value)}) }
function openTodayWord() { const index = todayIndexes.value.find(index => !isTodayWordDone(index)) ?? todayIndexes.value[0]; if (index !== undefined) openWord(index) }
function beginTodaySpelling() { const index = todayIndexes.value[0]; if (index !== undefined) uni.navigateTo({url:'/pages/vocab/spell?from=today&study=daily&day=' + todayKey.value + '&item=' + index}) }
function openFavorites() { uni.navigateTo({url:'/pages/vocab/list'}) }
</script>
