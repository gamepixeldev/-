<template>
  <StudyLayout v-if="ready" title="语法详解">
    <view class="page"><view class="grammar-hero"><text class="eyebrow">GRAMMAR NOTE</text><text class="large-title">{{ currentGrammar.title }}</text><text class="muted">{{ currentGrammar.summary }}</text></view><view v-if="content.type === 'officialAccount'" class="card source-card"><text class="detail-label">公众号文章</text><text class="card-title">{{ content.title || '查看关联的公众号文章' }}</text><text class="card-sub">{{ content.summary || '语法详解内容来自关联的公众号文章。' }}</text><button class="source-button" @tap="openOfficialSource">阅读公众号原文</button></view><rich-text v-else class="rich-content card" :nodes="content.html" /><view class="bottom-action"><button class="primary-button" @tap="startQuiz">做几道练习</button></view></view>
  </StudyLayout>
</template>
<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudyLayout from '../../components/StudyLayout.vue'
import { grammar, getGrammarContentSource } from '../index/learning-data.js'
import { openOfficialArticle } from '../../utils/open-official-article.js'
defineOptions({ inheritAttrs: false })
const ready = ref(false)
const item = ref(0)
const currentGrammar = computed(() => grammar[item.value] || grammar[0])
const content = computed(() => getGrammarContentSource(currentGrammar.value))
onLoad(options => { const requested = Number(options.item || 0); item.value = grammar[requested] ? requested : 0; ready.value = true })
function startQuiz() { uni.navigateTo({url:'/pages/grammar/quiz?item=' + item.value}) }
function openOfficialSource() { openOfficialArticle(content.value) }
</script>
