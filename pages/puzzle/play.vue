<template><view class="route-host" v-if="ready"><StudyShell initial-view="puzzleplay" :initial-index="item" :initial-puzzle-index="sentenceIndex" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const item = ref(0)
const sentenceIndex = ref(0)
onLoad(options => { item.value = Number(options.item || 0); sentenceIndex.value = Number(options.sentence || 0); ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
