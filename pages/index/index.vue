<template>
  <StudyLayout title="读句 English" :show-back="false">
    <template #action><text @tap="go('/pages/recent/index')">最近</text></template>
    <view class="page home-page"><view class="hero"><view class="hero-copy"><text class="eyebrow">READ · LEARN · GROW</text><text class="hero-title">把英语，读进生活里</text><text class="hero-sub">从一个故事开始，慢慢读懂英文。</text></view><view class="book-art"><text>读</text><text class="book-mark">READ</text></view><view class="hero-orb"></view></view>
      <view class="section-head"><text class="section-title">学习模块</text></view><view class="module-grid"><view class="module-card module-blue" @tap="go('/pages/reading/index')"><text class="module-icon">▤</text><text class="module-name">精读</text><text class="module-desc">故事 · 词汇 · 阅读理解</text><text class="module-arrow">›</text></view><view class="module-card module-gold" @tap="go('/pages/vocab/index')"><text class="module-icon">Aa</text><text class="module-name">单词详解</text><text class="module-desc">释义 · 例句 · 拼写</text><text class="module-arrow">›</text></view><view class="module-card module-green" @tap="go('/pages/grammar/index')"><text class="module-icon">文</text><text class="module-name">语法学习</text><text class="module-desc">知识讲解 · 随堂练习</text><text class="module-arrow">›</text></view><view class="module-card module-purple" @tap="go('/pages/puzzle/index')"><text class="module-icon">拼</text><text class="module-name">拼句</text><text class="module-desc">理解语意 · 排列句子</text><text class="module-arrow">›</text></view></view>
      <view class="section-head"><text class="section-title">今天读点什么</text><text class="inline-link" @tap="go('/pages/reading/index')">全部文章　›</text></view><view class="card recent-card" @tap="go('/pages/reading/article?item=0')"><view class="art-thumb art-blue"><text>{{ articles[0].icon }}</text></view><view class="recent-copy"><text class="card-title">{{ articles[0].title }}</text><text class="card-sub">{{ articles[0].translation }} · 原创短篇</text><view class="tag-row"><text class="tag">{{ articles[0].level }}</text><text class="tag">约 {{ articles[0].minutes }} 分钟</text></view></view><text class="chevron">›</text></view>
      <view class="section-head"><text class="section-title">最近学习</text><text class="inline-link" @tap="go('/pages/recent/index')">查看全部　›</text></view><view v-if="homeRecentItems.length" v-for="item in homeRecentItems.slice(0,3)" :key="item.key" class="card recent-line" @tap="openRecentItem(item)"><view class="mini-icon" :class="recentTone(item.type)">{{ recentIcon(item.type) }}</view><view class="recent-copy"><text class="card-title">{{ item.title }}</text><text class="card-sub">{{ item.subtitle }}</text></view><text class="chevron">›</text></view><view v-else class="card recent-empty"><text class="card-title">暂无学习记录</text></view>
    </view>
  </StudyLayout>
</template>
<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import StudyLayout from '../../components/StudyLayout.vue'
import { articles, words } from './learning-data.js'
import { loadRecentItems, loadWordCompletion } from '../../services/study-records.js'
import { openRecentItem, recentIcon, recentTone } from '../../features/recent/recent-navigation.js'

const recentItems = ref(loadRecentItems())
const wordCompletion = ref(loadWordCompletion())
const homeRecentItems = computed(() => recentItems.value.filter(item => item.type !== 'word' || wordCompletion.value[words[item.index]?.word]))
onShow(() => { recentItems.value = loadRecentItems(); wordCompletion.value = loadWordCompletion() })
const tabPaths = new Set(['/pages/reading/index','/pages/grammar/index','/pages/vocab/index','/pages/puzzle/index'])
function go(url) { if (tabPaths.has(url)) uni.switchTab({url}); else uni.navigateTo({url}) }
</script>
