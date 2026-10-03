<template>
  <StudyLayout title="精读" :show-back="false" :theme-class="shelf === 'mag' ? 'external-theme' : ''">
    <view class="page reading-page">
      <view class="tabs"><view class="design-tab" :class="{on:shelf === 'easy'}" @tap="shelf='easy'">轻松阅读</view><view class="design-tab" :class="{on:shelf === 'mag'}" @tap="shelf='mag'">外刊</view></view>
      <view v-if="shelf === 'easy'"><view class="filters"><text v-for="option in ['全部','初级','高级']" :key="option" class="filter" :class="{on:filter === option}" @tap="filter=option">{{ option }}</text></view><view class="article-list"><view v-for="article in filteredArticles" :key="article.id" class="article" @tap="openArticle(articles.indexOf(article))"><view class="art" :class="article.theme"><text>{{ article.icon }}</text></view><view class="article-info"><text class="design-article-title">{{ article.translation }}</text><text class="design-article-desc">{{ article.title }}</text><view class="tags"><text class="tag">原创故事</text><text class="tag">{{ article.level }}</text><text class="tag">{{ storyWordCounts[articles.indexOf(article)] }} 词</text></view></view><text class="arr">›</text></view></view></view>
      <view v-else class="shelf external-shelf"><view class="external-intro"><text class="eyebrow">READING COLLECTION</text><text class="external-heading">外刊小说</text></view><view v-for="(series,i) in externalSeries" :key="series.id" class="mag external-book" @tap="openSeries(i)"><view class="mag-cover" :class="series.theme"><view class="cover-sun"></view><view class="cover-hill hill-back"></view><view class="cover-hill hill-front"></view><view class="cover-art">{{ series.icon }}</view><text class="cover-kicker">A SHORT STORY</text><text class="cover-title">{{ series.title }}</text><text class="cover-label">{{ series.level }} · {{ series.chapters.length }} 章</text></view><text class="mag-name">{{ series.translation }}</text><text class="mag-note">{{ series.description }}</text><text class="external-author">{{ series.author }}</text></view></view>
    </view>
  </StudyLayout>
</template>
<script setup>
import { computed, ref } from 'vue'
import StudyLayout from '../../components/StudyLayout.vue'
import { articles, externalSeries } from '../index/learning-data.js'
const shelf = ref('easy')
const filter = ref('全部')
const storyWordCounts = [148, 126]
const filteredArticles = computed(() => filter.value === '全部' ? articles : articles.filter((article,index) => filter.value === '高级' ? index > 0 : index === 0))
function openArticle(index) { uni.navigateTo({url:'/pages/reading/article?item=' + index}) }
function openSeries(index) { uni.navigateTo({url:'/pages/reading/series?item=' + index}) }
</script>
