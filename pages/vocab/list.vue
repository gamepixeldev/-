<template><view class="route-host" v-if="ready"><StudyShell initial-view="wordlist" :initial-index="source === 'external' ? seriesIndex : articleIndex >= 0 ? articleIndex : 0" :initial-chapter="chapterIndex" :initial-source="source" :source-article-index="articleIndex" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const articleIndex = ref(-1)
const source = ref('article')
const seriesIndex = ref(0)
const chapterIndex = ref(0)
onLoad(options => { articleIndex.value = options.article === undefined ? -1 : Number(options.article); source.value = options.source || 'article'; seriesIndex.value = Number(options.series || 0); chapterIndex.value = Number(options.chapter || 0); ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
