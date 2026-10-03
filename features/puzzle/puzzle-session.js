import { puzzleSets } from '../../pages/index/learning-data.js'
import { loadPuzzleProgress, loadRecentItems, savePuzzleProgress, saveRecentItem } from '../../services/study-records.js'

export function recordPuzzleStep(index, cursor, completed = false) {
  const set = puzzleSets[index]
  if (!set) return null
  const progress = savePuzzleProgress(loadPuzzleProgress(), set, cursor, completed)
  const recent = saveRecentItem(loadRecentItems(), 'puzzle', index, set.title, set.subtitle + ' · 拼句练习', {puzzleCursor:cursor,puzzleTotal:set.items.length,puzzleCompleted:completed})
  return {progress,recent}
}

export function startPuzzleSession(index, fromStart = false) {
  const set = puzzleSets[index]
  if (!set) return null
  const saved = loadPuzzleProgress()[set.id] || {cursor:0,completed:false}
  const cursor = fromStart || saved.completed ? 0 : Math.min(saved.cursor || 0,set.items.length - 1)
  const records = recordPuzzleStep(index, cursor, false)
  uni.navigateTo({url:'/pages/puzzle/play?item=' + index + '&sentence=' + cursor})
  return records
}
