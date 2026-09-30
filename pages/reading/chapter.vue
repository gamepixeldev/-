<template><view class="route-host" v-if="ready"><StudyShell initial-view="externalchapter" :initial-index="seriesIndex" :initial-chapter="chapterIndex" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const seriesIndex = ref(0)
const chapterIndex = ref(0)
onLoad(options => { seriesIndex.value = Math.max(0, Number(options.item || 0)); chapterIndex.value = Math.max(0, Number(options.chapter || 0)); ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
