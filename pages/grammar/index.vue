<template>
  <StudyLayout title="语法学习" :show-back="false" show-tabs active-tab="grammar">
    <view class="page grammar-page">
      <view class="hero-home grammar-home-hero"><view class="eyebrow">GRAMMAR NOTES</view><text class="grammar-hero-title">理解规则，<br/>再把句子说清楚。</text><view class="hero-book grammar-book">文</view></view>
      <view class="filters grammar-filters"><text v-for="filter in ['全部','基础','时态','句型']" :key="filter" class="filter" :class="{on: selectedFilter === filter}" @tap="selectedFilter=filter">{{ filter }}</text></view>
      <view class="grammarlist"><view v-for="item in visibleGrammar" :key="item.title" class="gramrow" @tap="openGrammar(item.sourceIndex)"><view class="gramicon">{{ ['时','让','时','句'][item.sourceIndex % 4] }}</view><view class="gramrow-copy"><text class="gramrow-title">{{ item.title }}</text><text class="gramrow-sub">{{ item.level }}　·　讲解与练习</text></view><text class="arr">›</text></view></view>
    </view>
  </StudyLayout>
</template>
<script setup>
import { computed, ref } from 'vue'
import StudyLayout from '../../components/StudyLayout.vue'
import { grammar } from '../index/learning-data.js'
import { loadRecentItems, saveRecentItem } from '../../services/study-records.js'

const selectedFilter = ref('全部')
const visibleGrammar = computed(() => grammar.map((item,index) => ({...item,sourceIndex:index})).filter(item => selectedFilter.value === '全部' || (selectedFilter.value === '基础' ? item.level.includes('基础') : selectedFilter.value === '时态' ? item.title.includes('时') || item.title.includes('过去') : item.title.includes('从句'))))
function openGrammar(index) {
  const item = grammar[index]
  saveRecentItem(loadRecentItems(), 'grammar', index, item.title, item.level + ' · 语法专题')
  uni.navigateTo({url:'/pages/grammar/detail?item=' + index})
}
</script>
