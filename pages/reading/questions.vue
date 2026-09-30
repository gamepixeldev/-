<template><view class="route-host" v-if="ready"><StudyShell initial-view="questions" :initial-index="item" /></view></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyShell from '../../components/StudyShell.vue'
const ready = ref(false)
const item = ref(0)
onLoad(options => { item.value = Number(options.item || 0); ready.value = true })
</script>
<style>.route-host{height:100vh}</style>
