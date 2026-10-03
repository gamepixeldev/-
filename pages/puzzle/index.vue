<template>
  <StudyLayout title="拼句练习" :show-back="false" :scroll-top="scrollTop" @load-more="loadMore">
    <template #action><text @tap="showGuide">ⓘ</text></template>
      <view class="page puzzle-page">
        <view class="hero-home puzzle-home-hero"><view class="eyebrow">SENTENCE PUZZLE</view><text class="puzzle-hero-title">读懂中文，<br/>重新排好英文。</text><view class="hero-book puzzle-book">拼</view></view>
        <view v-if="resumablePuzzle" class="puzzle-resume-card" @tap="startPuzzle(resumablePuzzle.setIndex)"><view class="puzzle-resume-top"><text>继续上次练习</text><text>{{ resumablePuzzle.cursor }} / {{ resumablePuzzle.items.length }} 句</text></view><text class="puzzle-resume-title">{{ resumablePuzzle.title }}</text><view class="puzzle-resume-bottom"><view class="puzzle-resume-track"><view :style="{width: resumablePuzzle.cursor / resumablePuzzle.items.length * 100 + '%'}"></view></view><text>继续　›</text></view></view>
        <view class="section-head puzzle-list-head"><text class="section-title">拼句练习</text><text class="section-note">{{ visiblePuzzleSets.length }} 篇</text></view>
        <view class="puzzle-filters"><text v-for="filter in puzzleFilters" :key="filter.id" class="puzzle-filter" :class="{on:puzzleFilter === filter.id}" @tap="selectFilter(filter.id)">{{ filter.label }}</text></view>
        <view v-for="set in pagedPuzzleSets" :key="set.id" class="card puzzle-source-card"><view class="puzzle-source" @tap="startPuzzle(set.setIndex)"><view class="thumb puzzle-thumb">{{ set.icon }}</view><view class="puzzle-source-copy"><text class="card-title">{{ set.title }}</text><text class="card-sub">{{ set.sourceArticleId ? sourceLabel(set) : set.subtitle }}　·　{{ set.items.length }} 句</text><text v-if="progressFor(set).cursor || progressFor(set).completed" class="puzzle-set-status">{{ progressFor(set).completed ? '已完成' : '已完成 ' + progressFor(set).cursor + ' / ' + set.items.length + ' 句' }}</text></view><text class="arr">›</text></view><view v-if="progressFor(set).cursor || progressFor(set).completed" class="puzzle-card-bottom"><view class="puzzle-card-track"><view :style="{width: (progressFor(set).completed ? 100 : progressFor(set).cursor / set.items.length * 100) + '%'}"></view></view><text class="puzzle-set-restart" @tap.stop="startPuzzle(set.setIndex,true)">从头开始</text></view></view>
        <view v-if="pagedPuzzleSets.length < visiblePuzzleSets.length" class="puzzle-load-state">下滑加载更多</view>
      </view>
  </StudyLayout>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { articles, puzzleSets } from '../index/learning-data.js'
import { loadPuzzleProgress, loadRecentItems } from '../../services/study-records.js'
import { startPuzzleSession } from '../../features/puzzle/puzzle-session.js'
import StudyLayout from '../../components/StudyLayout.vue'

const puzzleFilters = [{id:'all',label:'全部'},{id:'independent',label:'独立练习'},{id:'article',label:'精读配套'}]
const puzzleFilter = ref('all')
const pageSize = ref(6)
const scrollTop = ref(0)
const progress = ref(loadPuzzleProgress())
const recentItems = ref(loadRecentItems())
const visiblePuzzleSets = computed(() => puzzleSets.map((set,setIndex) => ({...set,setIndex})).filter(set => puzzleFilter.value === 'all' || (puzzleFilter.value === 'article' ? Boolean(set.sourceArticleId) : !set.sourceArticleId)).sort((a,b) => Number(Boolean(b.sourceArticleId)) - Number(Boolean(a.sourceArticleId))))
const pagedPuzzleSets = computed(() => visiblePuzzleSets.value.slice(0,pageSize.value))
const resumablePuzzle = computed(() => puzzleSets.map((set,setIndex) => ({...set,setIndex,...progressFor(set)})).filter(set => set.cursor > 0 && set.cursor < set.items.length && !set.completed).sort((a,b) => b.updatedAt - a.updatedAt)[0] || null)

onShow(() => { progress.value = loadPuzzleProgress(); recentItems.value = loadRecentItems() })
function progressFor(set) {
  const saved = progress.value[set.id] || {}
  const recentTime = recentItems.value.find(item => item.type === 'puzzle' && puzzleSets[item.index]?.id === set.id)?.time || 0
  return {cursor:Math.min(saved.cursor || 0,set.items.length),completed:Boolean(saved.completed),updatedAt:saved.updatedAt || recentTime}
}
function sourceLabel(set) {
  const source = articles.find(article => article.id === set.sourceArticleId)
  return source ? '来自《' + source.translation + '》' : '独立练习'
}
function selectFilter(filter) { puzzleFilter.value = filter; pageSize.value = 6; scrollTop.value = 1; nextTick(() => { scrollTop.value = 0 }) }
function loadMore() { if (pageSize.value < visiblePuzzleSets.value.length) pageSize.value += 6 }
function startPuzzle(index, fromStart = false) {
  const records = startPuzzleSession(index, fromStart)
  if (records) { progress.value = records.progress; recentItems.value = records.recent }
}
function showGuide() { uni.showModal({title:'拼句练习',content:'根据中文意思，点选词块组成英文句子。每完成一句会自动保存进度；想重新练习，可在练习列表点击「从头开始」。',showCancel:false,confirmText:'知道了'}) }
</script>
