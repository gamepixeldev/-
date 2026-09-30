<template><view class="route-host" v-if="ready"><StudyShell initial-view="articlegramlist" :initial-index="articleIndex" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const articleIndex = ref(0)
onLoad(options => { articleIndex.value = Number(options.item || 0); ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
