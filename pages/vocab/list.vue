<template><view class="route-host" v-if="ready"><StudyShell initial-view="wordlist" :initial-index="articleIndex >= 0 ? articleIndex : 0" :source-article-index="articleIndex" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const articleIndex = ref(-1)
onLoad(options => { articleIndex.value = options.article === undefined ? -1 : Number(options.article); ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
