import { articles, externalSeries } from '../../pages/index/learning-data.js'

export function resolveReadingContext(source = 'article', item = 0, chapter = 0) {
  if (source !== 'external') {
    const articleIndex = articles[item] ? item : 0
    return {isExternal:false,articleIndex,seriesIndex:0,chapterIndex:0,series:null,chapter:null,article:articles[articleIndex]}
  }
  const seriesIndex = externalSeries[item] ? item : 0
  const series = externalSeries[seriesIndex]
  const chapterIndex = Math.max(0, Math.min(chapter,series.chapters.length - 1))
  const chapterData = series.chapters[chapterIndex]
  return {
    isExternal:true,articleIndex:0,seriesIndex,chapterIndex,series,chapter:chapterData,
    article:{id:'external-' + series.id + '-' + chapterIndex,title:chapterData.title,translation:series.translation,level:series.level,minutes:chapterData.minutes,icon:series.icon,theme:series.theme,paragraphs:chapterData.paragraphs,translations:chapterData.translations,words:chapterData.words || [],questions:chapterData.questions || [],grammarContentSource:chapterData.grammarContentSource}
  }
}
