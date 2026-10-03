<template><view class="route-host" v-if="ready"><StudyShell initial-view="worddetail" :initial-index="item" :word-read-only="readOnly" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const item = ref(0)
const readOnly = ref(false)
onLoad(options => { item.value = Number(options.item || 0); readOnly.value = options.readonly === '1'; ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
