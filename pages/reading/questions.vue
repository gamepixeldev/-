<template><view class="route-host" v-if="ready"><StudyShell initial-view="questions" :initial-index="item" :initial-chapter="chapterIndex" :initial-source="source" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const item = ref(0)
const chapterIndex = ref(0)
const source = ref('article')
onLoad(options => { item.value = Number(options.series || options.item || 0); chapterIndex.value = Number(options.chapter || 0); source.value = options.source || 'article'; ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
