<template>
  <StudyLayout v-if="ready" title="小说目录" theme-class="external-theme">
    <view class="page external-directory"><view class="series-overview"><view class="directory-cover" :class="series.theme"><view class="directory-sun"></view><view class="directory-wave wave-one"></view><view class="directory-wave wave-two"></view><text class="directory-cover-icon">{{ series.icon }}</text><text class="directory-cover-title">{{ series.title }}</text></view><view class="series-copy"><text class="eyebrow">{{ series.level }} · {{ series.chapters.length }} CHAPTERS</text><text class="series-title">{{ series.translation }}</text><text class="series-original">{{ series.title }}</text><text class="series-description">{{ series.description }}</text></view></view><view class="directory-heading"><text class="directory-heading-mark">目录</text><text class="directory-count">{{ series.chapters.length }} 章</text></view><view class="chapter-list"><view v-for="(chapter,i) in series.chapters" :key="chapter.title" class="chapter-row" @tap="openChapter(i)"><text class="chapter-number">{{ String(i+1).padStart(2,'0') }}</text><view class="chapter-copy"><text class="chapter-title">{{ chapter.title }}</text><text class="chapter-meta">{{ chapter.translations[0] }}</text></view><view class="chapter-arrow">›</view></view></view></view>
  </StudyLayout>
</template>
<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyLayout from '../../components/StudyLayout.vue'
import { externalSeries } from '../index/learning-data.js'
const ready = ref(false)
const seriesIndex = ref(0)
const series = computed(() => externalSeries[seriesIndex.value] || externalSeries[0])
onLoad(options => { const requested = Number(options.item || 0); seriesIndex.value = externalSeries[requested] ? requested : 0; ready.value = true })
function openChapter(index) { uni.navigateTo({url:'/pages/reading/chapter?item=' + seriesIndex.value + '&chapter=' + index}) }
</script>
