<template><view class="route-host" v-if="ready"><StudyShell initial-view="spell" :initial-index="item" :initial-source="source" :initial-chapter="chapterIndex" :return-view="from" :source-article-index="articleIndex" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const item = ref(0)
const from = ref('wordlist')
const articleIndex = ref(-1)
const source = ref('article')
const chapterIndex = ref(0)
onLoad(options => { item.value = Number(options.series || options.item || 0); from.value = options.from || 'wordlist'; articleIndex.value = options.article === undefined ? -1 : Number(options.article); source.value = options.source || 'article'; chapterIndex.value = Number(options.chapter || 0); ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
