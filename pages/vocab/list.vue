<template>
  <StudyLayout v-if="ready" :title="scope.isScoped ? '本文重点词汇' : '我的收藏'">
    <view class="page"><view class="intro-block"><text class="eyebrow">{{ scope.isScoped ? 'ARTICLE WORDS' : 'SAVED WORDS' }}</text><text class="large-title">{{ scope.isScoped ? articleTitle + ' · 重点词汇' : '我的收藏' }}</text></view><view v-if="visibleWords.length" class="word-list"><view v-for="word in visibleWords" :key="word.word" class="card word-row" @tap="openWord(words.indexOf(word))"><view><text class="word-main">{{ word.word }}</text><text class="word-sub">{{ word.pos }}　{{ word.meaning }}</text></view><text v-if="wordCompletion[word.word]" class="row-learned">已学完</text><text v-if="favoriteIds.includes(word.word)" class="row-favorite">★</text><text class="chevron">›</text></view></view><view v-else class="card word-empty"><text class="card-title">暂无收藏</text><text class="inline-link" @tap="back">返回今日单词　›</text></view></view>
  </StudyLayout>
</template>
<script setup>
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import StudyLayout from '../../components/StudyLayout.vue'
import { articles, externalSeries, words } from '../index/learning-data.js'
import { scopedWords } from '../../features/vocab/word-scope.js'
import { loadFavoriteWords, loadWordCompletion } from '../../services/study-records.js'
const ready = ref(false)
const articleIndex = ref(-1)
const source = ref('article')
const seriesIndex = ref(0)
const chapterIndex = ref(0)
onLoad(options => { articleIndex.value = options.article === undefined ? -1 : Number(options.article); source.value = options.source || 'article'; seriesIndex.value = Number(options.series || 0); chapterIndex.value = Number(options.chapter || 0); ready.value = true })
const scope = computed(() => scopedWords(source.value,articleIndex.value,seriesIndex.value,chapterIndex.value))
const favoriteIds = ref(loadFavoriteWords())
const wordCompletion = ref(loadWordCompletion())
const visibleWords = computed(() => scope.value.isScoped ? scope.value.words : words.filter(word => favoriteIds.value.includes(word.word)))
const articleTitle = computed(() => source.value === 'external' ? (externalSeries[seriesIndex.value] || externalSeries[0]).translation : (articles[articleIndex.value] || articles[0]).translation)
onShow(() => { favoriteIds.value = loadFavoriteWords(); wordCompletion.value = loadWordCompletion() })
function openWord(index) {
  const query = scope.value.isScoped ? source.value === 'external' ? '&source=external&series=' + seriesIndex.value + '&chapter=' + chapterIndex.value : '&article=' + articleIndex.value : '&readonly=1'
  uni.navigateTo({url:'/pages/vocab/detail?item=' + index + query})
}
function back() { uni.navigateBack({fail:() => uni.switchTab({url:'/pages/vocab/index'})}) }
</script>
