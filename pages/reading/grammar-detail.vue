<template><view class="route-host" v-if="ready"><StudyShell initial-view="articlegramdetail" :initial-index="articleIndex" :initial-note="noteIndex" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const articleIndex = ref(0)
const noteIndex = ref(0)
onLoad(options => { articleIndex.value = Number(options.item || 0); noteIndex.value = Number(options.note || 0); ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
