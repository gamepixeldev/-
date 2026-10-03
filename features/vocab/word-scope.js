import { articles, externalSeries, words } from '../../pages/index/learning-data.js'
import { dailyWordIndexes, localDayKey } from '../../config/daily-words.js'

export function scopedWords(source = 'article', articleIndex = -1, seriesIndex = -1, chapterIndex = 0) {
  const isExternal = source === 'external'
  const isScoped = isExternal || articleIndex >= 0
  if (!isScoped) return {isExternal,isScoped,article:null,words:[],indexes:[]}
  const article = isExternal ? (externalSeries[seriesIndex] || externalSeries[0]).chapters[chapterIndex] : articles[articleIndex] || articles[0]
  const entries = (article?.words || []).map(id => words.find(word => word.word === id)).filter(Boolean)
  return {isExternal,isScoped,article,words:entries,indexes:entries.map(word => words.indexOf(word))}
}

export function studyWordIndexes({dailyStudy = false,studyDate = '',source = 'article',articleIndex = -1,seriesIndex = -1,chapterIndex = 0}) {
  if (dailyStudy) return dailyWordIndexes(studyDate || localDayKey(), words.length)
  const scope = scopedWords(source,articleIndex,seriesIndex,chapterIndex)
  return scope.isScoped ? scope.indexes : words.map((_,index) => index)
}

export function nextWordIndex(currentIndex, options) {
  const indexes = studyWordIndexes(options)
  const position = indexes.indexOf(currentIndex)
  return indexes[position + 1] ?? -1
}

export function wordStudyQuery({dailyStudy = false,studyDate = '',source = 'article',articleIndex = -1,seriesIndex = -1,chapterIndex = 0}) {
  if (dailyStudy) return '&study=daily&day=' + (studyDate || localDayKey())
  if (source === 'external') return '&source=external&series=' + seriesIndex + '&chapter=' + chapterIndex
  if (articleIndex >= 0) return '&article=' + articleIndex
  return ''
}
