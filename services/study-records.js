import { articles, externalSeries } from '../pages/index/learning-data.js'

const keys = {
  recent: 'readEnglishRecent',
  reading: 'readEnglishReadingCompletion',
  words: 'readEnglishWordCompletion',
  favorites: 'readEnglishWordFavorites',
  puzzles: 'readEnglishPuzzleProgress'
}

function read(key, fallback) {
  try { return uni.getStorageSync(key) || fallback } catch (_) { return fallback }
}

export function loadRecentItems() { return read(keys.recent, []) }
export function loadWordCompletion() { return read(keys.words, {}) }
export function loadFavoriteWords() {
  const saved = read(keys.favorites, [])
  return Array.isArray(saved) ? saved : []
}
export function loadDailyWordProgress(dayKey) { return read('readEnglishDailyWordProgress:' + dayKey, {}) }
export function loadPuzzleProgress() { return read(keys.puzzles, {}) }

export function loadReadingCompletion() {
  try {
    const completed = { ...read(keys.reading, {}) }
    let migrated = false
    for (const item of loadRecentItems()) {
      let key = ''
      if (item.type === 'article' && articles[item.index]) key = 'article:' + articles[item.index].id
      if (item.type === 'externalArticle' && externalSeries[item.seriesIndex]?.chapters[item.chapterIndex]) key = 'external:' + externalSeries[item.seriesIndex].id + ':' + item.chapterIndex
      if (key && !completed[key]) { completed[key] = true; migrated = true }
    }
    if (migrated) uni.setStorageSync(keys.reading, completed)
    return completed
  } catch (_) { return {} }
}

export function saveReadingCompletion(current, key) {
  const next = { ...current, [key]: true }
  try { uni.setStorageSync(keys.reading, next); uni.$emit('readEnglishReadingCompletionUpdate') } catch (_) {}
  return next
}

export function saveRecentItem(currentItems, type, index, title, subtitle, extra = {}) {
  const key = extra.seriesIndex !== undefined ? type + ':' + extra.seriesIndex + ':' + extra.chapterIndex : type + ':' + index
  const item = { key, type, index, title, subtitle, time: Date.now(), ...extra }
  const next = [item, ...currentItems.filter(entry => entry.key !== key)]
  try { uni.setStorageSync(keys.recent, next); uni.$emit('readEnglishRecentUpdate') } catch (_) {}
  return next
}

export function savePuzzleProgress(currentProgress, set, cursor, completed = false) {
  const next = { ...currentProgress, [set.id]: { cursor, completed, total: set.items.length, updatedAt: Date.now() } }
  try { uni.setStorageSync(keys.puzzles, next); uni.$emit('readEnglishPuzzleProgressUpdate') } catch (_) {}
  return next
}
