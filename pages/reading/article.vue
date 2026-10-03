<template><ReadingArticlePage v-if="ready" :item="item" /></template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ReadingArticlePage from '../../components/ReadingArticlePage.vue'
const ready = ref(false)
const item = ref(0)
onLoad(options => { item.value = Number(options.item || 0); ready.value = true })
</script>
