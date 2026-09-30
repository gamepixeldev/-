<template><view class="route-host" v-if="ready"><StudyShell initial-view="spell" :initial-index="item" :return-view="from" :source-article-index="articleIndex" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const item = ref(0)
const from = ref('wordlist')
const articleIndex = ref(-1)
onLoad(options => { item.value = Number(options.item || 0); from.value = options.from || 'wordlist'; articleIndex.value = options.article === undefined ? -1 : Number(options.article); ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
