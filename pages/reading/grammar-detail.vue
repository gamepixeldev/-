<template><view class="route-host" v-if="ready"><StudyShell initial-view="articlegramdetail" :initial-index="item" :initial-chapter="chapterIndex" :initial-source="source" :initial-note="noteIndex" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const item = ref(0)
const chapterIndex = ref(0)
const source = ref('article')
const noteIndex = ref(0)
onLoad(options => { item.value = Number(options.series || options.item || 0); chapterIndex.value = Number(options.chapter || 0); source.value = options.source || 'article'; noteIndex.value = Number(options.note || 0); ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
