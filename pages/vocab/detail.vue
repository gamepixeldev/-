<template>
  <StudyLayout v-if="ready" title="单词详解" :scroll-top="scrollTop">
    <view class="page word-detail-page"><view class="word-hero"><view class="word-hero-top"><view class="word-source"><text class="eyebrow">{{ dailyStudy ? '今日单词' : scope.isScoped ? scope.isExternal ? '本章重点词汇' : '本文重点词汇' : '单词详解' }}</text><text v-if="dailyStudy || scope.isScoped" class="word-source-progress">{{ position + 1 }}/{{ studyIndexes.length }}</text></view><text class="favorite-toggle" :class="{active:isFavorite}" @tap="toggleFavorite">{{ isFavorite ? '★' : '☆' }}</text></view><text class="word-display">{{ currentWord.word }}</text><view class="pronounce-row"><text class="pronunciation">{{ currentWord.ipa }}</text></view><view class="word-badges"><text class="tag">{{ currentWord.pos }}</text><text class="tag">{{ currentWord.frequency }}</text><text v-if="dailyStudy && isLearned && !isTodayDone" class="tag prior-learned-tag">曾学过 · 今日待练</text><text v-else-if="isLearned" class="tag learned-tag">✓ 已学完</text></view><text class="meaning">{{ currentWord.meaning }}</text></view><view v-if="content.type === 'officialAccount'" class="card source-card"><text class="detail-label">公众号文章</text><text class="card-title">{{ content.title || '查看关联的公众号文章' }}</text><text class="card-sub">{{ content.summary || '词汇详解内容来自关联的公众号文章。' }}</text><button class="source-button" @tap="openOfficialArticle(content)">阅读公众号原文</button></view><rich-text v-else class="word-detail-content" :nodes="content.html" /></view>
    <template v-if="!readOnly" #fixed-action><view class="fixed-word-action"><button class="primary-button" @tap="beginSpelling">下一步 · 拼写练习</button></view></template>
  </StudyLayout>
</template>
<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import StudyLayout from '../../components/StudyLayout.vue'
import { words, getWordContentSource } from '../index/learning-data.js'
import { localDayKey } from '../../config/daily-words.js'
import { scopedWords, studyWordIndexes, wordStudyQuery } from '../../features/vocab/word-scope.js'
import { loadDailyWordProgress, loadFavoriteWords, loadWordCompletion } from '../../services/study-records.js'
import { openOfficialArticle } from '../../utils/open-official-article.js'
const ready = ref(false)
const item = ref(0)
const readOnly = ref(false)
const dailyStudy = ref(false)
const studyDate = ref('')
const source = ref('article')
const articleIndex = ref(-1)
const seriesIndex = ref(-1)
const chapterIndex = ref(0)
onLoad(options => { item.value = Number(options.item || 0); readOnly.value = options.readonly === '1'; dailyStudy.value = options.study === 'daily'; studyDate.value = options.day || ''; source.value = options.source || 'article'; articleIndex.value = options.article === undefined ? -1 : Number(options.article); seriesIndex.value = options.series === undefined ? -1 : Number(options.series); chapterIndex.value = Number(options.chapter || 0); ready.value = true })
const currentWord = computed(() => words[item.value] || words[0])
const content = computed(() => getWordContentSource(currentWord.value))
const scope = computed(() => scopedWords(source.value,articleIndex.value,seriesIndex.value,chapterIndex.value))
const context = computed(() => ({dailyStudy:dailyStudy.value,studyDate:studyDate.value || localDayKey(),source:source.value,articleIndex:articleIndex.value,seriesIndex:seriesIndex.value,chapterIndex:chapterIndex.value}))
const studyIndexes = computed(() => studyWordIndexes(context.value))
const position = computed(() => studyIndexes.value.indexOf(item.value))
const favoriteIds = ref(loadFavoriteWords())
const completion = ref(loadWordCompletion())
const todayProgress = ref(loadDailyWordProgress(studyDate.value || localDayKey()))
const isFavorite = computed(() => favoriteIds.value.includes(currentWord.value.word))
const isLearned = computed(() => Boolean(completion.value[currentWord.value.word]))
const isTodayDone = computed(() => Boolean(todayProgress.value[currentWord.value.word]))
const scrollTop = ref(0)
onShow(() => { favoriteIds.value = loadFavoriteWords(); completion.value = loadWordCompletion(); todayProgress.value = loadDailyWordProgress(studyDate.value || localDayKey()) })
function syncNextWord({from,to}) { if (item.value !== from || readOnly.value) return; item.value = to; scrollTop.value = 1; nextTick(() => { scrollTop.value = 0 }) }
onMounted(() => uni.$on('readEnglishAdvanceWord',syncNextWord))
onUnmounted(() => uni.$off('readEnglishAdvanceWord',syncNextWord))
function toggleFavorite() {
  favoriteIds.value = isFavorite.value ? favoriteIds.value.filter(id => id !== currentWord.value.word) : [...favoriteIds.value,currentWord.value.word]
  try { uni.setStorageSync('readEnglishWordFavorites',favoriteIds.value); uni.$emit('readEnglishWordFavoritesUpdate') } catch (_) {}
}
function beginSpelling() { uni.navigateTo({url:'/pages/vocab/spell?item=' + item.value + '&from=worddetail' + wordStudyQuery(context.value)}) }
</script>
