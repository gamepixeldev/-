<template>
  <StudyLayout title="文章精读" :theme-class="isExternal ? 'external-theme' : ''" :toast="toastMessage">
    <view class="page article-page">
      <view v-if="isExternal" class="article-source-kicker">{{ series.translation }}　·　第 {{ chapterIndex + 1 }} 章</view>
      <view class="article-heading"><text class="eyebrow">{{ article.level }}　·　{{ article.minutes }} MIN READ</text><text class="large-title">{{ article.title }}</text><text class="article-translation">{{ article.translation }}</text></view>
      <view class="story-banner" :class="article.theme"><text class="story-emoji">{{ article.icon }}</text><text class="story-banner-title">{{ article.title }}</text></view>
      <view class="reading-text"><view v-for="(paragraph,p) in article.paragraphs" :key="p" class="paragraph"><text v-for="(sentence,s) in paragraph" :key="s" class="sentence">{{ formatEnglish(sentence) }}{{ s < paragraph.length - 1 ? '\u00a0' : '' }}</text><text class="translation-line">{{ article.translations[p] }}</text></view></view>
      <view class="section-head"><text class="section-title">本文配套学习</text></view>
      <view class="learning-links"><view class="learning-link" @tap="openWords"><view class="mini-icon gold">Aa</view><view><text class="card-title">本文重点词汇</text><text class="card-sub">{{ article.words.length }} 个词条</text></view><text class="chevron">›</text></view><view class="learning-link" @tap="openGrammar"><view class="mini-icon lilac">文</view><view><text class="card-title">本文语法解析</text></view><text class="chevron">›</text></view><view class="learning-link" @tap="openQuestions"><view class="mini-icon blue">✓</view><view><text class="card-title">阅读理解</text><text class="card-sub">{{ article.questions.length }} 道题</text></view><text class="chevron">›</text></view></view>
      <view class="reading-completion"><button class="primary-button" :class="{'reading-done':readingCompleted}" @tap="completeReading">{{ readingCompleted ? '✓ 已完成阅读' : '阅读完成' }}</button></view><view class="bottom-spacer"></view>
    </view>
  </StudyLayout>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import StudyLayout from './StudyLayout.vue'
import { resolveReadingContext } from '../features/reading/reading-context.js'
import { loadReadingCompletion, loadRecentItems, saveReadingCompletion, saveRecentItem } from '../services/study-records.js'

const props = defineProps({source:{type:String,default:'article'},item:{type:Number,default:0},chapter:{type:Number,default:0}})
const context = computed(() => resolveReadingContext(props.source, props.item, props.chapter))
const isExternal = computed(() => context.value.isExternal)
const seriesIndex = computed(() => context.value.seriesIndex)
const series = computed(() => context.value.series)
const chapterIndex = computed(() => context.value.chapterIndex)
const articleIndex = computed(() => context.value.articleIndex)
const article = computed(() => context.value.article)
const completion = ref(loadReadingCompletion())
const completionKey = computed(() => isExternal.value ? 'external:' + series.value.id + ':' + chapterIndex.value : 'article:' + article.value.id)
const readingCompleted = computed(() => Boolean(completion.value[completionKey.value]))
const toastMessage = ref('')
let toastTimer
onUnmounted(() => clearTimeout(toastTimer))
function formatEnglish(text) { return text.replace(/([’'])(?=[a-z])/gi, '$1\u2060') }
function contextQuery() { return isExternal.value ? '?item=' + seriesIndex.value + '&source=external&series=' + seriesIndex.value + '&chapter=' + chapterIndex.value : '?item=' + articleIndex.value }
function openWords() { uni.navigateTo({url:isExternal.value ? '/pages/vocab/list?source=external&series=' + seriesIndex.value + '&chapter=' + chapterIndex.value : '/pages/vocab/list?article=' + articleIndex.value}) }
function openGrammar() { uni.navigateTo({url:'/pages/reading/grammar' + contextQuery()}) }
function openQuestions() { uni.navigateTo({url:'/pages/reading/questions' + contextQuery()}) }
function completeReading() {
  if (readingCompleted.value) return
  completion.value = saveReadingCompletion(completion.value, completionKey.value)
  if (isExternal.value) saveRecentItem(loadRecentItems(), 'externalArticle', chapterIndex.value, article.value.title, series.value.translation + ' · 外刊阅读', {seriesIndex:seriesIndex.value,chapterIndex:chapterIndex.value})
  else saveRecentItem(loadRecentItems(), 'article', articleIndex.value, article.value.title, article.value.translation + ' · 精读文章')
  toastMessage.value = '阅读完成，已加入最近学习'
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMessage.value = '' }, 1800)
}
</script>
