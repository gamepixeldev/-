<template>
  <StudyLayout title="本文语法解析" :theme-class="context.isExternal ? 'external-theme' : ''">
    <view class="page"><view class="grammar-hero"><text class="eyebrow">ARTICLE GRAMMAR</text><text class="large-title">{{ context.isExternal ? context.article.title : context.article.translation }} · 语法解析</text><text class="muted">{{ context.isExternal ? context.series.translation + ' · 第 ' + (context.chapterIndex + 1) + ' 章' : context.article.title }}</text></view><rich-text class="rich-content card" :nodes="content.html" /></view>
  </StudyLayout>
</template>

<script setup>
import { computed } from 'vue'
import StudyLayout from './StudyLayout.vue'
import { getArticleGrammarContentSource } from '../pages/index/learning-data.js'
import { resolveReadingContext } from '../features/reading/reading-context.js'
const props = defineProps({source:{type:String,default:'article'},item:{type:Number,default:0},chapter:{type:Number,default:0}})
const context = computed(() => resolveReadingContext(props.source,props.item,props.chapter))
const content = computed(() => getArticleGrammarContentSource(context.value.article,context.value.chapter?.grammarNotes || []))
</script>
