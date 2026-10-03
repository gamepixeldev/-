<template><view class="route-host" v-if="ready"><StudyShell initial-view="spell" :initial-index="item" :initial-source="source" :initial-series-index="seriesIndex" :initial-chapter="chapterIndex" :return-view="from" :source-article-index="articleIndex" :initial-daily-study="dailyStudy" :initial-study-date="studyDate" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const item = ref(0)
const from = ref('wordlist')
const articleIndex = ref(-1)
const seriesIndex = ref(-1)
const source = ref('article')
const chapterIndex = ref(0)
const dailyStudy = ref(false)
const studyDate = ref('')
onLoad(options => { from.value = options.from || 'wordlist'; item.value = Number(['worddetail','today'].includes(from.value) ? options.item || 0 : options.series || options.item || 0); articleIndex.value = options.article === undefined ? -1 : Number(options.article); seriesIndex.value = options.series === undefined ? -1 : Number(options.series); source.value = options.source || 'article'; chapterIndex.value = Number(options.chapter || 0); dailyStudy.value = options.study === 'daily'; studyDate.value = options.day || ''; ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
