<template>
  <StudyLayout title="最近学习" :scroll-top="scrollTop" @load-more="loadMore">
    <view class="page recent-page"><view class="intro-block"><text class="eyebrow">YOUR LEARNING</text><text class="large-title">最近学习</text></view><view class="recent-category-tabs"><view v-for="category in categories" :key="category.id" class="recent-category" :class="{active:selectedCategory===category.id}" @tap="selectCategory(category.id)"><text>{{ category.label }}</text><text class="recent-count">{{ category.items.length }}</text></view></view><view v-if="visibleItems.length" class="recent-section"><view v-for="item in pagedItems" :key="item.key" class="card recent-entry" @tap="openRecentItem(item)"><view class="mini-icon" :class="recentTone(item.type)">{{ recentIcon(item.type) }}</view><view class="recent-copy"><text class="card-title">{{ item.title }}</text><text class="card-sub">{{ subtitle(item) }}</text><view v-if="item.type==='puzzle'" class="puzzle-progress-track"><view class="puzzle-progress-fill" :style="{width:progressPercent(item)+'%'}"></view></view></view><text v-if="item.type!=='puzzle'" class="chevron">›</text><view v-else class="puzzle-recent-actions"><text class="resume-puzzle" @tap.stop="openRecentItem(item)">{{ item.puzzleCompleted ? '再练一次' : '继续' }}</text><text class="restart-puzzle" @tap.stop="restartPuzzle(item.index)">从头开始</text></view></view><text class="clear-history" @tap="clearRecent">清空最近学习记录</text></view><view v-else class="recent-empty"><view class="empty-illustration"><view class="empty-book">▤</view><view class="empty-spark spark-one">✦</view><view class="empty-spark spark-two">✧</view><view class="empty-orbit"></view></view><text class="empty-title">{{ emptyTitle }}</text><button class="empty-action" @tap="browseCategory">去{{ categoryLabel }}看看 <text>›</text></button></view></view>
  </StudyLayout>
</template>
<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import StudyLayout from '../../components/StudyLayout.vue'
import { words, puzzleSets } from '../index/learning-data.js'
import { loadRecentItems, loadWordCompletion } from '../../services/study-records.js'
import { openRecentItem, recentIcon, recentTone } from '../../features/recent/recent-navigation.js'
import { startPuzzleSession } from '../../features/puzzle/puzzle-session.js'

const recentItems = ref(loadRecentItems())
const wordCompletion = ref(loadWordCompletion())
const selectedCategory = ref('reading')
const pageSize = ref(10)
const scrollTop = ref(0)
const categories = computed(() => [
  {id:'reading',label:'精读',items:recentItems.value.filter(item => ['article','externalArticle'].includes(item.type))},
  {id:'grammar',label:'语法',items:recentItems.value.filter(item => item.type === 'grammar')},
  {id:'word',label:'单词',items:recentItems.value.filter(item => item.type === 'word' && wordCompletion.value[words[item.index]?.word])},
  {id:'puzzle',label:'拼句',items:recentItems.value.filter(item => item.type === 'puzzle')}
])
const visibleItems = computed(() => categories.value.find(category => category.id === selectedCategory.value)?.items || [])
const pagedItems = computed(() => visibleItems.value.slice(0,pageSize.value))
const categoryLabel = computed(() => categories.value.find(category => category.id === selectedCategory.value)?.label || '学习')
const emptyTitle = computed(() => ({reading:'还没有精读记录',grammar:'还没有语法学习记录',word:'还没有单词学习记录',puzzle:'还没有拼句进度'})[selectedCategory.value])

onShow(() => { recentItems.value = loadRecentItems(); wordCompletion.value = loadWordCompletion() })
function selectCategory(category) { selectedCategory.value = category; pageSize.value = 10; scrollTop.value = 1; setTimeout(() => { scrollTop.value = 0 }, 0) }
function loadMore() { if (pageSize.value < visibleItems.value.length) pageSize.value += 10 }
function subtitle(item) {
  if (item.type === 'word') return (wordCompletion.value[words[item.index]?.word] ? '已学完 · ' : '最近浏览 · ') + item.subtitle
  if (item.type !== 'puzzle') return item.subtitle
  const total = item.puzzleTotal || (puzzleSets[item.index]?.items.length || 0)
  return item.puzzleCompleted ? '已完成 · ' + total + ' 句' : '已完成 ' + (item.puzzleCursor || 0) + ' / ' + total + ' 句'
}
function progressPercent(item) { const total = item.puzzleTotal || (puzzleSets[item.index]?.items.length || 1); return Math.max(0,Math.min(100,item.puzzleCompleted ? 100 : (item.puzzleCursor || 0) / total * 100)) }
function restartPuzzle(index) { startPuzzleSession(index,true) }
function clearRecent() { recentItems.value = []; try { uni.removeStorageSync('readEnglishRecent'); uni.$emit('readEnglishRecentUpdate') } catch (_) {} }
function browseCategory() { const route = ({reading:'/pages/reading/index',grammar:'/pages/grammar/index',word:'/pages/vocab/index',puzzle:'/pages/puzzle/index'})[selectedCategory.value]; uni.navigateTo({url:route}) }
</script>
