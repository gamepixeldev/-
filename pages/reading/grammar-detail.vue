<template><ReadingGrammarPage v-if="ready" :source="source" :item="item" :chapter="chapterIndex" /></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ReadingGrammarPage from '../../components/ReadingGrammarPage.vue'
defineOptions({ inheritAttrs: false })
const ready = ref(false)
const item = ref(0)
const chapterIndex = ref(0)
const source = ref('article')
onLoad(options => { item.value = Number(options.series || options.item || 0); chapterIndex.value = Number(options.chapter || 0); source.value = options.source || 'article'; ready.value = true })
</script>
