<template><view class="route-host" v-if="ready"><StudyShell initial-view="worddetail" :initial-index="item" :word-read-only="readOnly" :initial-daily-study="dailyStudy" :initial-study-date="studyDate" :initial-source="source" :source-article-index="articleIndex" :initial-series-index="seriesIndex" :initial-chapter="chapterIndex" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const item = ref(0)
const readOnly = ref(false)
const dailyStudy = ref(false)
const studyDate = ref('')
const source = ref('article')
const articleIndex = ref(-1)
const seriesIndex = ref(-1)
const chapterIndex = ref(0)
onLoad(options => { item.value = Number(options.item || 0); readOnly.value = options.readonly === '1'; dailyStudy.value = options.study === 'daily'; studyDate.value = options.day || ''; source.value = options.source || 'article'; articleIndex.value = options.article === undefined ? -1 : Number(options.article); seriesIndex.value = options.series === undefined ? -1 : Number(options.series); chapterIndex.value = Number(options.chapter || 0); ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
