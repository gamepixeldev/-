<template><view class="route-host" v-if="ready"><StudyShell initial-view="worddetail" :initial-index="item" :word-read-only="readOnly" :initial-daily-study="dailyStudy" :initial-study-date="studyDate" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const item = ref(0)
const readOnly = ref(false)
const dailyStudy = ref(false)
const studyDate = ref('')
onLoad(options => { item.value = Number(options.item || 0); readOnly.value = options.readonly === '1'; dailyStudy.value = options.study === 'daily'; studyDate.value = options.day || ''; ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
