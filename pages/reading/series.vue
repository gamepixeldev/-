<template><view class="route-host" v-if="ready"><StudyShell initial-view="externalchapters" :initial-index="seriesIndex" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const seriesIndex = ref(0)
onLoad(options => { seriesIndex.value = Math.max(0, Number(options.item || 0)); ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
