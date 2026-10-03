<template><ReadingArticlePage v-if="ready" source="external" :item="seriesIndex" :chapter="chapterIndex" /></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ReadingArticlePage from '../../components/ReadingArticlePage.vue'
const ready = ref(false)
const seriesIndex = ref(0)
const chapterIndex = ref(0)
onLoad(options => { seriesIndex.value = Math.max(0, Number(options.item || 0)); chapterIndex.value = Math.max(0, Number(options.chapter || 0)); ready.value = true })
</script>
